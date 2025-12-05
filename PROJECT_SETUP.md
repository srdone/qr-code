# QR Code Generator - Project Setup

## Overview
This project is a React-based QR code generator built with Vite, TypeScript, and comprehensive testing infrastructure.

## Technology Stack

### Core Dependencies
- **React 19.2.0** - UI framework
- **qrcode.react 4.2.0** - QR code generation library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool and dev server

### Testing Dependencies
- **Vitest 4.0.15** - Test runner
- **@testing-library/react 16.3.0** - React component testing
- **@testing-library/jest-dom 6.9.1** - DOM matchers
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **fast-check 4.3.0** - Property-based testing
- **jsdom 27.2.0** - DOM environment for tests

## Project Structure

```
qr-code/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── TextInput/
│   │   ├── QRCodeDisplay/
│   │   ├── DownloadButton/
│   │   └── AdvancedOptions/
│   ├── test/
│   │   └── setup.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── public/
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint

## Configuration

### Vite Configuration
- React plugin enabled
- Vitest configured with jsdom environment
- Global test utilities enabled
- Test setup file: `src/test/setup.ts`

### TypeScript Configuration
- Strict mode enabled
- Types: vite/client, vitest/globals, @testing-library/jest-dom
- Target: ES2022
- JSX: react-jsx

## Testing Strategy

### Unit Tests
- Component rendering tests
- User interaction tests
- State management tests
- Edge case handling

### Property-Based Tests
- Configured to run minimum 100 iterations per property
- Using fast-check library
- Tests universal properties across all inputs

## Next Steps

Refer to `.kiro/specs/qr-code-generator/tasks.md` for the implementation plan.
