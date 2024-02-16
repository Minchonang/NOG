from datetime import datetime
import pandas as pd
import calendar

class Data_List:
    
    # def __init__(self, row_data):
    #     self.row_data = row_data
    ### 요일별 사용량 평균 데이터를 가져오는 함수
    def get_data_list_one(self, row_data, user_id):
        ### 반환 객체 생성
        merged_dict={}
        
        ### 도시 평균 요일 사용량 데이터
        city_data = pd.DataFrame(row_data)
        weekly_city_usage_sum = {
            'Sunday': 0,
            'Monday': 0,
            'Tuesday': 0,
            'Wednesday': 0,
            'Thursday': 0,
            'Friday': 0,
            'Saturday': 0
        }
        city_average = 0
        # 이번 달의 사용량 데이터를 순회하면서 요일별 사용량을 합산
        for i in range(len(city_data)):
            # 1행의 요일 추출
            date = datetime.strptime(str(city_data.loc[i]["date_group"]), '%Y-%m-%d %H:%M:%S')
            day_of_week = calendar.day_name[date.weekday()]  # 요일을 추출
            # 1행의 해당하는 요일에 사용량을 딕셔너리에 합산
            weekly_city_usage_sum[day_of_week] += city_data.loc[i]['daily_usage']/ len(city_data['user_id'].unique())  # 해당 요일의 사용량을 합산

        
        ### 나의 평균 요일 사용량 데이터
        weekly_my_usage_sum = {
            'Sunday': 0,
            'Monday': 0,
            'Tuesday': 0,
            'Wednesday': 0,
            'Thursday': 0,
            'Friday': 0,
            'Saturday': 0
        }

        my_average = 0
        if len(city_data)>0:
            my_data = city_data[city_data["user_id"]==user_id]
            my_data.reset_index(inplace=True ,drop=True)
            # 한달 도시 평균 소비량 추출
            city_average = round(sum(weekly_city_usage_sum.values()) / len(city_data['date_group'].unique()) , 1)
        
     
            if len(my_data)>0:
                for i in range(len(my_data)):
                    # 1행의 요일 추출
                    date = datetime.strptime(str(my_data.loc[i]["date_group"]), '%Y-%m-%d %H:%M:%S')
                    day_of_week = calendar.day_name[date.weekday()]  # 요일을 추출
                    # 1행의 해당하는 요일에 사용량을 딕셔너리에 합산
                    weekly_my_usage_sum[day_of_week] += my_data.loc[i]['daily_usage']
                # 한달 나의 평균 소비량 추출
                my_average = round(sum(weekly_my_usage_sum.values()) / len(my_data) , 1)
        
        
        day_name_ko = {
            "Monday": "월요일",
            "Tuesday": "화요일",
            "Wednesday": "수요일",
            "Thursday": "목요일",
            "Friday": "금요일",
            "Saturday": "토요일",
            "Sunday": "일요일",
        }

        ### 평균 사용량이 많은 요일 구하기
        city_max_day_key = max(weekly_city_usage_sum, key=weekly_city_usage_sum.get)
        my_max_day_key = max(weekly_my_usage_sum, key=weekly_my_usage_sum.get)
        city_max_day_name = day_name_ko[city_max_day_key]
        my_max_day_name = day_name_ko[my_max_day_key]
        # 그 요일의 사용량
        city_max_day_value = weekly_city_usage_sum[city_max_day_key]
        my_max_day_value = weekly_my_usage_sum[my_max_day_key]
        
        # 평균 사용량이 가장 적은 요일 구하기
        city_min_day_key = min(weekly_city_usage_sum, key=weekly_city_usage_sum.get)
        my_min_day_key = min(weekly_my_usage_sum, key=weekly_my_usage_sum.get)
        city_min_day_name = day_name_ko[city_min_day_key]
        my_min_day_name = day_name_ko[my_min_day_key]

        
        city_min_day_value = weekly_city_usage_sum[city_min_day_key]
        my_min_day_value = weekly_my_usage_sum[my_min_day_key]
        
        ### 가장 사용량이 많은 날 추출
        # 모든 유저의 daily_usage 평균을 계산하여 높은 일자 추출
        city_max_day = 1 
        city_min_day = 1 
        my_max_day = 1
        my_min_day = 1
        if len(city_data)>0:
            electricity_use_data = city_data.drop('user_id', axis=1)
            # date를 기준으로 그룹화하고 평균 계산
            monthly_average = electricity_use_data.groupby('date_group',as_index=False).mean()
            monthly_average['date_group'] = pd.to_datetime(monthly_average['date_group'])
            monthly_average['date_group'] = monthly_average['date_group']
            # 최대 값을 가지는 인덱스 추출
            # 최소 값을 가지는 인덱스 추출
            max_index=monthly_average['daily_usage'].idxmax()
            min_index=monthly_average['daily_usage'].idxmin()
            # 최대 값을 가지는 행 추출
            # 최소 값을 가지는 행 추출
            max_row = monthly_average.loc[max_index]
            min_row = monthly_average.loc[min_index]
            # 해당 행의 date 값 추출
            max_date = max_row['date_group']
            min_date = min_row['date_group']
            # 최대 값, 최소 값
            city_max_usage = max_row['daily_usage']
            city_min_usage = min_row['daily_usage']
            # 가장 많이 사용한 일자
            city_max_day = pd.to_datetime(max_date).day
            # 가장 적게 사용한 일자
            city_min_day = pd.to_datetime(min_date).day
            
            ### 나의 가장 사용량이 많은 날 추출
            # 최대값을 가지는 인덱스 추출
            # 최소값을 가지는 인덱스 추출
            my_max_index=my_data['daily_usage'].idxmax()
            my_min_index=my_data['daily_usage'].idxmin()
    
            # 최대값을 가지는 행 추출
            # 최소값을 가지는 행 추출
            my_max_row = my_data.loc[my_max_index]
            my_min_row = my_data.loc[my_min_index]

            # 최대 값, 최소 값
            my_max_usage = my_max_row['daily_usage']
            my_min_usage = my_min_row['daily_usage']
            
            # 해당 행의 date 값 추출
            my_max_date = my_max_row['date_group']
            my_min_date = my_min_row['date_group']
            
            # 가장 많이 사용한 일자
            my_max_day = pd.to_datetime(my_max_date).day
            #  가장 적게 사용한 일자
            my_min_day = pd.to_datetime(my_min_date).day

            # 나의 일별 소비량, 도시 평균 일별 소비량
            merged_dict['city_month_use']= dict(zip(monthly_average['date_group'].dt.day.astype(str), monthly_average['daily_usage']))
            merged_dict['my_month_use']= dict(zip(pd.to_datetime(my_data['date_group']).dt.day.astype(str), my_data['daily_usage']))
        

            # 도시 평균 요일 별 소비량
            merged_dict['weekly_my_usage_sum']=weekly_my_usage_sum
            # 나의 평균 요일 별 소비량
            merged_dict['weekly_city_usage_sum']=weekly_city_usage_sum
            # 나의 일일 평균 사용량, 도시 일일 평균 사용량
            merged_dict['average']=[round(my_average,1),round(city_average,1), round((my_average-city_average),1) ]

            # 나의 가장 많이 소비한 날, 도시 평균 가장 많은 소비를 한 날
            # 나의 가장 적게 소비한 날, 도시 평균 가장 적은 소비를 한 날
            merged_dict['max_month']=[my_max_day, city_max_day, my_max_usage ,  city_max_usage]
            merged_dict['min_month']=[my_min_day, city_min_day, my_min_usage ,  city_min_usage]
            
            # 나의 가장 많이 소비한 요일 도시 평균 가장 많은 소비를 한 요일
            # 나의 가장 적게 소비한 요일 도시 평균 가장 적게 소비를 한 요일
            merged_dict['max_day']=[my_max_day_name, city_max_day_name, my_max_day_value ,  city_max_day_value]
            merged_dict['min_day']=[my_min_day_name, city_min_day_name, my_min_day_value ,  city_min_day_value]
        
        return merged_dict     
    
    def get_data_list_two(self, row_data):
        ### 나의 총 사용량
        total_usage = row_data[0]["usage_23_4"] + row_data[0]["usage_5_10"] + row_data[0]["usage_11_16"] + row_data[0]["usage_17_22"]

        ###시간별 사용 비율
        usage_23_4 =  0
        usage_5_10 = 0
        usage_11_16 = 0 
        usage_17_22 = 0
        if total_usage != 0:
            usage_23_4 =  round(row_data[0]["usage_23_4"] / total_usage * 100 , 1)
            usage_5_10 = round(row_data[0]["usage_5_10"] / total_usage * 100, 1) 
            usage_11_16 = round(row_data[0]["usage_11_16"] / total_usage * 100, 1) 
            usage_17_22 = round(row_data[0]["usage_17_22"] / total_usage * 100, 1) 

        # 딕셔너리화
        usage_percentage = {'심야,새벽': usage_23_4, '오전': usage_5_10, '오후': usage_11_16, '저녁': usage_17_22}
        
        ### 직전달 도시 사용량
        city_usage = {'usage_23_4': round(row_data[1]["usage_23_4"],1),
                    'usage_5_10': round(row_data[1]["usage_5_10"],1), 
                    'usage_11_16': round(row_data[1]["usage_11_16"],1),
                    'usage_17_22': round(row_data[1]["usage_17_22"],1) }

        ### 이달 나의 사용량
        my_usage = {'usage_23_4': round(row_data[0]["usage_23_4"],1),
                    'usage_5_10': round(row_data[0]["usage_5_10"],1), 
                    'usage_11_16': round(row_data[0]["usage_11_16"],1),
                    'usage_17_22': round(row_data[0]["usage_17_22"],1) }

        # 딕셔너리 중 제일 높은 비율을 가지고 있는 키값을 추출
        max_key = max(usage_percentage, key=usage_percentage.get)
        
        result={}
        result["user_name"] = row_data[0]["user_info"]
        result["city_name"] = row_data[1]["user_info"]
        result["usage_percentage"] = usage_percentage
        result["user_type"] = max_key
        result["my_usage"] = my_usage
        result["city_usage"] = city_usage
        
        return result
            
    
    def get_data_list_four(self,data):
        my_total_usage= data["my_total_usage"]
        my_total_usage_last= data["my_total_usage_last"]
        average_total_usage = data["average_total_usage"]
        this_month = data["this_month"]
        before_city_month = data["before_city_month"]
        user_id= data["user_id"]
        
        result={}
        result["average_total_usage"]=average_total_usage
        result["before_city_month"]= before_city_month
        result["my_total_usage"]=my_total_usage
        result["my_total_usage_last"]=my_total_usage_last
        result["this_month"]=this_month
        result["user_id"]=user_id
        result["my_this_month_bill"]= self.get_calculate_bill( my_total_usage,this_month)
        result["my_before_month_bill"]=self.get_calculate_bill( my_total_usage_last,before_city_month)
        result["city_before_month_bill"]=self.get_calculate_bill( average_total_usage,before_city_month)
        
        return result
                
    def get_calculate_bill(self,usage, month):
    
        bill = 0
        summer_months = [7, 8, "7", "8"]
        if str(month) in summer_months:
            if usage <= 300:
                bill = 730
                bill += usage * 105
            elif usage <= 450:
                bill = 1260
                bill += 300 * 105 + (usage - 300) * 174
            else:
                bill = 6060
                bill += 300 * 105 + 150 * 174 + (usage - 450) * 242.3
        else:
            if usage <= 200:
                bill = 730
                bill += usage * 105
            elif usage <= 400:
                bill = 1260
                bill += 200 * 105 + (usage - 200) * 174
            else:
                bill = 6060
                bill += 200 * 105 + 200 * 174 + (usage - 400) * 242.3

        return round(bill,0)