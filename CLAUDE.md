# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Web-customer is a Vue.js 3 web application that serves as a webview for patient mobile apps (iOS/Android). It's a healthcare certificate management system with hospital search and reservation features.

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Run with local backend (port 2213)
npm run serve:local

# Run with development backend
npm run serve:dev

# Run with staging backend  
npm run serve:stage

# Run with production backend
npm run serve:prod
```

### Build Commands
```bash
# Development build
npm run build:dev

# Staging build
npm run build:stage

# Production build
npm run build:prod

# UniCloud production build
npm run build:prodUniCloud
```

### Deployment
```bash
# Development deployment
./deploy-dev.sh

# Staging deployment
./deploy-stg.sh

# Production deployment
./deploy-prod.sh

# Docker-based restart (dev)
./restart-dev.sh

# Docker-based restart (staging)
./restart-stg.sh
```

## Architecture Overview

### Tech Stack
- **Framework**: Vue.js 3.4.19 with Vite
- **State Management**: Vuex 4.1.0
- **Routing**: Vue Router 4.3.0  
- **UI Libraries**: Ant Design Vue 4.1.2, Vant 4.9.4
- **HTTP Client**: Axios with interceptors for auth
- **Styling**: SCSS
- **i18n**: vue-i18n 10.0.4

### Project Structure
- `/src/views/` - Page components organized by feature
  - `auth/` - Login/registration flows
  - `certificate/` - Certificate list and detail views
  - `hospital/` - Hospital search and details
  - `reservation/` - Appointment booking system
  - `event/` - Event-specific pages
  - `home/`, `profile/`, `notice/` - Other main sections
- `/src/router/` - Route definitions with lazy loading
- `/src/store/` - Vuex store for global state
- `/src/utils/` - Utility functions including bridges for native app communication
- `/src/assets/` - Static assets (images, fonts, SCSS)

### Key Architectural Patterns

1. **Multi-tenant Support**: The app supports different tenants (certilife, etc.) via URL parameters that affect UI and behavior.

2. **SNS Integration**: Supports multiple social platforms (Kakao, WeChat) for authentication and sharing.

3. **Native App Bridge**: Uses `bridges.js` to communicate with native iOS/Android apps when running as a webview.

4. **Environment-based Configuration**: Different behaviors for dev/stage/prod environments (e.g., home tab hidden in production).

5. **Dynamic Tabbar**: Bottom navigation that adapts based on environment and whether running inside native app.

6. **Route Guards**: Uses `checkAndSetQueryParams` to maintain query parameters across navigation.

7. **Axios Interceptors**: Handles authentication tokens and 401 responses automatically.

## Important Environment Variables
- `VITE_SERVERURL` - Backend API URL
- `VITE_ENV` - Environment (dev/stage/prod)
- `VITE_IS_UNICLOUD` - UniCloud deployment flag
- `PORT` - Application port

## Critical Files
- `src/App.vue` - Root component handling tabbar logic and tenant setup
- `src/router/index.js` - Route configuration with lazy loading
- `src/utils/bridges.js` - Native app communication layer
- `src/utils/deviceCheck.js` - Device/platform detection utilities
- `src/axios.js` - HTTP client configuration with auth handling