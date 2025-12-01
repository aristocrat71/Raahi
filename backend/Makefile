.PHONY: help install dev build clean test

help:
	@echo "Raahi Backend - Available Commands"
	@echo "=================================="
	@echo "make install    - Install dependencies with uv"
	@echo "make dev        - Start development server with auto-reload"
	@echo "make build      - Build for production"
	@echo "make clean      - Remove cache and build files"
	@echo "make test       - Run tests (when available)"

install:
	@echo "Installing dependencies..."
	uv sync

dev:
	@echo "Starting development server..."
	uv run uvicorn main:app --reload

build:
	@echo "Building for production..."
	uv sync --frozen

clean:
	@echo "Cleaning up..."
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf dist/ build/ .ruff_cache/ 2>/dev/null || true
	@echo "Cleanup complete!"

test:
	@echo "Running tests..."
	@echo "Tests not yet configured"
