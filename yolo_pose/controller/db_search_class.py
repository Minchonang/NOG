


import pymysql

import pandas as pd


class PowerClass:
    def __init__(self):
        pass
    # 시작
    def start(self):
        try:
            self.conn = pymysql.connect(host = "35.87.206.219",
                                        user = "jada_home",
                                        password = "1q2w3e4r",
                                        db = "Jada",
                                        charset = "utf8",
                                        autocommit = True,
                                        cursorclass = pymysql.cursors.DictCursor)
            # print("DB 접속 성공", self.conn)
        except:
            print("DBserver check...")
        self.cur = self.conn.cursor()
        
    
    # 조회
    def select(self, sql):
        self.start()
        rs_cnt = self.cur.execute(sql)
        
        if rs_cnt >1:
            print(f'{rs_cnt}건 조회')
            read = self.cur.fetchall()
            df = pd.DataFrame(read)
            self.exit()
            return df
        elif rs_cnt == 1:
            print(f'{rs_cnt}건 조회')
            read = self.cur.fetchall() #list(self.cur.fetchone())+  list(self.cur.fetchone().values())  
            df = pd.DataFrame(read)
            self.exit()
            return df
        else: print('조회될건이 없습니다.')
        self.exit()
        
    # 입력
    def insert(self,sql):
        self.start()
        rs_cnt = self.cur.execute(sql)
        if rs_cnt>=1:
            print(f'{rs_cnt}건 입력됨')
        else:
            print('입력된 것이 없거나 오류')
        self.exit()
        
    # 수정
    def update(self, sql):
        self.start()
        rs_cnt = self.cur.execute(sql)
        if rs_cnt>=1:
            print(f'{rs_cnt}건 수정됨')
        else:
            print('수정된 것이 없거나 오류')
        self.exit()
        
    # 삭제
    def delete(self,sql):
        self.start()
        rs_cnt = self.cur.execute(sql)
        if rs_cnt>=1:
            print(f'{rs_cnt}건 삭제됨')
        else:
            print('삭제된 것이 없거나 오류')
        self.exit()
        
    # 종료
    def exit(self):
        #접속종료
        try:
            print('접속해제')
            self.cur.close()
            self.conn.close()
        except:
            print("이미 꺼짐")
            
