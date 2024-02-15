### 서버 환경설정하기
# flask 기본 라이브러리
from flask import Flask

# GEt/Post 파라메터 받아오는 라이브러리
from flask import request

# HTML 파일을 관리하기 위한 templates 폴더 자동 지정
from flask import render_template

# css, js, 이미지 등 정적 파일 관리 static 폴더 자동 지정
from flask import url_for


# 파일 임포트
from coin.upbit_control import upbit_control

### flask 시작점
app = Flask(__name__)

###############프로그램 영역######################


@app.route("/")
def test():
    upbitcls= upbit()
    coin_names = upbitcls.coin_names()
    return render_template(
        "/coin_view/coin_view.html",
        coin_names = coin_names
    )

# 데이터 여러 건 조회하기
# - 장바구니 리스트 조회하기
# - /cart_list/
@app.route("/cart_list/")
def cart_list() :
    ### model(DB) 처리
    # Cart 생성하기
    cart =Cart()
    # 카트리스트 전체 정보 조회하기
    cart_cnt, cart_list = cart.getCartList()
    # 반환
    return render_template(
        "/cart/cart_list.html", # html파일 위치
        cart_cnt = cart_cnt, # 딕셔너리 형태로 자동으로 넘어감
        cart_list = cart_list
    )

@app.route("/mem_view/", methods = ["GET"]) # or ["POST"]
def mem_view():
    # 요청 파라메터 받기 : request 가 가지고 있습니다.

    mem_id = request.args.get("mem_id", "none")
    # mem_id = request.form.get("mem_id", "none") # POST
    
    # DB조회하기
    member = Member()
    rs_cnt, mem_view = member.getMemberView(mem_id)
    
    return render_template(
                "/member/mem_view.html",
                mem_view = mem_view
            )

###############################################



### 프로그램(서버) 시작점
if __name__ == "__main__" :
    # flask 웹 서버 실행

    app.run(
        host = '0.0.0.0',
        port = '5000',
        debug=True
        )