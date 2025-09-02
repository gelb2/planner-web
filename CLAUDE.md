# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Planner-web is a React-based task planning web application built with modern web technologies. It's a comprehensive task management system with categories, status tracking, and user statistics.

## Architecture
- **Language**: TypeScript
- **Framework**: React 18.3.1 with Vite 
- **Architecture Pattern**: Feature-Sliced Design (FSD)
- **State Management**: React Context/Hooks
- **Routing**: React Router 6.28.0

## Tech Stack

### Frontend Framework & Core
- **React**: 18.3.1 with React DOM
- **TypeScript**: ~5.8.0 for type safety
- **Vite**: 7.0.6 as build tool and dev server
- **React Router DOM**: 6.28.0 for client-side routing

### UI & Styling
- **TailwindCSS**: 3.4.14 for utility-first styling
- **Radix UI**: Complete component library including:
  - Accordion, Alert Dialog, Avatar, Checkbox
  - Dialog, Dropdown Menu, Form components
  - Navigation Menu, Popover, Progress
  - Select, Tabs, Toggle, Tooltip
- **Class Variance Authority**: 0.7.1 for component variants
- **Clsx & Tailwind Merge**: For conditional styling
- **Next Themes**: 0.4.6 for dark mode support
- **Lucide React**: 0.487.0 for icons

### Form Handling & Validation
- **React Hook Form**: 7.55.0 for form management
- **Input OTP**: 1.4.2 for OTP input components

### Data Visualization & UI Enhancements
- **Recharts**: 2.15.2 for charts and statistics
- **React Day Picker**: 8.10.1 for date selection
- **React Resizable Panels**: 2.1.7 for layout
- **Embla Carousel**: 8.6.0 for carousels
- **Vaul**: 1.1.2 for drawer components
- **Sonner**: 2.0.3 for toast notifications

### HTTP & API
- **Axios**: 1.11.0 for HTTP requests
- **Date-fns**: 3.6.0 for date manipulation

### Development Tools
- **ESLint**: 9.31.0 with React plugins for code quality
- **Prettier**: 3.6.2 for code formatting
- **Vitest**: 3.2.4 for unit testing with jsdom
- **TypeScript ESLint**: For TypeScript linting

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test:unit
```

### Code Quality
```bash
# Lint and fix code issues
npm run lint

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

### Build Commands
```bash
# Build only (without type checking)
npm run build-only

# Build with type checking (production)
npm run build
```

## Architecture Overview - Feature-Sliced Design (FSD)

### Project Structure
```
src/
├── app/                    # Application layer
│   ├── providers/         # React Context providers (Theme)
│   ├── styles/            # Global styles, CSS variables
│   └── App.tsx            # Root component with routing
│
├── pages/                  # Pages layer
│   ├── HomePage/          # Home page component
│   └── index.ts           # Barrel exports
│
├── widgets/               # Widgets layer (large UI blocks)
│   ├── Header/            # Header widget
│   ├── TaskList/          # Task list widget
│   ├── StatsCard/         # Statistics widget
│   └── index.ts
│
├── features/              # Features layer (business logic)
│   ├── task-management/   # Task CRUD operations
│   │   ├── components/    # Feature-specific components
│   │   └── index.ts
│   └── index.ts
│
├── entities/              # Entities layer (domain models)
│   ├── task/              # Task entity components
│   │   └── components/
│   └── index.ts
│
├── shared/                # Shared layer
│   ├── ui/                # Reusable UI components (Radix-based)
│   ├── api/               # API client configuration
│   ├── lib/               # Utility functions
│   ├── config/            # Configuration files
│   └── types/             # Shared TypeScript types
│
├── assets/                # Static assets
└── main.tsx              # Application entry point
```

### Key Architectural Principles

1. **Feature-Sliced Design (FSD)**
   - **App Layer**: Application initialization, providers, routing
   - **Pages Layer**: Route-level components
   - **Widgets Layer**: Large, self-contained UI blocks
   - **Features Layer**: Business logic and user interactions
   - **Entities Layer**: Domain model representations
   - **Shared Layer**: Reusable code across all layers

2. **Component Architecture**
   - Radix UI as foundation for accessible components
   - Custom UI components with TailwindCSS styling
   - Compound components pattern for complex interactions
   - Proper separation of concerns between layers

3. **State Management**
   - React Context for global state (Theme)
   - Local state with useState/useReducer
   - Props drilling minimization through proper composition

4. **Type Safety**
   - Comprehensive TypeScript coverage
   - Domain types in shared/types
   - Strict type checking enabled

## Domain Models

### Core Types
- **Task**: Main entity with title, description, category, status, due date
- **TaskCategory**: WORK, STUDY, EXERCISE, HOBBY, OTHER
- **TaskStatus**: PENDING, IN_PROGRESS, COMPLETED, ON_HOLD
- **User**: User profile with preferences and settings
- **TaskStats**: Analytics and completion statistics

### Key Features
1. **Task Management**: Full CRUD operations for tasks
2. **Categorization**: Task organization by categories
3. **Status Tracking**: Task progress through workflow states
4. **Statistics**: Completion rates and streak tracking
5. **Theme System**: Light/dark mode with system preference
6. **Responsive Design**: Mobile-first approach with TailwindCSS

## Environment Configuration

### Environment Variables
```bash
VITE_API_BASE_URL=http://localhost:3000/api  # Backend API URL
```

### Build Configuration
- **Vite Configuration**: React SWC plugin for fast compilation
- **TailwindCSS**: Utility-first CSS with custom theme extensions
- **PostCSS**: Processing for TailwindCSS
- **TypeScript**: Strict mode with path mapping (@/ alias)

## Development Guidelines

### Code Conventions
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow FSD layer separation rules
- Use Prettier for consistent formatting
- Leverage Radix UI components for accessibility

### Testing Strategy
- Unit tests with Vitest and jsdom
- Component testing for UI interactions
- Type checking with TypeScript compiler
- ESLint for code quality enforcement

### Component Development
- Build components with Radix UI primitives
- Apply TailwindCSS for styling with design system tokens
- Implement proper props interfaces
- Use compound component patterns where appropriate
- Ensure accessibility compliance through Radix UI

### State Management Patterns
- Use Context providers for global state
- Implement custom hooks for business logic
- Keep state close to where it's used
- Avoid prop drilling through proper component composition

## Critical Files
- `src/main.tsx` - Application entry point
- `src/app/App.tsx` - Root component with routing and providers
- `src/app/providers/ThemeProvider.tsx` - Theme management
- `src/shared/types/index.ts` - Core domain types
- `src/shared/ui/index.ts` - UI component exports
- `vite.config.ts` - Build configuration
- `tailwind.config.js` - Styling configuration
- `tsconfig.json` - TypeScript configuration