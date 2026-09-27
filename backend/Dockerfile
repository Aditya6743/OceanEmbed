# Lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files & buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (required for ML libraries like scipy/numpy/matplotlib)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# CRITICAL FOR RENDER: Install the CPU-only version of PyTorch first.
# Standard PyTorch includes CUDA binaries (2.5GB+), which will crash the Render deployment (Out of Memory).
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu

# Install the rest of the requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Render dynamically assigns a port via the $PORT environment variable.
# We must bind uvicorn to 0.0.0.0 and this dynamic port.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
