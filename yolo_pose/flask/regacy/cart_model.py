# select 구문으로 데이터베이스와 연결
import pymysql
# 장고에서는 앱 이름부터 호출합니다.
from model.mysql import Mysql_model

# class Cart:
#     #생성자
#     def __init__(self) :
#         self.db = Mysql_model()
#     # 장바구니 전체 조회하기
#     def getCartList(self): #select * from home_data;
#         sql = """
#             select * from home_data ;
#             """
#         # DB에 요청하기 :cursor에 담기
#         # 실행 결과의 건수
#         rs_cnt = self.db.cur.execute(sql)
        
#         # 실행 결과 데이터
#         rows = self.db.cur.fetchall()
        
#         # DB 정보 반환하기
#         self.db.DBClose()
#         return rs_cnt, rows