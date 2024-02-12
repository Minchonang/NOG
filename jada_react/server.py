# server.py
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from server_function import dbconnection,sql_select,db_close
import pandas as pd
import tensorflow as tf
import torch
from sentence_transformers import SentenceTransformer, util
import numpy as np


app = Flask(__name__)
CORS(app)
# socketio = SocketIO(app)
socketio = SocketIO(app, cors_allowed_origins="*")  

model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')

# 엑셀 파일 로드
try:
    df = pd.read_excel('./apply/train_data.xlsx')
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

@app.route('/chat_userdata', methods=['POST'])
def chat_userdata():
    try:
        # 클라이언트에서 전달된 userid를 가져옴
        data = request.json
        cur,conn=dbconnection()
        sql = f"SELECT daily_usage, date    FROM usage_data WHERE user_id = '{data['user_id']}' AND YEAR(DATE) = YEAR(CURDATE())"
        df = sql_select(cur,sql)
        db_close(cur,conn)
        datapost = df.to_json(orient='records')

        # 조회된 데이터를 JSON 형식으로 응답
        return jsonify(datapost)
        

    except Exception as e:
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
    if score < 0.3:
        answer = "부정확한 질문이거나 답변할 수 없습니다.\n 수일 내로 답변을 업데이트하겠습니다.\n 죄송합니다 :("

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

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
