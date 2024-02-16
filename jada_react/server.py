# server.py
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from server_function import dbconnection,sql_select,db_close,analysis_data
import pandas as pd
import tensorflow as tf
import torch
from sentence_transformers import SentenceTransformer, util
import numpy as np
from datetime import datetime

# 차트 분석 모델 
from model.usage_data_model import Usage_Data
from model.usage_pred_model import Pred
from model.data_list_model import Data_List
from datetime import datetime




app = Flask(__name__)
CORS(app)
# socketio = SocketIO(app)
socketio = SocketIO(app, cors_allowed_origins="*")  

model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')

# 엑셀 파일 로드
try:
    df = pd.read_csv('./apply/train_data.CSV')
    print("엑셀 파일 로드 완료..")
except:
    print("엑셀 파일 로드 실패..")

# pt 파일 갱신 및 불러오기
try:
    
    embedding_data = torch.load('./apply/embedding_data1.pt')
    print("임베딩 pt 파일 갱신 및 로드 완료..")
except:
    print("임베딩 pt 파일 갱신 및 로드 실패..")
    
@app.route('/')
def index():
    return "Hello"

# user 사용전력량 가져오기
@app.route('/chat_userdata', methods=['POST'])
def chat_userdata():
    try:
        # 클라이언트에서 전달된 userid를 가져옴
        data = request.json
        cur,conn=dbconnection()
        sql = f"SELECT daily_usage, date    FROM usage_data WHERE user_id = '{data['user_id']}' AND YEAR(DATE) = YEAR(CURDATE()) AND MONTH(DATE) = MONTH(CURDATE())"
        df = sql_select(cur,sql)
        db_close(cur,conn)
        datapost = df.to_json(orient='records')

        # 조회된 데이터를 JSON 형식으로 응답
        return jsonify(datapost)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# int64인 객체를 json으로 직렬화 하는 문제 해결
def analysis_data(df, column_name):
    df_count = df[column_name].value_counts()
    data = {
        "labels": df_count.index.tolist(),
        "count": df_count.values.tolist()
    }
    return data
  
# chatdata 분석데이터
@app.route('/nog_analysis', methods=['POST'])
def nog_analysis():
    try:
        cur,conn=dbconnection()
        sql1 = f"SELECT chat_time,chat_user_id , data_question, user_question,similar    FROM chat_data"
        sql2 = f"SELECT exit_content, exit_date, user_address   FROM user_exit"
        sql3 = f"SELECT chat_time,chat_user_id , data_question, user_question,similar   FROM chat_data ORDER BY similar   LIMIT 30"
        sql4 = f"SELECT exit_content,exit_date, user_address    FROM user_exit"
        df1 = sql_select(cur,sql1)
        df2 = sql_select(cur,sql2)
        df3 = sql_select(cur,sql3)
        df4 = sql_select(cur,sql4)
        db_close(cur,conn)
        df3['chat_time'] = df3['chat_time'].apply(lambda x: int(datetime.timestamp(x) * 1000))
        df4['exit_date'] = df4['exit_date'].apply(lambda x: int(datetime.timestamp(x) * 1000))
        chartdata1 = analysis_data(df1,'data_question')
        chartdata2 = analysis_data(df2,'exit_content')
        df_json1 = df3.to_json(orient='index',force_ascii=False)
        df_json2 = df4.to_json(orient='index',force_ascii=False)

        # 조회된 데이터를 JSON 형식으로 응답
        return jsonify({'chartdata1' : chartdata1,'chartdata2' : chartdata2 , 'similardata' : df_json1, 'exitdata' : df_json2})
        
    except Exception as e:
        print("Error in /nog_analysis:", str(e))
        return jsonify({'error': str(e)}), 500

# 연결된 클라이언트들의 user_id 저장할 딕셔너리
connected_clients = {}

@socketio.on('connect')
def handle_connect():
    # 연결이 성공하면 클라이언트에서 전달된 user_id를 가져와서 저장
    user_id = request.args.get('user_id')
    connected_clients[request.sid] = user_id
    
@socketio.on('disconnect')
def handle_disconnect():
    # 연결이 끊기면 해당 클라이언트의 user_id를 삭제
    user_id = connected_clients.pop(request.sid,None)


@socketio.on('message')
def handle_message(message):
    print('Received message: ', message)
    query = message['Query']

    # 인코딩 후 텐서화
    # query = query.replace(" ","")  # 추가사항
    user_input_encode = model.encode(query)
    user_input_tensor = torch.tensor(user_input_encode)
    # 임베딩데이터와의 코사인 유사도 측정
    cos_sim = util.cos_sim(user_input_tensor, embedding_data)
    print(f"가장 높은 코사인 유사도 idx: {int(np.argmax(cos_sim))}")

    # 선택된 질문 출력
    best_sim_idx = int(np.argmax(cos_sim))
    selected_qes = df['질문(Query)'][best_sim_idx]
    print(f"선택된 질문 = {selected_qes}")

    # 선택된 질문 문장에 대한 인코딩
    selected_qes_encode = model.encode(selected_qes)

    # 유사도 점수 측정
    score = np.dot(user_input_tensor, selected_qes_encode) / (
            np.linalg.norm(user_input_tensor) * np.linalg.norm(selected_qes_encode))
    print(f"선택된 질문과의 유사도 = {score}")

    # 답변
    login_check = df['구분'][best_sim_idx]
    answer = df['답변(Answer)'][best_sim_idx]
    img = df['답변 이미지'][best_sim_idx]
    if score < 0.6:
        answer = "부정확한 질문이거나 답변할 수 없습니다.\n 수일 내로 답변을 업데이트하겠습니다.\n 죄송합니다 :("
        img = '  '
    send_json_data_str = {
        "Query": selected_qes,
        "Login_Check" : str(login_check),
        "Answer": answer,
        "Img" : img
    }

    emit('message', send_json_data_str)
    
    # 클라이언트의 user_id 가져오기
    user_id = connected_clients.get(request.sid,None)
    if user_id:
        print(f'User Id : {user_id}')
    else:
        user_id = 'nonmember'
        print(f'User Id : {user_id}')
    
    # db 저장
    cur,conn=dbconnection()
    sql = f"INSERT INTO chat_data(chat_time,chat_user_id,data_question, user_question,similar)VALUES(CURTIME(),'{user_id}','{selected_qes}','{query}','{score}')"
    sql_select(cur,sql)
    db_close(cur,conn)
    
    
    
    
#====== 마이 홈 차트=========
@app.route("/my_home", methods=["GET"])
def chart_one():
    # 정보를 검색하기 위한 유저 아이디
    user_id = request.args.get("user_id",None)
    # 정보를 검색하기 위한 해당 날짜 지정. 없으면 오늘 기준으로 검색
    input_date = request.args.get("date",None)
    
    usage_data = Usage_Data()
    rs_cnt1, data1= usage_data.get_chart_data_one(user_id,input_date)
    rs_cnt2, data2= usage_data.get_chart_data_two(user_id,input_date)
    rs_cnt0, data0= usage_data.get_all_period(user_id)
    
    data_list = Data_List()
    # 요금 계산
    data1_1 = data_list.get_data_list_four(data1)
    
    # 일자 별 사용량
    rs_cnt3, data3= usage_data.get_most_used_day(user_id, input_date)
    
    data2_1= data_list.get_data_list_two(data2)
    
    # 가장 사용을 많이한 날, 일자별 사용량
    data3_1= data_list.get_data_list_one(data3,user_id)
    
    # 이달 지역 평균, 나의 전년동월, 전년동월 지역 평균
    rs_cnt4, data4 = usage_data.get_last_year_data(user_id,input_date)
    
    usage_data.db.DBClose()
    return jsonify({"data0" : data0,
                    "data1" : data1_1,
                    "data2" : data2_1,
                    "data3" : data3_1,
                    "data4" : data4
                    })
            
@app.route("/pred", methods=["GET"])
def get_pred():
    # 예측하기 위해 유저의 아이디를 파라매터로 받아와야함
    user_id= request.args.get("user_id",None)
    print(f"{user_id}: 예측 요청이 들어옴")
    
    usage_pred = Pred(user_id)
    data_list = Data_List()
    # 이번 달 예측 요금, 최대 예측, 최소 예측
    total, upper, lower = usage_pred.forecast()
    total_bill = data_list.get_calculate_bill(total[0], datetime.now().month)
    return jsonify({"total": total,
                    "total_bill":total_bill
                    })
    
    
    
    
#====== 마이 홈 차트=========
    

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
