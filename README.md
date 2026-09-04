# OceanEmbed — SIH 2026 | PS26066

**Satellite Embedding-Based Deep Learning Framework for Reconstruction of Subsurface Ocean Temperature from Surface Satellite Observations.**

## Overview

OceanEmbed is a deep learning framework designed to reconstruct 3D subsurface ocean temperature profiles using surface-level satellite observations. This repository contains the complete source code for the project, broken down into the user-facing web application, the model inference backend, and the machine learning training pipeline.

## Core Architecture

The system follows a decoupled architecture designed for high-performance inference and interactive 3D visualizations:

**React → FastAPI → OceanEmbed (PyTorch) → Processed Satellite/Argo Data**

* **Frontend (User Interface):** Built with React, Vite, and TypeScript. Handles all interactive visualizations (2D maps via Leaflet, 3D ocean visualizations via Three.js) and requests predictions from the backend.
* **Backend (API & Inference):** Powered by FastAPI. It serves as the bridge, receiving prediction requests, pre-processing satellite data, running model inference using PyTorch, and returning the structured JSON.
* **Machine Learning Pipeline:** An offline pipeline utilizing `xarray` and PyTorch to align Argo float data with satellite observations, train the OceanEmbed model, and export weights for serving.

## Technology Stack

### Frontend
* **Core:** React, Vite, TypeScript
* **Styling:** Tailwind CSS, shadcn/ui, Framer Motion
* **Maps & Visualization:**
  * Leaflet + React-Leaflet (2D ocean map)
  * Three.js + React Three Fiber + Drei (3D ocean visualization)
  * Plotly.js (Temperature-depth & validation graphs)

### Backend
* **Core:** Python, FastAPI, Uvicorn

### Machine Learning
* **Framework:** PyTorch (OceanEmbed model)
* **Metrics & Baselines:** scikit-learn

### Data Processing
* **Libraries:** xarray, NumPy, Pandas, SciPy
* **Data Formats:** NetCDF / Zarr (Scientific ocean data)
* **Sources:**
  * Satellite observations: SST, SSH/SSA, SSS
  * Ground truth: Argo subsurface temperature profiles

### Database (Optional)
* **Supabase / PostgreSQL:** For user/data metadata, saved cases, prediction history, and model metadata.

### Deployment & Development
* **Version Control:** Git + GitHub
* **Hosting:** Vercel (Frontend), FastAPI-compatible hosting (Backend/ML inference)

## Project Structure

* `frontend/` - React application handling the UI, mapping, and 3D rendering.
* `backend/` - FastAPI service for model serving and API endpoints.
* `ml-pipeline/` - Offline scripts and Jupyter notebooks for data processing and PyTorch model training.
* `docs/` - System architecture, data flow diagrams, and API documentation.
