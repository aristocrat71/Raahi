.PHONY: help install dev build clean

help:
	@echo "Raahi Frontend - Available Commands"
	@echo "===================================="
	@echo "make install    - Install dependencies"
	@echo "make dev        - Start development server"
	@echo "make build      - Build for production"
	@echo "make clean      - Remove node_modules and build files"

install:
	@echo "Installing dependencies..."
	npm install

dev:
	@echo "Starting development server..."
	npm run dev

build:
	@echo "Building for production..."
	npm run build

clean:
	@echo "Cleaning up..."
	rm -rf node_modules dist
	@echo "Cleanup complete!"
