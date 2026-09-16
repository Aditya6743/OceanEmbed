import re

with open("backend/app/main.py", "r") as f:
    code = f.read()

bad_scheduler = """from app.services.scheduler import start_scheduler
import logging

logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Background Cron Jobs...")
    start_scheduler()"""

new_scheduler = """# from app.services.scheduler import start_scheduler
import logging

logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Background Cron Jobs (Disabled missing apscheduler)...")
    pass"""

code = code.replace(bad_scheduler, new_scheduler)

with open("backend/app/main.py", "w") as f:
    f.write(code)
print("Disabled apscheduler to fix backend crash.")
