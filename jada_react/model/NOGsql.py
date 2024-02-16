### 데이터베이스 처리 순서
# - DB 드라이버 연결
import pymysql

class NOGsql_Model :
    ### 생성자
    def __init__(self) :
        # DB 접속정보 정의
        self.initDBInfo()
        
        # DB 접속
        self.DBConnection()
        
        # DB로부터 cursor 받아오기
        self.DBCursor()
        
        
    ### DB 접속정보 정의
    def initDBInfo(self) :
        self.host = "35.87.206.219"
        self.user = "Jada"
        self.password = "think2na"
        self.db = "Jada"
        # 문자 인코딩 타입
        self.charset = "utf8"
        # 조회 시 컬럼명을 동시에 보여줄지 여부 설정
        self.cursorclass = pymysql.cursors.DictCursor
        # 입력/수정/삭제 시 DB에 자동 반영 여부
        self.autocommit = True
        
    # - DB 접속
    def DBConnection(self) :
        try :
            self.conn = pymysql.connect(
                            host = self.host,
                            user = self.user,
                            password = self.password,
                            db = self.db,
                            charset = self.charset,
                            cursorclass = self.cursorclass,
                            autocommit = self.autocommit,
                            port= 3306
                        )
            print("DB 접속 성공 --> ", self.conn)
            
        except :
            print("DB 접속 정보 확인이 필요함!!")
           
    # - DB로부터 cursor 받아오기
    def DBCursor(self) :
        self.cur = self.conn.cursor()
    
    # - DB 자원 반환
    def DBClose(self) :
        try :
            self.cur.close()
            self.conn.close()
            print("DB 정보 반환 완료....")
        except :
            print("이미 DB 정보가 반환되었습니다.")