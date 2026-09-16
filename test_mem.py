import os
import psutil
def print_mem():
    process = psutil.Process(os.getpid())
    print(f"Memory: {process.memory_info().rss / 1024 ** 2:.2f} MB")

print_mem()
import torch
print_mem()
from backend.app.services.inference import InferenceService
print_mem()
svc = InferenceService()
print_mem()
