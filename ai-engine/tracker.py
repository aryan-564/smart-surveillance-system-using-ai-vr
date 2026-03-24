import time
from datetime import datetime

class Tracker:
    def __init__(self):
        self.last_seen_time = time.time()
        self.status = "Break" # start with Break or Working
        self.work_duration = 0
        self.break_duration = 0
        self.last_update_time = time.time()
        
    def update(self, is_person_visible, current_timestamp_str):
        current_time = time.time()
        delta = current_time - self.last_update_time
        self.last_update_time = current_time
        
        if is_person_visible:
            self.last_seen_time = current_time
            if self.status == "Break":
                # Changed from Break to Working
                pass
            self.status = "Working"
            self.work_duration += delta
        else:
            time_since_seen = current_time - self.last_seen_time
            if time_since_seen > 30:
                self.status = "Break"
                self.break_duration += delta
            else:
                self.status = "Working" # still working if disappeared < 30 sec
                self.work_duration += delta
                
        return [{
            "employeeId": "employee_1",
            "status": self.status,
            "work_duration": int(self.work_duration),
            "break_duration": int(self.break_duration)
        }]
