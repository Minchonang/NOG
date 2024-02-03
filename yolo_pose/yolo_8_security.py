import sys
from io import StringIO

# sys.stdout을 메모리 버퍼로 설정
memory_buffer = StringIO()
sys.stdout = memory_buffer

import torch
import numpy as np
import cv2
from time import time, sleep

# YoLo
from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator, colors
from ultralytics.solutions import object_counter

## supervision



class ObjectDetection:
    def __init__(self, capture_index, frame_width=640, frame_height=480):
        # default parameters
        self.capture_index = capture_index
        
        # 프레임 범위 지정
        self.frame_width = frame_width
        self.frame_height = frame_height

        self.inside_region_point = \
            [(frame_width/3,0),
             (frame_width*2/3, 0),
             (frame_width*2/3,frame_height),
             (frame_width/3, frame_height)]

        # 카메라 캡처 객체 초기화
        self.cap = cv2.VideoCapture(capture_index)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)

        # model information
        self.model = YOLO(model = "input_yolov8m-pose.pt")

        # 클래스에서 사용할 카운터 생성
        self.inside_counter = self.object_counter(self.inside_region_point)

        # visual information
        self.annotator = None
        self.start_time = 0
        self.end_time = 0

        # device information
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
    # 모델 예측
    def predict(self, im0, conf= 0.5, iou=0.3, save=True, verbose=True, show=False ):
        return self.model(source = im0,
                             conf=conf,
                             iou=iou,
                             save=save,
                             verbose=verbose,
                             show=show
                             )

    def display_fps(self, im0):
        self.end_time = time()
        fps = 1 / np.round(self.end_time - self.start_time, 2)
        text = f'FPS: {int(fps)}'
        text_size = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 1.0, 2)[0]
        gap = 10
        cv2.rectangle(im0, (20 - gap, 70 - text_size[1] - gap), (20 + text_size[0] + gap, 70 + gap), (255, 255, 255), -1)
        cv2.putText(im0, text, (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 2)

    def plot_bboxes(self, results, im0):
        class_ids = []
        box_mids = {}
        self.annotator = Annotator(im0, 3, results[0].names)
        boxes = results[0].boxes.xyxy.cpu()
        box_xywhs = results[0].boxes.xywh.numpy()
        ids = results[0].boxes.id.tolist()
        # box_xywhs = results[0].boxes
        clss = results[0].boxes.cls.cpu().tolist()
        names = results[0].names
        for box, box_xywh, id, cls in zip(boxes, box_xywhs, ids, clss):
            class_ids.append(cls)
            box_mids[id] = [box_xywh[0],box_xywh[1]]
            self.annotator.box_label(box, label=names[int(cls)], color=colors(int(cls), True))
        return im0, class_ids, box_mids

    def object_counter(self, region_points):
        counter = object_counter.ObjectCounter()
        counter.set_args(view_img=False,
                         view_in_counts=False,
                         view_out_counts=False,
                         line_thickness=1,
                         reg_pts=region_points,
                         classes_names=self.model.names ,
                         draw_tracks=True,
                         region_thickness=2
                         )
        return counter


    def main(self):
        
        # cap = cv2.VideoCapture(self.capture_index)
        assert self.cap.isOpened()
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.frame_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.frame_height)
        # 포인트 구역은 왼쪽 위가(0,0)부터 순서로 배열됨(시계방향, 왼쪽 위부터 시작)
        # (좌상), (우상), (우하),(좌하),,  #라인으로 구현은 느립니다. ...

        frame_count = 0



        while True:
            in_counts, out_counts, im0 = self.model_count()
            cv2.imshow('YOLOv8 Detection', im0)


            frame_count += 1
            if cv2.waitKey(5) & 0xFF == 27:
                break


        self.cap.release()
        cv2.destroyAllWindows()
        

    def model_count(self):
        self.start_time = time()
        ret, im0 = self.cap.read()
        
        # 기본
        # results = self.predict(im0)
        # if (results is not None) and (im0 is not None) :
            # im0, class_ids, cls_box = self.plot_bboxes(results, im0)   

        # 추적 카운트
        results = self.model.track(im0, persist=True, verbose=False, conf=0.4, iou=0.5)
        im0_counted = self.inside_counter.start_counting(im0, results)
        if (results is not None) and (im0_counted is not None) :
            im0, class_ids, box_mids = self.plot_bboxes(results, im0_counted)
            return self.inside_counter.in_counts, self.inside_counter.out_counts, im0
            # fps표시 추가하는 함수 # 느림
            # self.display_fps(im0_counted)
            # 화면에 프레임 표시
        else: 
            self.display_fps(im0)
            return self.inside_counter.in_counts, self.inside_counter.out_counts, im0



        
            

        
if __name__ == "__main__":
    detector = ObjectDetection(capture_index=0,frame_width = 1920, frame_height=1080)
    detector.main()


