### 데이터베이스와 관련된 설정
# 데이터베이스 처리 순서
# - DB 드라이버 연결 (pymysql)
import pymysql
class Mysql_model:
    def __init__(self):
        self.initDBInfo()
        self.DBConnection()
        self.DBCursor()
    # DB접속정보를 정의
    def initDBInfo(self):
        self.host = "35.87.206.219"
        self.user = "Jada" # Jada
        self.password = "think2na"
        self.db = "Jada"
        self.charset = "utf8" # 문자 인코딩 타입
        # 조회 시 컬럼명 동시에 보여줄 지 여부
        self.cursorclass = pymysql.cursors.DictCursor
        # 입력/수정/삭제 시 DB에 자동 반영 여부
        self.autocommit = True
# - DB 접속
    def DBConnection(self):
        try: 
            self.conn = pymysql.connect(
                                host = self.host,
                                user = self.user,
                                password = self.password,
                                db = self.db,
                                charset = self.charset,
                                cursorclass = self.cursorclass,
                                autocommit = self.autocommit
                            )
            print("db접속성공")
        except Exception as e:
            print("db접속확인필요", e)
# - DB로부터 cursor 받아오기
    def DBCursor(self):
        self.cur = self.conn.cursor()

# - 조회/입력/수정/삭제 sql을 DB서버로 요청
# -cart_model.py 에서 처리
# - DB자원 반환

    def DBClose(self):
        try:
            self.cur.close()
            self.conn.close()
            print("DB정보 반환 완료")
        except:
            print("이미 db정보가 반환되었습니다.")