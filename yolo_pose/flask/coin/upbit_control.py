import datetime
import pandas as pd
import requests

class upbit_control_class:
    def __init__(self):
        self
        # 코인 이름 반환
    def coin_names(self):
        url = "https://api.upbit.com/v1/market/all?isDetails=false"
        headers = {"accept": "application/json"}
        response = requests.get(url, headers=headers)
        # coin_names = []
        # for row in response.json():
        #     korean_name = row.get('korean_name')
        #     market = row.get('market')
        #     # 코인 이름 리스트로 담기
        #     coin_names.append([market,korean_name])
        #     # print(market, korean_name)
        return response.json()
    
    # 업비트가요구하는 형태의 시간
    def now(self):
        now = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:00')
        return now

    def now_and_200min_ago(self):
        now = datetime.datetime.now()
        ago = now - datetime.timedelta(minutes=200)
        return now.strftime('%Y-%m-%dT%H:%M:00'), ago.strftime('%Y-%m-%dT%H:%M:00')
    def now_and_long_ago(self, long):
        """
        200 단위로 넣어야 합니다....
        :param : long = 400이상 200단위 int
        :return: list
        """
        now = datetime.datetime.now()
        ran = long / 200
        rs = []
        for i in range(int(ran)):
            temp_ago = now - datetime.timedelta(minutes=200 * i)
            rs.append( temp_ago.strftime('%Y-%m-%dT%H:%M:00') )
        return rs

    # 업비트 데이터 반환
    def request_upbit_data(self, time_to, count=180, coin_name="KRW-BTC"):
        url = "https://api.upbit.com/v1/candles/minutes/1?market=%s&count=%03d&to=%s" %(coin_name, count, time_to)
        headers = {"accept": "application/json", "Accept-Encoding": "gzip"}
        response = requests.get(url, headers=headers)
        # response
        rs = pd.DataFrame()
        for row in response.json():
            temp_df = pd.DataFrame([row])
            rs = pd.concat([rs, temp_df], axis=0 )
        rs.sort_values(by='candle_date_time_utc',ascending=True, inplace=True)
        return rs

    def request_upbit_now_400_data(self, coin_name="KRW-BTC"):
        now ,ago = self.now_and_200min_ago()
        count = 200
        now_url = "https://api.upbit.com/v1/candles/minutes/1?market=%s&count=%03d&to=%s" %(coin_name, count, now)
        ago_url = "https://api.upbit.com/v1/candles/minutes/1?market=%s&count=%03d&to=%s" %(coin_name, count, ago)
        headers = {"accept": "application/json", "Accept-Encoding": "gzip"}
        rs_400 = pd.DataFrame()
        for url in [now_url, ago_url]:
            response = requests.get(url, headers=headers)
            # response
            rs = pd.DataFrame()
            for row in response.json():
                temp_df = pd.DataFrame([row])
                rs = pd.concat([rs, temp_df], axis=0 )
            rs_400 = pd.concat([rs_400, rs], axis=0 )

        rs_400.sort_values(by='candle_date_time_utc',ascending=True, inplace=True)
        return rs_400
    def request_upbit_long_data(self, ago=1000 ,coin_name="KRW-BTC"):
        time_str_list = self.now_and_long_ago(ago)
        count = 200
        rs_long_df = pd.DataFrame()
        for time in time_str_list:
            temp_url = "https://api.upbit.com/v1/candles/minutes/1?market=%s&count=%03d&to=%s" %(coin_name, count, time)
            headers = {"accept": "application/json", "Accept-Encoding": "gzip"}
            response = requests.get(temp_url, headers=headers)
            # response
            rs = pd.DataFrame()
            for row in response.json():
                temp_df = pd.DataFrame([row])
                rs = pd.concat([rs, temp_df], axis=0 )
            rs_long_df = pd.concat([rs_long_df, rs], axis=0 )
        rs_long_df.sort_values(by='candle_date_time_utc',ascending=True, inplace=True)
        return rs_long_df


if __name__ == "__main__":
    upbit = upbit_control_class()
    temp = upbit.request_upbit_data( time_to= upbit.now(), count=200 ,coin_name="KRW-LSK" )
    print(upbit.request_upbit_long_data(1000))

    pass
