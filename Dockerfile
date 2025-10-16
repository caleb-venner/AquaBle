# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS frontend-build
RUN apk update && apk upgrade

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files from repo root (monorepo structure)
COPY --chown=nodejs:nodejs package.json package-lock.json ./
COPY --chown=nodejs:nodejs frontend/package.json ./frontend/

# Ensure /app directory is owned by nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Install dependencies (workaround for npm optional deps bug with Rollup)
# See: https://github.com/npm/cli/issues/4828
RUN rm -f package-lock.json && \
    npm install && \
    npm cache clean --force

# Copy frontend source
COPY --chown=nodejs:nodejs frontend/ ./frontend/

# Build the frontend
RUN npm run build --workspace=frontend

FROM python:3.13-slim

# Install system dependencies for Bluetooth LE support
RUN apt-get update && apt-get install -y \
    bluez \
    libglib2.0-0t64 \
    libdbus-1-3 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy Python source
COPY --chown=appuser:appuser src/ ./src/
COPY --chown=appuser:appuser pyproject.toml README.md ./

# Install Python dependencies AS ROOT (before switching user)
# Set version for setuptools-scm since .git is not in build context
ENV SETUPTOOLS_SCM_PRETEND_VERSION=2.0.0
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir . && \
    python -c "import uvicorn; print(f'✓ uvicorn {uvicorn.__version__} installed')"

# Copy built frontend from previous stage
COPY --from=frontend-build --chown=appuser:appuser /app/frontend/dist ./frontend/dist

# Create data directory structure with proper permissions for appuser
# This MUST be done before switching to appuser
RUN mkdir -p /data/devices && \
    chown -R appuser:appuser /data && \
    chmod 755 /data

# Switch to non-root user AFTER all installs and directory creation
USER appuser

# Set environment variable for frontend location
ENV AQUA_BLE_FRONTEND_DIST=/app/frontend/dist

# Expose the service port
EXPOSE 8000

# Run the service
CMD ["python", "-m", "uvicorn", "aquable.service:app", "--host", "0.0.0.0", "--port", "8000"]
