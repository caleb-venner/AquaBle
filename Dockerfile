# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS frontend-build
RUN apk update && apk upgrade

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files from repo root (monorepo structure)
COPY --chown=nodejs:nodejs package.json package-lock.json ./
COPY --chown=nodejs:nodejs frontend/package.json ./frontend/

# Switch to non-root user
USER nodejs

# Install dependencies with clean install (npm ci respects monorepo workspaces)
RUN npm ci --only=production --ignore-scripts

# Copy frontend source
COPY --chown=nodejs:nodejs frontend/ ./frontend/

# Build the frontend
RUN npm run build --workspace=frontend

FROM python:3.13-slim

# Install system dependencies for Bluetooth LE support
RUN apt-get update && apt-get install -y \
    bluez=5.* \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy Python source
COPY --chown=appuser:appuser src/ ./src/
COPY --chown=appuser:appuser pyproject.toml README.md ./

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

# Copy built frontend from previous stage
COPY --from=frontend-build --chown=appuser:appuser /app/frontend/dist ./frontend/dist

# Switch to non-root user
USER appuser

# Set environment variable for frontend location
ENV AQUA_BLE_FRONTEND_DIST=/app/frontend/dist

# Expose the service port
EXPOSE 8000

# Run the service
CMD ["python", "-m", "uvicorn", "aquable.service:app", "--host", "0.0.0.0", "--port", "8000"]
