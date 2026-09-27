# Lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files & buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (netCDF4 heavily requires libhdf5 and libnetcdf)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libhdf5-dev \
    libnetcdf-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# CRITICAL FOR RENDER MEMORY LIMITS (512MB): 
# 1. We MUST use --no-cache-dir for everything to prevent Out of Memory (OOM) crashes.
# 2. We MUST install setuptools and wheel so packages can build from source if needed.
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install PyTorch CPU first to avoid pulling the 2.5GB CUDA version
RUN pip install --no-cache-dir torch --extra-index-url https://download.pytorch.org/whl/cpu

# Install the rest of the requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Render dynamically assigns a port via the $PORT environment variable.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]
