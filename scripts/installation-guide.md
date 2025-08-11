# RHB.me Installation Guide

A comprehensive installation guide for the RHB.me identity management and authentication system - a microservices-based platform built with Go backend services, Next.js/React web applications, React Native mobile apps, and Ory Kratos for identity management.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
  - [System Requirements](#system-requirements)
  - [Required Software](#required-software)
- [Installation Steps](#installation-steps)
  - [1. Repository Setup](#1-repository-setup)
  - [2. Development Environment Configuration](#2-development-environment-configuration)
  - [3. Docker Environment Setup](#3-docker-environment-setup)
  - [4. Frontend Applications Setup](#4-frontend-applications-setup)
  - [5. Mobile Application Setup](#5-mobile-application-setup)
- [Running the Application](#running-the-application)
- [Service URLs and Endpoints](#service-urls-and-endpoints)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Overview

RHB.me is a comprehensive identity management platform designed for secure user authentication and management. The system provides:

- **Identity Provider API**: Secure authentication system based on Ory Kratos
- **Web Applications**: Next.js-based frontend applications with modern UI
- **Mobile Application**: React Native/Expo mobile app with SDK
- **Backend Services**: Go-based microservices for business logic
- **Admin Panel**: Management interface for system administration
- **Security Features**: Passkey authentication, secure phrase generation, OAuth2 integration

## System Architecture

The RHB.me platform consists of several interconnected components:

### Core Services
- **rhbme-idp-api**: Ory Kratos-based identity provider (Ports: 4433/4434)
- **rhbme-broker-service**: Backend service for RHB integration (Port: 8600)
- **rhbme-phrase-api**: Secure phrase generation service (Port: 8800)
- **rhbme-web-app**: Main web application (Port: 8000)
- **rhbme-web-client**: OAuth2 client application (Port: 8080)

### Databases
- **rhbme-idp-database**: PostgreSQL for identity data (Port: 5432)
- **rhbme-phrase-database**: PostgreSQL for phrase data (Port: 5433)
- **rhbme-oauth-database**: PostgreSQL for OAuth data (Port: 5431)

### Supporting Services
- **rhbme-mail-service**: Development email service (Port: 4436)

## Prerequisites

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Ubuntu 18.04+
- **Memory**: Minimum 8GB RAM (16GB recommended for development)
- **Storage**: At least 10GB available disk space
- **Network**: Internet connection for downloading dependencies

### Required Software

The following software must be installed before proceeding with the installation:

#### 1. Docker and Docker Compose

**For Windows:**
1. Download [Docker Desktop for Windows](https://desktop.docker.com/win/stable/amd64/Docker%20Desktop%20Installer.exe)
2. Run the installer and follow the setup wizard
3. Ensure "Use WSL 2 instead of Hyper-V" is selected
4. Start Docker Desktop from the Start menu

**For macOS:**
1. Download [Docker Desktop for Mac](https://desktop.docker.com/mac/stable/amd64/Docker.dmg)
2. Open the `.dmg` file and drag Docker to Applications folder
3. Launch Docker from Applications

**For Ubuntu:**
```bash
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Set up stable repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Install Docker
sudo apt-get update
sudo apt-get install docker-ce

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**Verification:**
```bash
docker --version
docker compose version
```

#### 2. Go Development Kit

**For Windows:**
1. Visit [Go Downloads](https://go.dev/dl/)
2. Download the `.msi` installer for Windows
3. Run the installer and follow instructions

**For macOS:**
1. Visit [Go Downloads](https://go.dev/dl/)
2. Download the `.pkg` installer for macOS
3. Run the installer and follow instructions

**For Ubuntu:**
```bash
# Download and extract Go (replace VERSION with latest)
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz

# Add to PATH (add to ~/.profile or ~/.bashrc)
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Apply changes
source ~/.profile
```

**Verification:**
```bash
go version
```

#### 3. Node.js and Package Managers

**Node.js Installation:**

**Windows/macOS:**
1. Visit [Node.js official website](https://nodejs.org/)
2. Download the LTS version installer
3. Run the installer and follow instructions

**Ubuntu:**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Package Manager Installation:**
```bash
# Install pnpm globally
npm install -g pnpm

# Install yarn (optional, for mobile app)
npm install -g yarn
```

**Verification:**
```bash
node -v
npm -v
pnpm -v
```

## Installation Steps

### 1. Repository Setup

Clone the repository and navigate to the project directory:

```bash
# Clone the repository
git clone <repository-url>
cd tesla-rhbme

# Verify repository structure
ls -la
```

You should see the following main directories:
- `applications/` - Frontend applications
- `services/` - Backend services
- `resources/` - Configuration files and documentation
- `compose.yaml.example` - Docker compose template

### 2. Development Environment Configuration

#### Configure Local Domain Resolution

The application uses `rhbme.local` as the development domain. Add this to your system's hosts file:

**Windows:**
1. Open Notepad as Administrator
2. Open `C:\Windows\System32\drivers\etc\hosts`
3. Add the following line:
```
127.0.0.1    rhbme.local
```
4. Save the file and flush DNS cache:
```cmd
ipconfig /flushdns
```

**macOS:**
```bash
# Edit hosts file
sudo nano /etc/hosts

# Add this line:
127.0.0.1    rhbme.local

# Flush DNS cache
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**Ubuntu:**
```bash
# Edit hosts file
sudo nano /etc/hosts

# Add this line:
127.0.0.1    rhbme.local

# Flush DNS cache
sudo systemd-resolve --flush-caches
```

### 3. Docker Environment Setup

#### Create Docker Compose Configuration

```bash
# Copy the example compose file
cp compose.yaml.example compose.yaml

# Review and modify the configuration if needed
# The default configuration should work for most development setups
```

#### Start Backend Services

```bash
# Start all backend services
docker compose up -d

# Verify services are running
docker compose ps

# Check service logs if needed
docker compose logs -f
```

The following services will be started:
- PostgreSQL databases (3 instances)
- Ory Kratos identity provider
- RHB Broker service
- Secure Phrase API
- Mail service for development
- Web application

#### Service Health Check

Wait for all services to be healthy before proceeding:

```bash
# Check service status
docker compose ps

# All services should show "Up" or "Up (healthy)" status
```

### 4. Frontend Applications Setup

#### Admin Panel Setup

The admin panel is a Next.js application for system administration:

```bash
# Navigate to admin application
cd applications/rhbme-admin

# Install dependencies
pnpm install

# Start development server
pnpm dev

# The admin panel will be available at http://localhost:3000
```

**Key features of the admin panel:**
- User management interface
- Dashboard analytics
- System configuration
- Client management

#### Next.js Web Application Setup

The main web application provides user-facing authentication features:

```bash
# Navigate to Next.js application
cd applications/rhbme-next

# Install dependencies
npm install

# Start development server
npm run dev

# Alternative: Start with specific environment
npm run dev:development
```

The application supports multiple environments:
- **Development**: `npm run dev:development`
- **Staging**: `npm run dev:staging`
- **Production**: `npm run build:production`

**Application features:**
- User authentication flows
- Registration and login
- OTP verification
- Dashboard interface
- Responsive design with Tamagui UI

### 5. Mobile Application Setup

The mobile application is built with React Native and Expo:

```bash
# Navigate to mobile application
cd applications/rhbme-expo

# Install dependencies
yarn install

# Start Expo development server
yarn start

# Or start for specific platforms:
yarn ios      # iOS simulator
yarn android  # Android emulator
yarn web      # Web browser
```

**Mobile app features:**
- Cross-platform authentication
- Biometric authentication support
- SDK for integration with other apps
- Recovery flow implementation

#### SDK Development

The mobile app also serves as an SDK for other applications:

```bash
# Build the SDK
yarn build:sdk

# Run tests
yarn test

# The SDK can be published or used locally
```

## Running the Application

### Complete System Startup

Follow this sequence to start the complete system:

1. **Start Backend Services:**
```bash
# From project root
docker compose up -d

# Wait for services to be healthy
docker compose ps
```

2. **Start Frontend Applications:**
```bash
# Terminal 1: Admin Panel
cd applications/rhbme-admin
pnpm dev

# Terminal 2: Main Web App
cd applications/rhbme-next
npm run dev

# Terminal 3: Mobile App (optional)
cd applications/rhbme-expo
yarn start
```

3. **Access the Applications:**
- Main Web App: http://rhbme.local:8000
- Admin Panel: http://localhost:3000
- Mobile App: Use Expo Go app to scan QR code

### Using the Management Script

A convenience script is provided for managing Docker services:

```bash
# Make script executable
chmod +x run.sh

# Run the management interface
./run.sh
```

The script provides options to:
1. Start services
2. Stop services
3. Restart services
4. Show status
5. View logs

## Service URLs and Endpoints

### Core Application URLs
- **Main Web Application**: http://rhbme.local:8000
- **Admin Panel**: http://localhost:3000
- **Client Application**: http://rhbme.local:8080

### API Endpoints
- **Identity Provider (Public)**: http://rhbme.local:4433
- **Identity Provider (Admin)**: http://rhbme.local:4434
- **Broker Service**: http://rhbme.local:8600
- **Secure Phrase API**: http://rhbme.local:8800
- **OAuth2 Public**: http://rhbme.local:4444
- **OAuth2 Admin**: http://rhbme.local:4445

### Development Tools
- **Local Webmail**: http://rhbme.local:4436
- **Database Ports**: 5432 (identity), 5433 (phrase), 5431 (oauth)

## Development Workflow

### Backend Development

For Go service development:

```bash
# Navigate to a service
cd services/rhbme-broker

# Install dependencies
go mod download

# Run tests
go test ./...

# Build the service
go build -o bin/broker main.go

# Run locally (ensure environment variables are set)
./bin/broker
```

### Frontend Development

For Next.js applications:

```bash
# Install dependencies
pnpm install  # or npm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Lint code
pnpm lint
```

### Mobile Development

For the Expo/React Native app:

```bash
# Install dependencies
yarn install

# Start development
yarn start

# Build for different platforms
yarn build:rollup  # SDK build
npx expo build:ios    # iOS build
npx expo build:android # Android build
```

### Database Management

Access databases directly using connection details from `compose.yaml`:

```bash
# Connect to identity database
docker exec -it rhbme-idp-database psql -U user -d rhbme

# Connect to phrase database
docker exec -it rhbme-phrase-database psql -U user -d phrase

# Connect to OAuth database
docker exec -it rhbme-oauth-database psql -U user -d rhbme
```

## Troubleshooting

### Common Issues and Solutions

#### Docker Issues

**Problem**: Services fail to start or show unhealthy status
```bash
# Check service logs
docker compose logs [service-name]

# Restart specific service
docker compose restart [service-name]

# Rebuild services
docker compose up -d --build
```

**Problem**: Port conflicts
```bash
# Check what's using ports
lsof -i :4433  # Check specific port
netstat -tulpn | grep :4433

# Stop conflicting processes or change ports in compose.yaml
```

#### Frontend Issues

**Problem**: Dependencies installation fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For pnpm
pnpm store prune
pnpm install
```

**Problem**: Application won't start on expected port
- Check if ports are available
- Review environment variables
- Check for port conflicts in scripts

#### Backend Issues

**Problem**: Go service compilation errors
```bash
# Update Go modules
go mod tidy

# Verify Go version compatibility
go version  # Should be 1.19+

# Check for missing dependencies
go mod download
```

**Problem**: Database connection issues
- Ensure Docker services are healthy
- Check database credentials in environment variables
- Verify network connectivity between services

#### Mobile App Issues

**Problem**: Expo/React Native setup issues
```bash
# Clear Expo cache
npx expo r -c

# Reset project (removes example code)
yarn reset-project

# Check Expo CLI version
npx expo --version
```

**Problem**: SDK build issues
```bash
# Clean and rebuild
yarn clean
yarn build:rollup

# Check TypeScript configuration
npx tsc --noEmit
```

### Environment-Specific Configurations

#### Development Environment
- Use `compose.yaml` for local development
- Enable debug logging in services
- Use development-specific environment variables

#### Production Environment
- Use `compose.prod.yaml` for production deployment
- Configure proper secrets and security settings
- Set up proper SSL/TLS certificates
- Configure external databases and services

### Performance Optimization

#### For Development
- Increase Docker memory allocation (8GB+)
- Use SSD storage for better I/O performance
- Close unnecessary applications

#### For Production
- Configure proper resource limits in Docker
- Use production builds of frontend applications
- Implement proper caching strategies
- Monitor service performance and logs

### Getting Help

If you encounter issues not covered in this guide:

1. Check the service logs: `docker compose logs [service-name]`
2. Review the README files in individual application directories
3. Check the `resources/documents/` directory for additional documentation
4. Verify all prerequisites are correctly installed
5. Ensure the `rhbme.local` domain is properly configured

### Security Considerations

#### Development Environment
- The system uses development secrets and configurations
- CSRF protection may be disabled for local development
- Debug logging might expose sensitive information

#### Production Deployment
- Change all default secrets and passwords
- Enable HTTPS/SSL for all endpoints
- Configure proper CORS policies
- Set up proper monitoring and alerting
- Review and harden database configurations

This installation guide provides a comprehensive overview of setting up the RHB.me system for development and production use. The modular architecture allows for flexible deployment scenarios, from local development to scalable production environments.