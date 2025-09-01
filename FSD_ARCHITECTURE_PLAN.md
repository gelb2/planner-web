# FSD Architecture Migration Plan

## Target FSD Structure

```
src/
├── app/                    # Application layer
│   ├── providers/         # Context providers, theme, etc.
│   ├── store/             # Global state management
│   ├── styles/            # Global styles, TailwindCSS config
│   └── App.tsx            # Root component
│
├── pages/                  # Pages layer
│   ├── HomePage/          # Home page
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
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── index.ts
│   ├── user-profile/      # User management
│   └── theme-switcher/    # Dark mode toggle
│
├── entities/              # Entities layer (domain models)
│   ├── task/              # Task entity
│   │   ├── types/
│   │   ├── api/
│   │   └── index.ts
│   ├── user/              # User entity
│   └── index.ts
│
└── shared/                # Shared layer
    ├── ui/                # Reusable UI components
    │   ├── Button/
    │   ├── Card/
    │   ├── Input/
    │   └── index.ts
    ├── lib/               # Utilities, helpers
    ├── api/               # API configuration
    ├── hooks/             # Common hooks
    ├── constants/         # Constants
    └── types/             # Shared types
```

## Migration Steps

### 1. Dependencies Migration
- Replace Vue.js with React/React-DOM
- Replace SCSS with TailwindCSS
- Add Radix UI components
- Add TypeScript support
- Add necessary React tooling

### 2. Component Conversion Strategy
- Convert Vue SFC → React TSX
- Replace `<template>` → JSX return
- Replace `<script setup>` → React hooks
- Replace SCSS modules → TailwindCSS classes
- Convert Vue directives → React patterns

### 3. State Management
- Replace Vue reactivity → React useState/useContext
- Convert Pinia stores → React Context/hooks
- Implement proper state lifting patterns

### 4. Routing
- Replace Vue Router → React Router
- Convert route guards → React router protection
- Update navigation patterns

### 5. Build Configuration
- Replace Vite Vue config → Vite React config
- Configure TailwindCSS
- Update TypeScript configuration
- Configure PostCSS for TailwindCSS

## Key Features to Migrate
1. **Task Management**: CRUD operations for tasks
2. **User Interface**: Responsive layout with dark mode
3. **Statistics**: Task completion tracking
4. **Form Handling**: Task creation/editing forms
5. **Theme System**: Light/dark mode toggle