# Docker Setup for Tire Pressure Guide

This project includes Docker configuration for both the backend (FastAPI) and frontend (React + Vite).

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually included with Docker Desktop)

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8088
   - API Documentation: http://localhost:8088/docs

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Run in detached mode (background)
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild after code changes
```bash
docker-compose up --build
```

## Individual Container Builds

### Backend Only

```bash
# Build
docker build -t tire-pressure-backend .

# Run
docker run -p 8088:8088 tire-pressure-backend
```

### Frontend Only

```bash
# Build
cd frontend
docker build -t tire-pressure-frontend .

# Run
docker run -p 3000:80 tire-pressure-frontend
```

## Production Deployment

For production deployment, you may want to:

1. **Use environment variables for configuration:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

2. **Set up reverse proxy (nginx/traefik) for:**
   - SSL/TLS certificates
   - Domain routing
   - Load balancing

3. **Configure environment variables:**
   - Update `VITE_API_URL` in frontend for your production domain
   - Set appropriate CORS settings in backend

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React/Vite)   │  Port 3000
│   Nginx Server  │
└────────┬────────┘
         │
         │ HTTP API calls
         │
┌────────▼────────┐
│   Backend       │
│   (FastAPI)     │  Port 8088
│   Python/Uvicorn│
└─────────────────┘
```

## Environment Configuration

### Backend
- Port: 8088
- Environment: production
- Runtime: Python 3.11

### Frontend
- Port: 3000 (mapped from nginx port 80)
- Build: Node.js 20
- Serve: Nginx Alpine
- API URL: http://localhost:8088 (configurable via VITE_API_URL)

## Troubleshooting

### Port already in use
If ports 3000 or 8088 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8089:8088"  # Change external port
```

### Frontend can't connect to backend
1. Check that backend is running: `docker-compose ps`
2. Verify API URL in frontend `.env.production`
3. Check CORS settings in backend

### Clear everything and start fresh
```bash
docker-compose down -v
docker-compose up --build
```

## Development vs Production

- **Development**: Use `npm run dev` and `uvicorn` directly for hot-reload
- **Production**: Use Docker containers for consistent deployment

## Additional Commands

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Scale services (if needed)
docker-compose up --scale backend=2

# Execute command in running container
docker-compose exec backend python -m pytest
docker-compose exec frontend sh
```
