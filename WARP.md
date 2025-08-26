# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MagX Admin is a React Native mobile application built with Expo for managing teachers, attendance tracking, and allowance calculations. It's designed as a comprehensive admin tool for educational institutions with a modern tab-based navigation structure and SQLite database integration.

## Development Commands

### Core Development
```bash
# Start development server
npx expo start

# Run on specific platforms
npm run android
npm run ios  
npm run web
```

### Database Operations
- Database initialization happens automatically on app start
- SQLite database file: `magmax_admin.db`
- Database utilities in `utils/database.js` with automatic migration system

## Architecture Overview

### Navigation Structure
The app uses Expo Router v5 with tab-based navigation at the root level:
```
Root Layout (Tabs)
├── Dashboard (index.jsx)
├── Teachers Section (/(teacher)/) - uses Stack navigation
├── Attendance Section (/(attendance)/) - uses Stack navigation  
└── Allowance Section (/(allowance)/) - uses Stack navigation
```

**Important**: Each section uses Stack navigation internally to avoid double tab bars. The allowance section provides navigation through menu cards on its dashboard rather than nested tabs.

### Key Architectural Patterns

**Service Layer Pattern**: Each domain has dedicated service files
- `services/teacherService.js` - Teacher CRUD operations
- `services/attendanceService.js` - Attendance management
- `services/allowanceService.js` - Allowance calculations
- `services/canteenService.js` - Canteen management

**Custom Hooks Pattern**: React hooks for state management
- `hooks/useTeachers.js` - Teacher data operations with loading states
- `hooks/useAttendance.js` - Attendance tracking logic
- `hooks/useAllowance.js` - Allowance calculation hooks

**Database Layer**: SQLite with migration system
- Database initialization with `initDatabase()` in app startup
- Automatic schema migrations using `PRAGMA user_version`
- Tables: `teachers`, `attendance`, `calculations`, `welfare_payments`

### Database Schema
- **Teachers**: `id`, `fullname`, `department`, timestamps
- **Attendance**: `teacherId`, `checkInTime`, `checkOutTime`, `workHours`, `date`, `weekNum`, `status`, `remarks`
- **Calculations**: Weekly allowance calculations with class-specific amounts
- **Welfare Payments**: Track welfare payments by week

### Font System
- Primary font family: Arima Madurai (100, 200, 300, 400, 500, 700, 800, 900 weights)
- Color scheme: Purple-themed with `colors.primary: '#9370DB'`

## Important Development Context

### PDF Generation
- Uses `expo-print` for generating attendance reports
- Advanced PDF templates in `utils/pdfGenerator.js` with summary statistics
- Supports multiple report types: all teachers, individual, weekly

### State Management
- No external state management library used
- Local component state with custom hooks for data fetching
- Error handling pattern with loading states throughout hooks

### UI Design Philosophy
- Material Design inspired with shadows and rounded corners
- Bootstrap-like color scheme implementation
- Responsive layout for different screen sizes
- Touch-friendly interactive elements

### Database Migration Strategy
- Version-controlled schema updates using `PRAGMA user_version`
- Safe migration system that preserves existing data
- Database connection managed through SQLiteProvider context

## Key Files to Understand for Development

- `app/_layout.jsx` - Root navigation and database provider setup
- `utils/database.js` - Database initialization and migration system
- `constants/colors.js` - Application color theme
- Service files for understanding business logic
- Hook files for state management patterns

## Codacy Integration

This project has Codacy MCP Server integration for code quality analysis. After any file edits:
- Codacy CLI analysis runs automatically on edited files
- Security vulnerability scanning with Trivy after dependency changes
- Code quality issues are identified and fixed during development

## Testing Strategy

Focus testing on:
- Navigation flow between tabs and sections
- Database operations through service layer
- PDF generation functionality
- Attendance calculation accuracy
- Form validation in teacher management

The application maintains separation of concerns through services, hooks, and utilities, making it easy to test individual components of the system.
