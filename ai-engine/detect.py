import cv2
from ultralytics import YOLO

class Detector:
    def __init__(self):
        # We load a small model for speed. 
        # In a real app, you can train YOLOv8 on specific "product/box".
        self.model = YOLO('yolov8n.pt') 
        self.cap = None

    def initialize_camera(self, source=0):
        self.cap = cv2.VideoCapture(source)

    def run_detection(self):
        if not self.cap or not self.cap.isOpened():
            return 0, 0
            
        ret, frame = self.cap.read()
        if not ret:
            return 0, 0, None
            
        results = self.model(frame, verbose=False)
        annotated_frame = results[0].plot() # This draws bounding boxes directly on the frame!
        
        person_count = 0
        product_count = 0
        
        for r in results:
            for box in r.boxes:
                # class 0 is person in COCO
                cls_id = int(box.cls[0])
                if cls_id == 0:
                    person_count += 1
                # Let's assume class 39 (bottle) or 41 (cup) are products
                elif cls_id in [39, 41]:
                    product_count += 1
                    
        return person_count, product_count, annotated_frame

