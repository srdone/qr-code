# Design Document: QR Code Generator

## Overview

The QR Code Generator is a single-page React web application that enables users to generate QR codes from text input. The application features a clean, intuitive interface with real-time QR code generation, download capabilities, URL-based sharing, and advanced configuration options. The system will use the `qrcode.react` library, which is a well-maintained React wrapper around the robust `qrcode` library that generates ISO/IEC 18004 compliant QR codes.

## Architecture

The application follows a component-based architecture typical of React applications:

```
┌─────────────────────────────────────┐
│         App Component               │
│  (State Management & URL Sync)      │
└─────────────────────────────────────┘
           │
           ├─────────────────┬─────────────────┬──────────────────┐
           │                 │                 │                  │
    ┌──────▼──────┐   ┌─────▼──────┐   ┌─────▼──────┐   ┌──────▼──────┐
    │   Header    │   │TextInput   │   │  QRCode    │   │  Advanced   │
    │  Component  │   │ Component  │   │  Display   │   │   Options   │
    └─────────────┘   └────────────┘   └────────────┘   └─────────────┘
                                              │
                                       ┌──────▼──────┐
                                       │  Download   │
                                       │   Button    │
                                       └─────────────┘
```

### Technology Stack

- **Framework**: React 18+ with functional components and hooks
- **QR Code Library**: `qrcode.react` (v3.x or latest)
- **Build Tool**: Vite (for fast development and optimized builds)
- **Styling**: CSS Modules or Tailwind CSS for component styling
- **State Management**: React useState and useEffect hooks
- **Routing**: URL query parameters for sharing (no router library needed)

## Components and Interfaces

### App Component

The root component that manages application state and coordinates child components.

**State:**
```typescript
interface AppState {
  text: string;              // Current input text
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';  // QR error correction
  qrSize: number;            // QR code size in pixels
  showAdvanced: boolean;     // Advanced options visibility
}
```

**Responsibilities:**
- Initialize state from URL parameters on mount
- Update URL when text or options change
- Pass state and handlers to child components
- Coordinate QR code generation

### TextInput Component

Handles user text input with validation.

**Props:**
```typescript
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}
```

**Responsibilities:**
- Render textarea for text input
- Display character count
- Validate input length
- Provide visual feedback for focus/hover states

### QRCodeDisplay Component

Displays the generated QR code using the qrcode.react library.

**Props:**
```typescript
interface QRCodeDisplayProps {
  text: string;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}
```

**Responsibilities:**
- Render QR code using QRCodeCanvas or QRCodeSVG from qrcode.react
- Handle empty text state with placeholder
- Display error messages if generation fails
- Ensure proper sizing and contrast

### DownloadButton Component

Provides QR code download functionality.

**Props:**
```typescript
interface DownloadButtonProps {
  qrCodeRef: React.RefObject<HTMLCanvasElement>;
  text: string;
}
```

**Responsibilities:**
- Convert canvas to blob/data URL
- Trigger browser download
- Generate descriptive filename with timestamp
- Handle download errors

### AdvancedOptions Component

Collapsible section for advanced QR code configuration.

**Props:**
```typescript
interface AdvancedOptionsProps {
  isExpanded: boolean;
  onToggle: () => void;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  onErrorCorrectionChange: (level: 'L' | 'M' | 'Q' | 'H') => void;
  qrSize: number;
  onSizeChange: (size: number) => void;
}
```

**Responsibilities:**
- Toggle visibility of advanced options
- Render controls for error correction level selection
- Render controls for QR code size adjustment
- Provide labels and descriptions for each option

## Data Models

### QR Code Configuration

```typescript
interface QRCodeConfig {
  value: string;                           // Text to encode
  size: number;                            // Canvas size in pixels (default: 256)
  level: 'L' | 'M' | 'Q' | 'H';           // Error correction level
  bgColor: string;                         // Background color (default: '#FFFFFF')
  fgColor: string;                         // Foreground color (default: '#000000')
  includeMargin: boolean;                  // Include quiet zone (default: true)
}
```

### URL Parameters

```typescript
interface URLParams {
  text?: string;                           // Pre-filled text content
  level?: 'L' | 'M' | 'Q' | 'H';          // Error correction level
  size?: string;                           // QR code size (parsed as number)
}
```

### Error Correction Levels

- **L (Low)**: ~7% error correction
- **M (Medium)**: ~15% error correction (default)
- **Q (Quartile)**: ~25% error correction
- **H (High)**: ~30% error correction

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I identified several redundant properties:
- Requirements 7.1 and 7.5 both test URL synchronization - combined into one property
- Requirements 8.2 and 8.3 test expand/collapse - combined into toggle property
- Requirements 2.1 is subsumed by 2.2 (different inputs produce different outputs)
- Requirements 8.4 and 8.5 both test control presence - combined into one property

### Correctness Properties

Property 1: Text input acceptance
*For any* string input up to 1000 characters, typing into the text field should result in the field displaying that exact string
**Validates: Requirements 1.2, 1.5**

Property 2: Non-empty input enables generation
*For any* non-empty string, the QR code generation functionality should be enabled
**Validates: Requirements 1.3**

Property 3: Different inputs produce different QR codes
*For any* two different text strings, the generated QR codes should be visually different
**Validates: Requirements 2.1, 2.2**

Property 4: QR code minimum dimensions
*For any* generated QR code, the rendered image dimensions should be at least 200x200 pixels
**Validates: Requirements 3.1, 3.4**

Property 5: QR code contrast
*For any* generated QR code, the foreground color and background color should be different to ensure adequate contrast
**Validates: Requirements 3.2**

Property 6: QR code aspect ratio
*For any* generated QR code, the width and height should be equal (square aspect ratio)
**Validates: Requirements 3.3**

Property 7: Download button presence
*For any* application state where a QR code is displayed, a download button should be present and visible
**Validates: Requirements 4.1**

Property 8: Download triggers file save
*For any* displayed QR code, clicking the download button should initiate a browser download action
**Validates: Requirements 4.2**

Property 9: Download format is PNG
*For any* downloaded QR code file, the file format should be PNG
**Validates: Requirements 4.3**

Property 10: Download filename contains identifier
*For any* downloaded QR code file, the filename should contain a timestamp or unique identifier
**Validates: Requirements 4.4**

Property 11: Error display on generation failure
*For any* error that occurs during QR code generation, an error message should be displayed to the user
**Validates: Requirements 6.1**

Property 12: Errors logged to console
*For any* error that occurs in the application, an entry should be logged to the browser console
**Validates: Requirements 6.4**

Property 13: URL synchronization with input
*For any* text input value, the browser URL should contain that text as a query parameter
**Validates: Requirements 7.1, 7.5**

Property 14: URL parameter pre-fills input
*For any* URL containing a text query parameter, loading the application should pre-fill the input field with that text
**Validates: Requirements 7.2**

Property 15: URL initialization generates QR code
*For any* URL containing a text query parameter, loading the application should automatically generate the corresponding QR code
**Validates: Requirements 7.3**

Property 16: URL encoding handles special characters
*For any* text containing special characters (spaces, symbols, unicode), the URL encoding should produce a valid URL
**Validates: Requirements 7.4**

Property 17: Advanced options toggle
*For any* state of the advanced options section (expanded or collapsed), clicking the toggle control should switch to the opposite state
**Validates: Requirements 8.2, 8.3**

Property 18: Advanced controls presence
*For any* state where advanced options are expanded, controls for error correction level and QR code size should be present
**Validates: Requirements 8.4, 8.5**

Property 19: Option changes regenerate QR code
*For any* change to advanced options (error correction level or size), the QR code should be regenerated with the new configuration
**Validates: Requirements 8.6**

Property 20: Session persistence of options
*For any* advanced option changes made during a session, those settings should persist until the page is reloaded
**Validates: Requirements 8.7**

Property 21: Error correction level support
*For any* valid error correction level ('L', 'M', 'Q', 'H'), the QR code should be generated successfully with that level
**Validates: Requirements 9.3**

## Error Handling

### Input Validation Errors

- **Empty Input**: Display placeholder state or disable generation
- **Exceeds Maximum Length**: Truncate or show warning message
- **Invalid Characters**: Accept all characters (QR codes support binary data)

### QR Code Generation Errors

- **Library Initialization Failure**: Display system error with retry option
- **Encoding Failure**: Show user-friendly error message with input details
- **Canvas Rendering Failure**: Fallback to SVG rendering if available

### Download Errors

- **Canvas Access Denied**: Show permission error message
- **Blob Creation Failure**: Display technical error with browser compatibility note
- **Download Trigger Failure**: Provide manual save instructions

### URL Parameter Errors

- **Malformed URL Parameters**: Ignore invalid parameters and start with empty state
- **Decoding Errors**: Show warning and use empty input
- **Oversized URL**: Truncate or show warning about URL length limits

### Error Display Strategy

- Use non-intrusive toast notifications for transient errors
- Display inline error messages for input validation
- Show modal dialogs for critical system errors
- Always log detailed error information to console for debugging

## Testing Strategy

### Unit Testing

The application will use **Vitest** as the testing framework, which provides fast unit testing with React Testing Library integration.

**Unit Test Coverage:**

1. **Component Rendering Tests**
   - Verify each component renders without crashing
   - Test initial state rendering
   - Verify proper prop handling

2. **User Interaction Tests**
   - Test text input changes
   - Test button clicks (download, toggle advanced options)
   - Test form submissions

3. **State Management Tests**
   - Test state updates from user actions
   - Test URL parameter parsing and state initialization
   - Test advanced options state changes

4. **Edge Cases**
   - Empty input handling
   - Maximum length input
   - Special characters in input
   - Invalid URL parameters

5. **Error Handling Tests**
   - Test error message display
   - Test console logging
   - Test graceful degradation

### Property-Based Testing

The application will use **fast-check** for property-based testing in JavaScript/TypeScript.

**Configuration:**
- Each property test should run a minimum of 100 iterations
- Use appropriate generators for different input types (strings, numbers, enums)
- Configure shrinking to find minimal failing cases

**Property Test Requirements:**
- Each property-based test MUST be tagged with a comment referencing the correctness property
- Tag format: `// Feature: qr-code-generator, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test
- Tests should be placed close to implementation to catch errors early

**Property Test Coverage:**

1. **Input Handling Properties** (Properties 1, 2)
   - Generate random strings of varying lengths
   - Test input acceptance and display
   - Test generation enablement logic

2. **QR Code Generation Properties** (Properties 3, 4, 5, 6)
   - Generate random text inputs
   - Verify QR code uniqueness for different inputs
   - Verify dimensional constraints
   - Verify visual properties (contrast, aspect ratio)

3. **Download Properties** (Properties 7, 8, 9, 10)
   - Test download functionality across various QR codes
   - Verify file format and naming conventions

4. **Error Handling Properties** (Properties 11, 12)
   - Generate error conditions
   - Verify error display and logging

5. **URL Synchronization Properties** (Properties 13, 14, 15, 16)
   - Generate random text inputs including special characters
   - Test URL encoding/decoding round-trip
   - Verify state initialization from URLs

6. **Advanced Options Properties** (Properties 17, 18, 19, 20, 21)
   - Test option toggling
   - Test configuration changes
   - Test persistence behavior
   - Generate random error correction levels

### Integration Testing

While not the primary focus, basic integration tests should verify:
- Complete user flows (input → generate → download)
- URL sharing flow (generate → copy URL → load in new session)
- Advanced options flow (expand → configure → regenerate)

### Testing Approach

- **Implementation-first development**: Implement features before writing corresponding tests
- **Complementary testing**: Unit tests catch specific bugs, property tests verify general correctness
- **Early validation**: Place property tests close to implementation to catch errors quickly

## Implementation Notes

### Library Selection: qrcode.react

The `qrcode.react` library is chosen for the following reasons:

1. **Active Maintenance**: Regular updates and active community support
2. **React Integration**: Purpose-built for React with hooks support
3. **Standards Compliance**: Based on `node-qrcode` which implements ISO/IEC 18004
4. **Flexibility**: Supports both Canvas and SVG rendering
5. **Configuration**: Extensive options for error correction, size, colors, etc.
6. **TypeScript Support**: Includes type definitions

**Installation:**
```bash
npm install qrcode.react
```

**Basic Usage:**
```typescript
import { QRCodeCanvas } from 'qrcode.react';

<QRCodeCanvas
  value={text}
  size={256}
  level="M"
  includeMargin={true}
/>
```

### URL Parameter Management

Use the browser's `URLSearchParams` API for managing query parameters:

```typescript
// Update URL
const updateURL = (text: string, options: QRCodeConfig) => {
  const params = new URLSearchParams();
  params.set('text', text);
  params.set('level', options.level);
  params.set('size', options.size.toString());
  window.history.replaceState({}, '', `?${params.toString()}`);
};

// Read URL on mount
const initializeFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    text: params.get('text') || '',
    level: (params.get('level') as 'L' | 'M' | 'Q' | 'H') || 'M',
    size: parseInt(params.get('size') || '256', 10)
  };
};
```

### Download Implementation

Use Canvas API to convert QR code to downloadable image:

```typescript
const downloadQRCode = (canvas: HTMLCanvasElement, text: string) => {
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, 'image/png');
};
```

### Performance Considerations

1. **Debouncing**: Consider debouncing text input to avoid excessive QR code regeneration
2. **Memoization**: Use React.memo for components that don't need frequent re-renders
3. **Lazy Loading**: Load QR code library only when needed (though it's small)
4. **Canvas vs SVG**: Canvas is faster for generation, SVG is better for scaling

### Accessibility

1. **Alt Text**: Provide descriptive alt text for QR code images
2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
3. **Focus Management**: Maintain logical focus order
4. **ARIA Labels**: Use appropriate ARIA labels for controls
5. **Color Contrast**: Ensure UI elements meet WCAG contrast requirements

### Browser Compatibility

Target modern browsers with ES6+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Fallbacks:
- Provide SVG rendering if Canvas is not supported
- Graceful degradation for older browsers
- Feature detection for download API

## Deployment Considerations

### Build Configuration

- Use Vite for optimized production builds
- Enable code splitting for better load times
- Minify and compress assets
- Generate source maps for debugging

### Hosting

The application is a static site and can be hosted on:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Environment Variables

Minimal environment configuration needed:
- Base URL for production deployment
- Analytics tracking ID (optional)

## Future Enhancements

Potential features for future iterations:

1. **Color Customization**: Allow users to customize QR code colors
2. **Logo Embedding**: Support adding logos to QR code center
3. **Batch Generation**: Generate multiple QR codes from a list
4. **History**: Save recently generated QR codes
5. **Templates**: Pre-configured templates for common use cases (WiFi, vCard, etc.)
6. **Export Formats**: Support SVG, PDF, and other formats
7. **QR Code Scanning**: Add ability to scan and decode QR codes
8. **Analytics**: Track QR code generation statistics
