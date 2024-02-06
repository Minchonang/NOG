
from PyQt5.QtGui import QPixmap, QImage

import sys
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QRadioButton, QGridLayout,\
    QVBoxLayout, QButtonGroup, QDateTimeEdit , QSpinBox

from PyQt5.QtCore import QDateTime,QTimer

from controller.yolo_8_security import ObjectDetection
from controller.db_search_class import PowerClass
# from controller.home_func import Homefunc

class HomeApp(QWidget, ):
    def __init__(self):
        super().__init__()
        self.dbsearch = PowerClass()
        self.initUI()
        # 수정된 setup video capture
        self.detector = ObjectDetection(capture_index=0, frame_width=640, frame_height=480)
        
        # update_frame을 30ms마다 호출
        self.timer_for_update_frame = QTimer(self)
        self.timer_for_update_frame.timeout.connect(self.update_frame)
        self.timer_for_update_frame.start(150)

        # set_current_time_box 를 1s마다 호출 
        self.timer_per_second = QTimer(self)
        self.timer_per_second.timeout.connect(self.set_current_time_box)
        self.timer_per_second.start(1000)
        
        # set_remain_count_box 를 1s마다 호출
        self.timer_remain_count_box = QTimer(self)
        self.timer_remain_count_box.timeout.connect(self.set_remain_count_box)
        self.timer_remain_count_box.start(1000)
        
        
        # human_count_to_db 를 30s마다 호출
        self.timer_per_thirty_seconds = QTimer(self)
        self.timer_per_thirty_seconds.timeout.connect(self.human_count_to_db)
        self.timer_per_thirty_seconds.start(30000)  # 30초마다 호출
        
        
        # default_search 를 30s마다 호출
        self.timer_query_clicked = QTimer(self)
        self.timer_query_clicked.timeout.connect(self.default_search)
        self.timer_query_clicked.start(10000) # 10초마다 호출


        ## input_defalt_value 를 10s마다 호출
        self.timer_for_input_defalt_value = QTimer(self)
        self.timer_for_input_defalt_value.timeout.connect(self.input_defalt_value)
        self.timer_for_input_defalt_value.start(10000)
        

    def initUI(self):
        self.grid = QGridLayout()
        self.setLayout(self.grid)

        # 첫 번째 행: 현재 전력량, 입력 박스, 입력 버튼
        self.grid.addWidget(QLabel('home_id'), 1, 1)
        self.home_id_box = QLineEdit()
        self.home_id_box.setText("10")
        self.grid.addWidget(self.home_id_box, 1, 2)
        
        self.grid.addWidget(QLabel('현재 전력량'), 1, 3)
        self.now_elec_box = QLineEdit()
        self.now_elec_box.setText("1024") # 기본값
        self.grid.addWidget(self.now_elec_box, 1, 4)

        self.grid.addWidget(QLabel('현재온도'), 1, 5)
        self.temperature_box = QLineEdit()
        self.temperature_box.setText("24") # 실행시 기본 현재온도 24설정
        self.grid.addWidget(self.temperature_box, 1, 6)
        
        self.grid.addWidget(QLabel('설정온도'), 1, 7)
        self.set_temp_box = QSpinBox()
        self.set_temp_box.setMinimum(16)
        self.set_temp_box.setMaximum(30)
        self.set_temp_box.setValue(24) # 실행 시 기본온도 24도 설정
        self.set_temp_box.valueChanged.connect(self.temp_value_to_db)
        self.grid.addWidget(self.set_temp_box, 1, 8)
        
        self.input_butten = QPushButton('input')
        self.input_butten.clicked.connect(self.input_defalt_value)
        self.grid.addWidget(self.input_butten, 1, 9)

        # 에어컨 행 라디오 버튼 그룹
        self.radio_group1 = QButtonGroup(self)
        self.radio_on1 = QRadioButton('ON')
        self.radio_on1.toggled.connect(self.radio1_toggle)
        self.radio_off1 = QRadioButton('OFF')
        self.radio_off1.toggled.connect(self.radio1_toggle)
        self.radio_group1.addButton(self.radio_on1)
        self.radio_group1.addButton(self.radio_off1)
        # self.radio_group1.buttons()[1].setChecked(True)
        self.grid.addWidget(QLabel('에어컨'), 2, 1)
        self.grid.addWidget(self.radio_on1, 2, 2)
        self.grid.addWidget(self.radio_off1, 2, 3)
    
        # 보일러 행 라디오 버튼 그룹
        self.radio_group2 = QButtonGroup(self)
        self.radio_on2 = QRadioButton('ON')
        self.radio_on2.toggled.connect(self.radio2_toggle)
        self.radio_off2 = QRadioButton('OFF')
        self.radio_off2.toggled.connect(self.radio2_toggle)
        self.radio_group2.addButton(self.radio_on2)
        self.radio_group2.addButton(self.radio_off2)
        # self.radio_group2.buttons()[1].setChecked(True)
        self.grid.addWidget(QLabel('보일러'), 3, 1)
        self.grid.addWidget(self.radio_on2, 3, 2)
        self.grid.addWidget(self.radio_off2, 3, 3)
    
        # 전등 행 라디오 버튼 그룹
        self.radio_group3 = QButtonGroup(self)
        self.radio_on3 = QRadioButton('ON')
        self.radio_on3.toggled.connect(self.radio3_toggle)
        self.radio_off3 = QRadioButton('OFF')
        self.radio_off3.toggled.connect(self.radio3_toggle)
        self.radio_group3.addButton(self.radio_on3)
        self.radio_group3.addButton(self.radio_off3)
        # self.radio_group3.buttons()[1].setChecked(True)
        self.grid.addWidget(QLabel('전등'), 4, 1)
        self.grid.addWidget(self.radio_on3, 4, 2)
        self.grid.addWidget(self.radio_off3, 4, 3)
        
        # QDateTimeEdit 섹션
        lbl = QLabel('날짜 및 시간 선택:')
        self.datetimeedit = QDateTimeEdit(self)  # 날짜 및 시간 선택 위젯
        self.datetimeedit.setDisplayFormat('yyyy-MM-dd HH:mm:ss')
        self.in_counts_box = QLineEdit(self)
        self.out_counts_box = QLineEdit(self)
        self.remain_counts_box = QLineEdit(self)

        # QVBoxLayout에 QDateTimeEdit 추가
        self.vbox_widget = QWidget()
        vbox = QVBoxLayout(self.vbox_widget)
        # self.vbox_widget.setLayout(vbox)
        self.vbox_widget.setVisible(True)
        vbox.addWidget(lbl)
        vbox.addWidget(self.datetimeedit)
        vbox.addWidget(self.in_counts_box)
        vbox.addWidget(self.out_counts_box)
        vbox.addWidget(self.remain_counts_box)
        
        # 조회 버튼 추가
        self.queryButton = QPushButton('조회', self)
        self.queryButton.clicked.connect(self.default_search) # 클릭 이벤트 연결
        vbox.addWidget(self.queryButton)
        # v박스를 전체레이어에 추가
        self.grid.addWidget(self.vbox_widget, 5, 1)


        # 비디오 스트리밍을 위한 QLabel 추가
        self.video_label = QLabel(self)
        self.video_label.resize(640,480) # 640, 480 # 320,240
        self.grid.addWidget(self.video_label, 6, 1, 10, 10) # 비디오 라벨을 그리드 레이아웃에 추가

        # 윈도우 설정
        self.setGeometry(50, 50, 640, 700)
        self.setWindowTitle('Home')
        self.show()


        ############################################# 로직 부분
        ### 로직추가
        # incount, outcount로 incount-outcount 가 <=0 이면 전등 off로직 구현 

    
    def update_frame(self):
        ret, frame = self.detector.cap.read()
        if not ret:
            return  # 프레임을 읽지 못하면 함수 종료
        # 생성된 카운터 클래스로 다시 모델 카운트 하기
        self.in_counts, self.out_counts, processed_frame = self.detector.model_count()
        # text_box도 업데이트하기
        self.in_counts_box.setText(str(self.in_counts))
        self.out_counts_box.setText(str(self.out_counts))

        if processed_frame is not None:
            height, width, channel = processed_frame.shape
            qimage = QImage(processed_frame.data, width, height, QImage.Format_RGB888).rgbSwapped()
            self.video_label.setPixmap(QPixmap.fromImage(qimage))


    ###############################db에 전달 기능입니다.##################

    def default_search(self):
        # 선택된 날짜 및 시간을 문자열 형식으로 변환
        # MariaDB에서 상태 가져오기
        try:
            rs = self.dbsearch.select(f"""
                    select airconditioner, heater, light, set_temp from home_device
                    where home_id = "{self.home_id_box.text()}";
            """)
            # 에어컨 상태 설정
            if rs['airconditioner'][0] == True:
                self.radio_group1.buttons()[0].setChecked(True)  # ON
            else:
                self.radio_group1.buttons()[1].setChecked(True)  # OFF
    
            # 보일러 상태 설정7
            if rs['heater'][0] ==  True:
                self.radio_group2.buttons()[0].setChecked(True)  # ON
            else:
                self.radio_group2.buttons()[1].setChecked(True)  # OFF
    
            # 전등 상태 설정
            if rs['light'][0] == True:
                self.radio_group3.buttons()[0].setChecked(True)  # ON
            else:
                self.radio_group3.buttons()[1].setChecked(True)  # OFF
                
            # set_temp 설정
            self.set_temp_box.setValue(rs['set_temp'][0])
            
        except Exception as e:
            print("default_search error : ", e)
        

    def input_defalt_value(self):
        ## 아이디가 숫자인지 영문인지 판단하는 로직 추가
        selected_datetime = self.datetimeedit.dateTime().toString("yyyy-MM-dd HH:mm:ss.000")
        try:
            self.dbsearch.insert(
            f"""
            INSERT INTO home_data (home_data_id, date_time, temperature, power_usage)
            VALUES ({self.home_id_box.text()}, "{selected_datetime}",
            {self.temperature_box.text()}, {self.now_elec_box.text()});
            """
            )
            self.update_todb(self.home_id_box.text(),
                            "temperature_now",
                            self.temperature_box.text() )
            print("input_defalt_value db insert성공")
        except Exception as e:
            print(f"error : {e}")
#             INSERT  INTO  home_data (home_data_id, `time`,temperature,power_usage)
# VALUES (10, '2024-02-01 12:00:00', 33,44);


    def radio1_toggle(self): # 에어컨 행 토글
        radio_butten = self.sender()
        if radio_butten.isChecked():
            # print(f"1{radio_butten.text()} is selected")
            self.update_todb(self.home_id_box.text(),"airconditioner",radio_butten.text())
    def radio2_toggle(self): # 보일러
        radio_butten = self.sender()
        if radio_butten.isChecked():
            # print(f"2{radio_butten.text()} is selected")
            self.update_todb(self.home_id_box.text(),"heater",radio_butten.text())
    def radio3_toggle(self): # 전등
        radio_butten = self.sender()
        if radio_butten.isChecked():
            # print(f"3{radio_butten.text()} is selected")
            self.update_todb(self.home_id_box.text(),"light",radio_butten.text())
            
    def human_count_to_db(self):
        self.update_todb(self.home_id_box.text(),
                        "human_count",
                        self.remain_counts_box.text())
        
    def temp_value_to_db(self):
        print("temp_value_changed")
        self.update_todb(self.home_id_box.text(),
                        "set_temp",
                        self.set_temp_box.text())
            
    def update_todb(self, id, column, set):
        # airconditioner ,heater ,light 
        if set =="ON":
            input_set = 1
        elif set == "OFF":
            input_set = 0
        else: input_set = set
        try:
            self.dbsearch.update(f"""
                update home_device
                set {column} = {input_set}
                where home_id ="{id}";
            """)
        except Exception as e:
            print(f"update_todb error : ", e)
        
    def set_current_time_box(self):
        Qtime = QDateTime.currentDateTime()
        self.datetimeedit.setDateTime(Qtime)
        
    def set_remain_count_box(self):
        self.remain_counts = self.in_counts - self.out_counts
        self.remain_counts_box.setText(str(self.remain_counts))
        
    

    def release_camera(self):  # 카메라 자원을 반납하고 종료하는 함수
        self.detector.cap.release()


def main():
    app = QApplication(sys.argv)
    ex = HomeApp()
    app.aboutToQuit.connect(ex.release_camera)
    sys.exit(app.exec_())
    
if __name__ == '__main__':
    main()
