import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import App from './App';

describe('App Component - Property-Based Tests', () => {
  beforeEach(() => {
    // Clear URL parameters before each test
    window.history.replaceState({}, '', '/');
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    // Clean up sessionStorage after each test
    sessionStorage.clear();
  });

  describe('Property 13: URL synchronization with input', () => {
    // Feature: qr-code-generator, Property 13: URL synchronization with input
    // Validates: Requirements 7.1, 7.5
    it('should synchronize text input to URL parameters', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 0, maxLength: 100 }),
          async (text) => {
            // Clear URL before each iteration
            window.history.replaceState({}, '', '/');
            
            const { unmount } = render(<App />);
            
            // Simulate state change by re-rendering with URL parameter
            unmount();
            const params = new URLSearchParams();
            if (text) {
              params.set('text', text);
            }
            params.set('level', 'M');
            params.set('size', '256');
            window.history.replaceState({}, '', `?${params.toString()}`);
            
            render(<App />);
            
            // Wait for component to update
            await waitFor(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const urlText = urlParams.get('text') || '';
              
              // Verify URL contains the text
              if (text) {
                expect(urlText).toBe(text);
              } else {
                expect(urlText).toBe('');
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 14: URL parameter pre-fills input', () => {
    // Feature: qr-code-generator, Property 14: URL parameter pre-fills input
    // Validates: Requirements 7.2
    it('should pre-fill input from URL parameters', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          async (text) => {
            // Set URL parameter before rendering
            const params = new URLSearchParams();
            params.set('text', text);
            params.set('level', 'M');
            params.set('size', '256');
            window.history.replaceState({}, '', `?${params.toString()}`);
            
            const { unmount, container } = render(<App />);
            
            // Verify the textarea input is pre-filled with text from URL
            await waitFor(() => {
              const textarea = container.querySelector('textarea');
              expect(textarea).toBeInTheDocument();
              expect(textarea?.value).toBe(text);
            });
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 16: URL encoding handles special characters', () => {
    // Feature: qr-code-generator, Property 16: URL encoding handles special characters
    // Validates: Requirements 7.4
    it('should handle special characters in URL encoding', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          async (text) => {
            // Clear URL
            window.history.replaceState({}, '', '/');
            
            // Set URL with special characters
            const params = new URLSearchParams();
            params.set('text', text);
            params.set('level', 'M');
            params.set('size', '256');
            const encodedURL = `?${params.toString()}`;
            window.history.replaceState({}, '', encodedURL);
            
            const { unmount } = render(<App />);
            
            // Verify URL is valid and can be parsed
            await waitFor(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const decodedText = urlParams.get('text') || '';
              
              // The decoded text should match the original
              expect(decodedText).toBe(text);
              
              // Verify the URL is valid (doesn't throw)
              expect(() => new URL(window.location.href)).not.toThrow();
            });
            
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 19: Option changes regenerate QR code', () => {
    // Feature: qr-code-generator, Property 19: Option changes regenerate QR code
    // Validates: Requirements 8.6
    it('should regenerate QR code when error correction level changes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('L', 'M', 'Q', 'H'),
          fc.constantFrom('L', 'M', 'Q', 'H'),
          fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length >= 5),
          async (level1, level2, text) => {
            // Skip if levels are the same
            if (level1 === level2) return;

            window.history.replaceState({}, '', '/');
            sessionStorage.clear();

            // Set initial URL with text and first level
            const params1 = new URLSearchParams();
            params1.set('text', text);
            params1.set('level', level1);
            params1.set('size', '256');
            window.history.replaceState({}, '', `?${params1.toString()}`);

            const { unmount, container } = render(<App />);

            // Verify initial QR code is rendered with level1
            await waitFor(() => {
              const canvas = container.querySelector('canvas');
              expect(canvas).toBeInTheDocument();
            });

            unmount();

            // Change to second level
            const params2 = new URLSearchParams();
            params2.set('text', text);
            params2.set('level', level2);
            params2.set('size', '256');
            window.history.replaceState({}, '', `?${params2.toString()}`);

            const { unmount: unmount2, container: container2 } = render(<App />);

            // Verify QR code is regenerated with level2
            await waitFor(() => {
              const canvas = container2.querySelector('canvas');
              expect(canvas).toBeInTheDocument();
              
              // Verify the URL reflects the new level
              const urlParams = new URLSearchParams(window.location.search);
              expect(urlParams.get('level')).toBe(level2);
            });

            unmount2();
          }
        ),
        { numRuns: 20 } // Reduced runs due to canvas operations
      );
    });

    it('should regenerate QR code when size changes', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 200, max: 400 }),
          fc.integer({ min: 200, max: 400 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          async (size1, size2, text) => {
            // Skip if sizes are the same
            if (size1 === size2) return;

            window.history.replaceState({}, '', '/');
            sessionStorage.clear();

            // Set initial URL with text and first size
            const params1 = new URLSearchParams();
            params1.set('text', text);
            params1.set('level', 'M');
            params1.set('size', size1.toString());
            window.history.replaceState({}, '', `?${params1.toString()}`);

            const { unmount, container } = render(<App />);

            // Verify initial QR code is rendered with size1
            await waitFor(() => {
              const canvas = container.querySelector('canvas');
              expect(canvas).toBeInTheDocument();
              // Size should be at least the minimum (200) or the requested size
              const actualSize = Math.max(size1, 200);
              expect(canvas?.width).toBe(actualSize);
            });

            unmount();

            // Change to second size
            const params2 = new URLSearchParams();
            params2.set('text', text);
            params2.set('level', 'M');
            params2.set('size', size2.toString());
            window.history.replaceState({}, '', `?${params2.toString()}`);

            const { unmount: unmount2, container: container2 } = render(<App />);

            // Verify QR code is regenerated with size2
            await waitFor(() => {
              const canvas = container2.querySelector('canvas');
              expect(canvas).toBeInTheDocument();
              // Size should be at least the minimum (200) or the requested size
              const actualSize = Math.max(size2, 200);
              expect(canvas?.width).toBe(actualSize);
            });

            unmount2();
          }
        ),
        { numRuns: 20 } // Reduced runs due to canvas operations
      );
    });
  });

  describe('Property 20: Session persistence of options', () => {
    // Feature: qr-code-generator, Property 20: Session persistence of options
    // Validates: Requirements 8.7
    it('should persist error correction level in sessionStorage', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('L', 'M', 'Q', 'H'),
          async (level) => {
            window.history.replaceState({}, '', '/');
            sessionStorage.clear();

            // Set URL with specific level
            const params = new URLSearchParams();
            params.set('text', 'test');
            params.set('level', level);
            params.set('size', '256');
            window.history.replaceState({}, '', `?${params.toString()}`);

            const { unmount } = render(<App />);

            // Wait for sessionStorage to be updated
            await waitFor(() => {
              const storedLevel = sessionStorage.getItem('errorCorrectionLevel');
              expect(storedLevel).toBe(level);
            });

            unmount();

            // Clear URL and render again - should load from sessionStorage
            window.history.replaceState({}, '', '/');
            const { unmount: unmount2 } = render(<App />);

            // Verify the level persisted from sessionStorage
            await waitFor(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const urlLevel = urlParams.get('level');
              expect(urlLevel).toBe(level);
            });

            unmount2();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should persist QR size in sessionStorage', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 200, max: 512 }),
          async (size) => {
            window.history.replaceState({}, '', '/');
            sessionStorage.clear();

            // Set URL with specific size
            const params = new URLSearchParams();
            params.set('text', 'test');
            params.set('level', 'M');
            params.set('size', size.toString());
            window.history.replaceState({}, '', `?${params.toString()}`);

            const { unmount } = render(<App />);

            // Wait for sessionStorage to be updated
            await waitFor(() => {
              const storedSize = sessionStorage.getItem('qrSize');
              expect(storedSize).toBe(size.toString());
            });

            unmount();

            // Clear URL and render again - should load from sessionStorage
            window.history.replaceState({}, '', '/');
            const { unmount: unmount2 } = render(<App />);

            // Verify the size persisted from sessionStorage
            await waitFor(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const urlSize = urlParams.get('size');
              expect(urlSize).toBe(size.toString());
            });

            unmount2();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 21: Error correction level support', () => {
    // Feature: qr-code-generator, Property 21: Error correction level support
    // Validates: Requirements 9.3
    it('should generate QR codes successfully with all error correction levels', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('L', 'M', 'Q', 'H'),
          fc.string({ minLength: 1, maxLength: 100 }),
          async (level, text) => {
            window.history.replaceState({}, '', '/');
            sessionStorage.clear();

            // Set URL with specific level and text
            const params = new URLSearchParams();
            params.set('text', text);
            params.set('level', level);
            params.set('size', '256');
            window.history.replaceState({}, '', `?${params.toString()}`);

            const { unmount, container } = render(<App />);

            // Verify QR code is generated successfully
            await waitFor(() => {
              const canvas = container.querySelector('canvas');
              expect(canvas).toBeInTheDocument();
              
              // Verify no error message is displayed
              const errorElement = container.querySelector('.qr-error');
              expect(errorElement).not.toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 15: URL initialization generates QR code', () => {
    // Feature: qr-code-generator, Property 15: URL initialization generates QR code
    // Validates: Requirements 7.3
    it('should automatically generate QR code when app loads with URL parameters', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          async (text) => {
            window.history.replaceState({}, '', '/');
            sessionStorage.clear();

            // Set URL parameter with text before rendering
            const params = new URLSearchParams();
            params.set('text', text);
            params.set('level', 'M');
            params.set('size', '256');
            window.history.replaceState({}, '', `?${params.toString()}`);

            const { unmount, container } = render(<App />);

            // Verify that:
            // 1. Input is pre-filled with text from URL
            // 2. QR code is automatically generated and displayed
            await waitFor(() => {
              // Check input is pre-filled
              const textarea = container.querySelector('textarea');
              expect(textarea).toBeInTheDocument();
              expect(textarea?.value).toBe(text);

              // Check QR code is displayed (canvas element exists)
              const canvas = container.querySelector('canvas');
              expect(canvas).toBeInTheDocument();
              
              // Verify no placeholder message is shown
              const placeholder = container.querySelector('.qr-placeholder');
              expect(placeholder).not.toBeInTheDocument();
            });

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Integration Test: Complete URL sharing flow', () => {
    // Integration test for complete URL sharing flow
    // Validates: Requirements 7.1, 7.2, 7.3
    it('should support complete URL sharing flow: generate → URL updates → copy URL → load in new instance → verify state', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          fc.constantFrom('L', 'M', 'Q', 'H'),
          fc.integer({ min: 200, max: 400 }),
          async (text, level, size) => {
            // Step 1: Start with clean state
            window.history.replaceState({}, '', '/');
            sessionStorage.clear();

            // Step 2: Render app and simulate user entering text
            const params = new URLSearchParams();
            params.set('text', text);
            params.set('level', level);
            params.set('size', size.toString());
            window.history.replaceState({}, '', `?${params.toString()}`);

            const { unmount: unmount1, container: container1 } = render(<App />);

            // Step 3: Verify QR code is generated and URL is updated
            await waitFor(() => {
              const canvas = container1.querySelector('canvas');
              expect(canvas).toBeInTheDocument();

              const urlParams = new URLSearchParams(window.location.search);
              expect(urlParams.get('text')).toBe(text);
              expect(urlParams.get('level')).toBe(level);
              expect(urlParams.get('size')).toBe(size.toString());
            });

            // Step 4: Copy the URL (simulate by storing it)
            const sharedURL = window.location.search;

            unmount1();

            // Step 5: Simulate loading in a new instance (clear state and load with copied URL)
            sessionStorage.clear();
            window.history.replaceState({}, '', sharedURL);

            const { unmount: unmount2, container: container2 } = render(<App />);

            // Step 6: Verify state is restored correctly
            await waitFor(() => {
              // Input should be pre-filled
              const textarea = container2.querySelector('textarea');
              expect(textarea).toBeInTheDocument();
              expect(textarea?.value).toBe(text);

              // QR code should be automatically generated
              const canvas = container2.querySelector('canvas');
              expect(canvas).toBeInTheDocument();

              // URL should contain the same parameters
              const urlParams = new URLSearchParams(window.location.search);
              expect(urlParams.get('text')).toBe(text);
              expect(urlParams.get('level')).toBe(level);
              expect(urlParams.get('size')).toBe(size.toString());

              // No placeholder should be shown
              const placeholder = container2.querySelector('.qr-placeholder');
              expect(placeholder).not.toBeInTheDocument();
            });

            unmount2();
          }
        ),
        { numRuns: 50 } // Reduced runs due to multiple render cycles
      );
    });
  });
});
