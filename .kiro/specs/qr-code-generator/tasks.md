# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Initialize React project with Vite
  - Install qrcode.react library
  - Install testing dependencies (Vitest, React Testing Library, fast-check)
  - Configure TypeScript with appropriate types
  - Set up basic project structure with component folders
  - _Requirements: 9.1_

- [x] 2. Create core App component with state management
  - Implement App component with state for text, error correction level, QR size, and advanced options visibility
  - Add URL parameter parsing on component mount to initialize state
  - Implement URL synchronization that updates browser URL when state changes
  - _Requirements: 7.1, 7.2, 7.5_

- [x] 2.1 Write property test for URL synchronization
  - **Property 13: URL synchronization with input**
  - **Validates: Requirements 7.1, 7.5**

- [x] 2.2 Write property test for URL parameter initialization
  - **Property 14: URL parameter pre-fills input**
  - **Validates: Requirements 7.2**

- [x] 2.3 Write property test for URL encoding
  - **Property 16: URL encoding handles special characters**
  - **Validates: Requirements 7.4**

- [x] 3. Implement TextInput component
  - Create TextInput component with textarea for user input
  - Add character counter displaying current length vs maximum (1000 characters)
  - Implement onChange handler to update parent state
  - Add visual styling for focus and hover states
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 3.1 Write property test for text input acceptance
  - **Property 1: Text input acceptance**
  - **Validates: Requirements 1.2, 1.5**

- [x] 3.2 Write unit tests for TextInput component
  - Test initial render with empty value
  - Test character counter display
  - Test onChange callback invocation
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 4. Implement QRCodeDisplay component
  - Create QRCodeDisplay component using QRCodeCanvas from qrcode.react
  - Handle empty text state with placeholder message
  - Implement error boundary for QR code generation failures
  - Display error messages when generation fails
  - Ensure minimum size of 200x200 pixels
  - _Requirements: 1.3, 1.4, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 6.1_

- [x] 4.1 Write property test for non-empty input enables generation
  - **Property 2: Non-empty input enables generation**
  - **Validates: Requirements 1.3**

- [x] 4.2 Write property test for different inputs produce different QR codes
  - **Property 3: Different inputs produce different QR codes**
  - **Validates: Requirements 2.1, 2.2**

- [x] 4.3 Write property test for QR code dimensions
  - **Property 4: QR code minimum dimensions**
  - **Validates: Requirements 3.1, 3.4**

- [x] 4.4 Write property test for QR code contrast
  - **Property 5: QR code contrast**
  - **Validates: Requirements 3.2**

- [x] 4.5 Write property test for QR code aspect ratio
  - **Property 6: QR code aspect ratio**
  - **Validates: Requirements 3.3**

- [x] 4.6 Write property test for error display
  - **Property 11: Error display on generation failure**
  - **Validates: Requirements 6.1**

- [x] 4.7 Write unit tests for QRCodeDisplay component
  - Test rendering with valid text
  - Test placeholder state with empty text
  - Test error state display
  - _Requirements: 1.4, 2.1, 6.1_

- [ ] 5. Implement DownloadButton component
  - Create DownloadButton component with click handler
  - Implement canvas-to-blob conversion for PNG export
  - Generate filename with timestamp (format: qrcode-{timestamp}.png)
  - Trigger browser download using URL.createObjectURL and link click
  - Handle download errors with user-friendly messages
  - Show/hide button based on whether QR code is displayed
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5.1 Write property test for download button presence
  - **Property 7: Download button presence**
  - **Validates: Requirements 4.1**

- [ ] 5.2 Write property test for download triggers file save
  - **Property 8: Download triggers file save**
  - **Validates: Requirements 4.2**

- [ ] 5.3 Write property test for download format
  - **Property 9: Download format is PNG**
  - **Validates: Requirements 4.3**

- [ ] 5.4 Write property test for download filename
  - **Property 10: Download filename contains identifier**
  - **Validates: Requirements 4.4**

- [ ] 5.5 Write unit tests for DownloadButton component
  - Test button visibility with QR code present
  - Test button hidden when no QR code
  - Test download click handler
  - Test filename generation
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 6. Implement AdvancedOptions component
  - Create collapsible AdvancedOptions component with toggle button
  - Implement expand/collapse functionality
  - Add dropdown/select for error correction level (L, M, Q, H) with descriptions
  - Add slider or number input for QR code size configuration
  - Ensure controls are only visible when section is expanded
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 6.1 Write property test for advanced options toggle
  - **Property 17: Advanced options toggle**
  - **Validates: Requirements 8.2, 8.3**

- [ ] 6.2 Write property test for advanced controls presence
  - **Property 18: Advanced controls presence**
  - **Validates: Requirements 8.4, 8.5**

- [ ] 6.3 Write unit tests for AdvancedOptions component
  - Test initial collapsed state
  - Test expand/collapse toggle
  - Test controls visibility when expanded
  - Test error correction level options
  - Test size input
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7. Wire advanced options to QR code generation
  - Connect error correction level state to QRCodeCanvas component
  - Connect size state to QRCodeCanvas component
  - Ensure QR code regenerates when options change
  - Implement session persistence using sessionStorage or state
  - _Requirements: 8.6, 8.7, 9.3_

- [ ] 7.1 Write property test for option changes regenerate QR code
  - **Property 19: Option changes regenerate QR code**
  - **Validates: Requirements 8.6**

- [ ] 7.2 Write property test for session persistence
  - **Property 20: Session persistence of options**
  - **Validates: Requirements 8.7**

- [ ] 7.3 Write property test for error correction level support
  - **Property 21: Error correction level support**
  - **Validates: Requirements 9.3**

- [ ] 8. Implement URL initialization with QR code generation
  - Ensure that when app loads with URL parameters, QR code is automatically generated
  - Test flow: URL with text parameter → input pre-filled → QR code displayed
  - _Requirements: 7.3_

- [ ] 8.1 Write property test for URL initialization generates QR code
  - **Property 15: URL initialization generates QR code**
  - **Validates: Requirements 7.3**

- [ ] 8.2 Write integration test for complete URL sharing flow
  - Test: generate QR code → URL updates → copy URL → load in new instance → verify state
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 9. Implement error handling and logging
  - Add try-catch blocks around QR code generation
  - Implement console.error logging for all errors
  - Display user-friendly error messages in UI
  - Handle edge cases: empty input, invalid parameters, library failures
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 9.1 Write property test for error logging
  - **Property 12: Errors logged to console**
  - **Validates: Requirements 6.4**

- [ ] 9.2 Write unit tests for error handling
  - Test error message display
  - Test console logging
  - Test invalid input handling
  - _Requirements: 6.1, 6.2, 6.4_

- [ ] 10. Create Header component and main layout
  - Implement Header component with application title
  - Create main layout structure with proper visual hierarchy
  - Add basic styling for clean, intuitive interface
  - Ensure responsive design for different screen sizes
  - _Requirements: 5.1, 5.2_

- [ ] 10.1 Write unit test for Header component
  - Test title display on render
  - _Requirements: 5.1_

- [ ] 11. Add styling and visual polish
  - Implement CSS for all components with consistent design system
  - Add hover and focus states for interactive elements
  - Ensure adequate spacing and typography
  - Implement color scheme with good contrast
  - Add transitions for smooth interactions
  - _Requirements: 5.2, 5.3, 5.4_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Add accessibility features
  - Add alt text to QR code images
  - Ensure keyboard navigation works for all interactive elements
  - Add ARIA labels to controls
  - Test with screen reader
  - Verify color contrast meets WCAG standards
  - _Requirements: 5.2, 5.3_

- [ ] 13.1 Write unit tests for accessibility
  - Test keyboard navigation
  - Test ARIA labels presence
  - Test alt text on images
  - _Requirements: 5.2_

- [ ] 14. Final integration and polish
  - Test complete user flows end-to-end
  - Verify all requirements are met
  - Fix any remaining bugs or issues
  - Optimize performance if needed
  - _Requirements: All_

- [ ] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
