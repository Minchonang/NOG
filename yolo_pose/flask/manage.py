### 서버 환경설정하기
# flask 기본 라이브러리
from flask import Flask , jsonify
# GEt/Post 파라메터 받아오는 라이브러리
from flask import request
# HTML 파일을 관리하기 위한 templates 폴더 자동 지정
from flask import render_template
# css, js, 이미지 등 정적 파일 관리 static 폴더 자동 지정
# 파일 임포트
from coin import upbit_control
from coin import  coin_pred



### flask 시작점

app = Flask(__name__)
# coin = Blueprint('coin', __name__)
###############프로그램 영역######################
# 현재 코인가격 차트 보내주기
# http://127.0.0.1:5001/now_coin_chart?ago=400&coinname=KRW-ETH
@app.route("/now_coin_chart/", methods = ["GET"])
def now_coin_chart():
    try:
        ago = request.args.get("ago", 400 ,type=int)
        coin_name = request.args.get("coinname", "KRW-ETH", type=str)

        upbit = upbit_control.upbit_control_class()
        df = upbit.request_upbit_long_data( ago=ago, coin_name = coin_name )
        df.drop(columns = ['unit', 'candle_acc_trade_volume', 'candle_acc_trade_price'], inplace=True)
        df.reset_index(inplace=True, drop=True)
        df_dic = df.to_dict(orient='index')
        return jsonify(df_dic)
    except Exception as e:
        return jsonify({"error":str(e)}), 400
#  현재 코인가격 보내주기
# http://127.0.0.1:5001/now_coin/?coinname=KRW-ETH
@app.route("/now_coin/", methods = ["GET"])
def now_coin():
    try:
        coin_name = request.args.get("coinname", "KRW-ETH", type=str)
        upbit = upbit_control.upbit_control_class()
        df = upbit.request_upbit_data( time_to=upbit.now(), coin_name = coin_name, count = 1 )
        df.drop(columns = ['unit', 'candle_acc_trade_volume', 'candle_acc_trade_price'], inplace=True)
        df.reset_index(inplace=True, drop=True)
        df_dic = df.to_dict(orient="records")
        return jsonify(df_dic)
    except Exception as e:
        return jsonify({"error":str(e)}), 400

#  예측 차트 보내주기 최소 600이상 받아야 합니다.
# http://127.0.0.1:5001/pred_coin_chart/?ago=600&coin_full_name=KRW-ETH_이더리움
@app.route("/pred_coin_chart/", methods = ["GET"])
def pred_coin_chart():
    try:
        ago = request.args.get("ago", 600 ,type=int)
        coin_full_name = request.args.get("coin_full_name", "KRW-ETH_이더리움", type=str)
        coin = coin_pred.coin_class(coin_full_name=coin_full_name , ago = ago)
        now_coin_np = coin.pre_processing()
        y_pred = coin.predict_coin(now_coin_np)
        pred_list = y_pred.reshape(-1).tolist()
        print(pred_list)
        pred_dict = {int(i):pred_list[i] for i in range(len(pred_list))}
        return jsonify(pred_dict)
    except Exception as e:
        return jsonify({"error":str(e)}), 400
#  예측(5분) 코인가격 보내주기
# http://127.0.0.1:5001/pred_coin/?coin_full_name=KRW-ETH_이더리움
@app.route("/pred_coin/", methods = ["GET"])
def pred_coin():
    try:
        coin_full_name = request.args.get("coin_full_name", "KRW-ETH_이더리움", type=str)
        coin = coin_pred.coin_class(coin_full_name=coin_full_name, ago=400)
        pred_coin_np = coin.pre_processing()

        y_pred = coin.predict_coin(pred_coin_np)
        pred_list = y_pred.reshape(-1).tolist()
        pred_dict = {int(i):pred_list[i] for i in range(len(pred_list))}

        return jsonify(pred_dict)
    except Exception as e:
        return jsonify({"error":str(e)}), 400


# todo :

@app.route("/")
def test():
    coin = coin_pred.coin_class( coin_full_name= "KRW-ETH_이더리움", ago = 600 )
    now_coin_np = coin.pre_processing()
    ypred = coin.predict_coin( now_coin_np )
    return render_template(
        "/coin_view/coin_view.html",
        coin_names = ypred
    )



### 프로그램(서버) 시작점
if __name__ == "__main__" :
    # flask 웹 서버 실행


    app.run(
        host = '0.0.0.0',
        port = '5001',
        debug=True
        )