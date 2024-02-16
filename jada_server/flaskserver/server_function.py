import pandas as pd

import pymysql


# db 접속
def dbconnection():
    # 접속정보
    host = "35.87.206.219"
    user = "Jada"
    password = "think2na"
    db = "Jada"
    charset = "utf8"
    #조회시 컬럼명을 동시에 보여줄지 여부 설정
    cursorclass = pymysql.cursors.DictCursor
    autocommit = True
    # DB접속하기
    try:
        conn = pymysql.connect(host=host,
                               user = user,
                               password = password,
                               db=db,
                               charset=charset,
                               autocommit=autocommit,
                               cursorclass = cursorclass)
        print("DB접속 성공>>>",conn)
    except:
        print("DB Server Checking...")
    cur = conn.cursor()
    return cur,conn

# db에서 sql 구문을 통해 데이터 조회 및 데이터프레임에 저장
def sql_select(cur,sql):
    rs_cnt= cur.execute(sql)
    rows = cur.fetchall()
    print(rs_cnt,"건이 조회되었습니다")
    df = pd.DataFrame(rows)
    return df

# db 커서와 접속정보 반납
def db_close(cur,conn):
    try:
        cur.close()
        conn.close()
    except:
        print("이미 모든 커서와 접속정보가 반납되었습니다")

def analysis_data(df,condition):
    df_count = df[condition].value_counts()
    data = {
    'labels' : [i for i in df_count.index],
    'datasets':[{
    'label' :'빈도수',
    'data' : [i for i in df_count.values],
    'backgroundColor':'white',
    'borderColer' : 'rgba(75, 192, 192, 1)',
    'borderWidth' :1
    }]}
    return data