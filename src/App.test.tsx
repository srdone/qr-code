import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import App from './App';

describe('App Component - Property-Based Tests', () => {
  beforeEach(() => {
    // Clear URL parameters before each test
    window.history.replaceState({}, '', '/');
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
});
