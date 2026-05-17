# ABB-PodPulse

## Overview
ABB-PodPulse is an AI-driven, real-time observability and orchestration platform designed for single-node Kubernetes clusters. It leverages multi-agent systems to analyze cluster metrics and provide actionable insights.

## Project Structure
- `frontend/`: React-based dashboard for visualizing metrics, anomaly timelines, and AI insights.
- `backend/`: (Planned) FastAPI-based multi-agent backend for data processing and correlation.

## Key Features
- **Real-time Metrics**: Visualization of pod CPU, RAM, and network metrics using interactive charts.
- **AI Insights**: Automated analysis of cluster health, performance bottlenecks, and anomaly detection.
- **Dependency Mapping**: Correlation engine to interpret inter-service behaviors and resource mapping.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Technology Stack
- **Frontend**: React 18, Vite, Vanilla CSS.
- **Monitoring**: Kubernetes Metrics API integration.
- **Aesthetics**: Premium dark mode UI with modern typography and smooth transitions.

## Author
- Ankan Ghosh
- Anirban Ray
- Anusmita Ray Chaudhuri
- Mehali Basu
- Abir Praamanick
