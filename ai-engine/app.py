from flask import Flask, jsonify
from flask_cors import CORS
import threading
import time
import requests
from detect import Detector
from tracker import Tracker
import cv2
import base64

app = Flask(__name__)
CORS(app)

detector = Detector()
tracker = Tracker()

latest_data = {
    "person_count": 0,
    "product_count": 0,
    "timestamp": "",
    "employees_status": [],
    "frame": None
}

def ai_loop():
    global latest_data
    # Use 0 for local webcam
    detector.initialize_camera(0)
    
    while True:
        person_count, product_count, annotated_frame = detector.run_detection()
        
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%S")
        
        # Track employee
        status = tracker.update(person_count > 0, timestamp)
        
        # Convert annotated frame to base64
        frame_base64 = None
        if annotated_frame is not None:
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            if ret:
                frame_base64 = base64.b64encode(buffer).decode('utf-8')

        latest_data = {
            "person_count": person_count,
            "product_count": product_count,
            "timestamp": timestamp,
            "employees_status": status,
            "frame": frame_base64
        }
        
        # Send to node backend
        try:
            # We must significantly reduce the sleep because detection is running live, 1 second is too slow for video.
            # But making it too fast might overwhelm the Python post requests.
            requests.post('http://localhost:5000/api/ai/data', json=latest_data)
        except Exception as e:
            pass # Ignore if backend is not running
            
        time.sleep(0.05) # Send at ~20 frames per second

@app.route('/detect', methods=['GET'])
def get_detection():
    return jsonify(latest_data)

if __name__ == '__main__':
    # Start AI loop in background
    threading.Thread(target=ai_loop, daemon=True).start()
    app.run(port=5001, debug=False)
