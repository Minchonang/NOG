import datetime
import calendar
import pandas as pd
from datetime import datetime
# from NOGsql import NOGsql_Model
import pmdarima as pm
from pmdarima.arima import ndiffs
import numpy as np
from model.NOGsql import NOGsql_Model

class Pred:
    # 생성자로 회원 아이디와 검색을 원하는 날짜를 받아옴
    def __init__(self,user_id):
        # db 연결
        self.db = NOGsql_Model()
        self.user_id = user_id
        self.today = datetime.today()
        # db에서 데이터 가져오기
        # rs_cont 가져온 데이터 수, data = 데이터
        self.rs_cont, self.data = self.getUsageData(user_id)
        # 시계열 모델 생성
        self.model = self.getModel()
        # 예측 기간 생성
        self.pred_period= self.get_pred_period()
        
    ### 이달의 소비 전력량, 도시인구의 전달의 소비 전력량
    def getUsageData(self, id):
       
        today = self.today.strftime('%Y-%m-%d 23:59:59')
        print("검색된 아이디",id)
  
         
        sql = f"""
                SELECT `daily_usage`,`date` 
                FROM usage_data
                WHERE user_id = '{id}'
                AND `date` <= '{today}';
            """
  
        ### DB 에 요청하기 cursor에 담기
        # 실행 결과의 갯수
        rs_cnt = self.db.cur.execute(sql)     
        
        # 실행 결과 데이터 
        rows = self.db.cur.fetchall()
        return rs_cnt, rows

    # 데이터 전처리 후 모델 생성
    def getModel(self):
        df = pd.DataFrame(self.data)
        print( "dfdf",df , "row 수", self.rs_cont)

        # 검색된 데이터가 없을 경우 오늘 기준 사용량 0으로 데이터 생성
        if self.rs_cont == 0:
            ori_data = pd.Series([0.0,0.0], index=[datetime.today().strftime('%Y-%m-%d'),datetime.today().strftime('%Y-%m-%d')])
        else:    
            ori_data = df.groupby(pd.Grouper(key='date', freq='D')).sum()
            ori_data = ori_data["daily_usage"]
            daily_gouped_count =  len(df.groupby(df['date'].dt.date)['daily_usage'].sum())
        
        # 현재는 불필요하지만 추후 추가 기능을 부여하게 될 것을 대비해 데이터를 분류하여 진행
        train_data = ori_data[: int(len(ori_data) * 0.9)]
        test_data =ori_data[int( len(ori_data) * 0.9):]
        
        ### 모델 생성
        # n_diffs: 정상 데이터로 만들기 위한 차분 횟수
        # alpha : p-value 유의기준 (0.5)
        # test : 차분 횟수를 결정하는데 사용할 테스트 방법
        # max_d: 최대 차분 횟수
        n_diffs=1
        if daily_gouped_count >60 :
            max_d = int(daily_gouped_count/60)
            n_diffs = ndiffs(ori_data, alpha = 0.05, test="adf", max_d=max_d)
        model = pm.auto_arima(y=train_data,
                                  d=n_diffs,
                                  start_p=0,    # AR 범위 시작값 
                                  max_p=3,      # AR 범위 마갑 값   
                                  start_q=0,    # AR 범위
                                  max_q=3,      # MA 범위
                                  m=1,          # 계절 특성 부여 수
                                  seasonal=False, # 계절적 특성 여부
                                  stepwise=True, # 최적의 모수를 찾기 위한 알고리즘 적용 여부
                                  trace=False) # 결과 출력 여부
        return model
    
    # 예측을 원하는 기간 생성
    def get_pred_period(self):

        today= self.today
            
        # 예측 시작일
        start_point =str(today).split()[0].replace("-","/")
        # 해당 월의 마지막 날을 엔드 포인트로 지정
        end_point=datetime(today.year, today.month, calendar.monthrange(today.year, today.month)[1])
        end_point=str(end_point).split()[0].replace("-","/")
        
        pred_period= pd.date_range(start=f"{start_point}",
                           end=f"{end_point}",
                           freq="1d",
                         )
        print("시작일",pred_period)
        return pred_period
        
    # 예측 함수
    def forecast_n_step(self, model, n=1):
        
        # - n_periods : 예측기간(일단위)
        # - return_conf_int : 신뢰구간 반환여부
        # - fc : 예측결과(y_pred)
        # - conf_int : 신뢰구간
        fc, conf_int = model.predict(n_periods=n, return_conf_int=True)

        # 반환 값은 리스트 형태로 변환해서 전달
        return(
            fc.tolist()[0:n],
            np.asarray(conf_int).tolist()[0:n]
        )

    # 예측 반복 실행 함수
    def forecast(self):
        if len(self.data)==0:
            return [0], [0], [0]
        # 결과값을 담아서 반환할 변수
        y_pred = []
        pred_upper = []
        pred_lower = []
 
        for i in range(len(self.pred_period)):
            ### 예측하기 : 반복수행을 위해 함수로 생성
            fc, conf = self.forecast_n_step(self.model)

            ### 예측 결과 리스트에 담기
            y_pred.append(fc[0])

            ### 예측 최대
            pred_upper.append(conf[0][1])

            ### 예측 최소
            pred_lower.append(conf[0][0])

            ### 데이터별로 model을 갱신
            # self.model.update(fc[0])
            
            ### 이번 달 어제까지 사용한 금액 데이터 
            df = pd.DataFrame(self.data)
            this_month_data = df[df['date'].dt.year == self.today.year]  # 올해 데이터 필터링
            this_month_data = this_month_data[this_month_data['date'].dt.month == self.today.month]  # 이번 달 데이터 필터링
            this_month_until_yesterday_data = this_month_data[this_month_data['date'].dt.day <= self.today.day] # 어제 까지의 데이터 필터링
            this_month_until_yesterday_data = this_month_until_yesterday_data.groupby(pd.Grouper(key='date', freq='D')).sum() # 일별로 그룹화     
        
        # 시리즈 타입으로                  
        pred = pd.Series(y_pred, index=self.pred_period).sum()
        print (pred)    
        print (this_month_until_yesterday_data.sum())    
        
        total = round(pred + this_month_until_yesterday_data.sum(),0).tolist()
        
        return total, pred_upper, pred_lower
    



    
 