import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { DownloadButton } from './DownloadButton';

afterEach(() => {
  cleanup();
});

describe('DownloadButton Component', () => {
  describe('Property-Based Tests', () => {
    it('Property 7: Download button presence - for any state where a QR code is displayed, a download button should be present', () => {
      // Feature: qr-code-generator, Property 7: Download button presence
      // Validates: Requirements 4.1
      
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 1000 }),
          (text) => {
            // Create a mock canvas element to simulate QR code presence
            const mockCanvas = document.createElement('canvas');
            document.body.appendChild(mockCanvas);

            const { container, unmount } = render(<DownloadButton text={text} />);

            // When text is non-empty (QR code is displayed), button should be present
            const button = within(container).queryByRole('button', { name: /download/i });
            expect(button).toBeInTheDocument();
            expect(button).toBeVisible();

            // Clean up
            document.body.removeChild(mockCanvas);
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 7 (edge case): Download button hidden when no QR code - for empty text, button should not be present', () => {
      // Feature: qr-code-generator, Property 7: Download button presence
      // Validates: Requirements 4.1
      
      const { container } = render(<DownloadButton text="" />);

      // When text is empty (no QR code), button should not be present
      const button = within(container).queryByRole('button', { name: /download/i });
      expect(button).not.toBeInTheDocument();
    });

    it('Property 8: Download triggers file save - for any displayed QR code, clicking download should initiate a browser download', async () => {
      // Feature: qr-code-generator, Property 8: Download triggers file save
      // Validates: Requirements 4.2
      
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 1000 }),
          async (text) => {
            // Create a mock canvas with toBlob method
            const mockCanvas = document.createElement('canvas');
            mockCanvas.width = 256;
            mockCanvas.height = 256;
            
            // Mock toBlob to simulate successful blob creation
            const originalToBlob = mockCanvas.toBlob;
            let blobCallbackCalled = false;
            mockCanvas.toBlob = function(callback: BlobCallback, type?: string) {
              blobCallbackCalled = true;
              // Create a mock blob
              const blob = new Blob(['mock'], { type: type || 'image/png' });
              callback(blob);
            };

            document.body.appendChild(mockCanvas);

            // Mock URL.createObjectURL and URL.revokeObjectURL
            const originalCreateObjectURL = URL.createObjectURL;
            const originalRevokeObjectURL = URL.revokeObjectURL;
            let objectURLCreated = false;
            let objectURLRevoked = false;

            URL.createObjectURL = vi.fn(() => {
              objectURLCreated = true;
              return 'blob:mock-url';
            });

            URL.revokeObjectURL = vi.fn(() => {
              objectURLRevoked = true;
            });

            // Mock link click
            const originalCreateElement = document.createElement.bind(document);
            let linkClicked = false;
            document.createElement = vi.fn((tagName: string) => {
              const element = originalCreateElement(tagName);
              if (tagName === 'a') {
                element.click = vi.fn(() => {
                  linkClicked = true;
                });
              }
              return element;
            }) as any;

            const { container, unmount } = render(<DownloadButton text={text} />);

            const button = within(container).getByRole('button', { name: /download/i });
            await userEvent.click(button);

            // Verify download was triggered
            expect(blobCallbackCalled).toBe(true);
            expect(objectURLCreated).toBe(true);
            expect(linkClicked).toBe(true);
            expect(objectURLRevoked).toBe(true);

            // Clean up
            document.body.removeChild(mockCanvas);
            mockCanvas.toBlob = originalToBlob;
            URL.createObjectURL = originalCreateObjectURL;
            URL.revokeObjectURL = originalRevokeObjectURL;
            document.createElement = originalCreateElement;
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 9: Download format is PNG - for any downloaded QR code file, the format should be PNG', async () => {
      // Feature: qr-code-generator, Property 9: Download format is PNG
      // Validates: Requirements 4.3
      
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 1000 }),
          async (text) => {
            // Create a mock canvas
            const mockCanvas = document.createElement('canvas');
            mockCanvas.width = 256;
            mockCanvas.height = 256;
            
            // Track the type parameter passed to toBlob
            let blobType: string | undefined;
            mockCanvas.toBlob = function(callback: BlobCallback, type?: string) {
              blobType = type;
              const blob = new Blob(['mock'], { type: type || 'image/png' });
              callback(blob);
            };

            document.body.appendChild(mockCanvas);

            // Mock URL methods
            const originalCreateObjectURL = URL.createObjectURL;
            const originalRevokeObjectURL = URL.revokeObjectURL;
            URL.createObjectURL = vi.fn(() => 'blob:mock-url');
            URL.revokeObjectURL = vi.fn();

            // Mock link click
            const originalCreateElement = document.createElement.bind(document);
            document.createElement = vi.fn((tagName: string) => {
              const element = originalCreateElement(tagName);
              if (tagName === 'a') {
                element.click = vi.fn();
              }
              return element;
            }) as any;

            const { container, unmount } = render(<DownloadButton text={text} />);

            const button = within(container).getByRole('button', { name: /download/i });
            await userEvent.click(button);

            // Verify PNG format was requested
            expect(blobType).toBe('image/png');

            // Clean up
            document.body.removeChild(mockCanvas);
            URL.createObjectURL = originalCreateObjectURL;
            URL.revokeObjectURL = originalRevokeObjectURL;
            document.createElement = originalCreateElement;
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 10: Download filename contains identifier - for any downloaded QR code, filename should contain timestamp', async () => {
      // Feature: qr-code-generator, Property 10: Download filename contains identifier
      // Validates: Requirements 4.4
      
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 1000 }),
          async (text) => {
            // Create a mock canvas
            const mockCanvas = document.createElement('canvas');
            mockCanvas.width = 256;
            mockCanvas.height = 256;
            
            mockCanvas.toBlob = function(callback: BlobCallback, type?: string) {
              const blob = new Blob(['mock'], { type: type || 'image/png' });
              callback(blob);
            };

            document.body.appendChild(mockCanvas);

            // Mock URL methods
            const originalCreateObjectURL = URL.createObjectURL;
            const originalRevokeObjectURL = URL.revokeObjectURL;
            URL.createObjectURL = vi.fn(() => 'blob:mock-url');
            URL.revokeObjectURL = vi.fn();

            // Track the download filename
            let downloadFilename: string | undefined;
            const originalCreateElement = document.createElement.bind(document);
            document.createElement = vi.fn((tagName: string) => {
              const element = originalCreateElement(tagName);
              if (tagName === 'a') {
                element.click = vi.fn();
                // Override the download property setter to capture the filename
                Object.defineProperty(element, 'download', {
                  set: (value: string) => {
                    downloadFilename = value;
                  },
                  get: () => downloadFilename
                });
              }
              return element;
            }) as any;

            const { container, unmount } = render(<DownloadButton text={text} />);

            const button = within(container).getByRole('button', { name: /download/i });
            await userEvent.click(button);

            // Verify filename format: qrcode-{timestamp}.png
            expect(downloadFilename).toBeDefined();
            expect(downloadFilename).toMatch(/^qrcode-\d+\.png$/);
            
            // Extract and verify timestamp is a valid number
            const match = downloadFilename!.match(/^qrcode-(\d+)\.png$/);
            expect(match).not.toBeNull();
            const timestamp = parseInt(match![1], 10);
            expect(timestamp).toBeGreaterThan(0);
            expect(timestamp).toBeLessThanOrEqual(Date.now());

            // Clean up
            document.body.removeChild(mockCanvas);
            URL.createObjectURL = originalCreateObjectURL;
            URL.revokeObjectURL = originalRevokeObjectURL;
            document.createElement = originalCreateElement;
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    beforeEach(() => {
      // Create a mock canvas for unit tests
      const mockCanvas = document.createElement('canvas');
      mockCanvas.width = 256;
      mockCanvas.height = 256;
      document.body.appendChild(mockCanvas);
    });

    afterEach(() => {
      // Clean up canvas
      const canvas = document.querySelector('canvas');
      if (canvas) {
        document.body.removeChild(canvas);
      }
    });

    it('should render button when QR code is present (text is non-empty)', () => {
      const { container } = render(<DownloadButton text="Hello World" />);
      
      const button = within(container).queryByRole('button', { name: /download/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeVisible();
    });

    it('should not render button when no QR code (text is empty)', () => {
      const { container } = render(<DownloadButton text="" />);
      
      const button = within(container).queryByRole('button', { name: /download/i });
      expect(button).not.toBeInTheDocument();
    });

    it('should call download handler when button is clicked', async () => {
      // Mock canvas toBlob
      const mockCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      const originalToBlob = mockCanvas.toBlob;
      mockCanvas.toBlob = vi.fn((callback: BlobCallback) => {
        const blob = new Blob(['mock'], { type: 'image/png' });
        callback(blob);
      });

      // Mock URL methods
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = vi.fn();

      // Mock link click
      const originalCreateElement = document.createElement.bind(document);
      const clickMock = vi.fn();
      document.createElement = vi.fn((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = clickMock;
        }
        return element;
      }) as any;

      const { container } = render(<DownloadButton text="Test" />);
      
      const button = within(container).getByRole('button', { name: /download/i });
      await userEvent.click(button);

      expect(mockCanvas.toBlob).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();

      // Restore
      mockCanvas.toBlob = originalToBlob;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      document.createElement = originalCreateElement;
    });

    it('should generate filename with timestamp format', async () => {
      // Mock canvas toBlob
      const mockCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      const originalToBlob = mockCanvas.toBlob;
      mockCanvas.toBlob = vi.fn((callback: BlobCallback) => {
        const blob = new Blob(['mock'], { type: 'image/png' });
        callback(blob);
      });

      // Mock URL methods
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = vi.fn();

      // Track filename
      let capturedFilename: string | undefined;
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = vi.fn((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = vi.fn();
          Object.defineProperty(element, 'download', {
            set: (value: string) => {
              capturedFilename = value;
            },
            get: () => capturedFilename
          });
        }
        return element;
      }) as any;

      const { container } = render(<DownloadButton text="Test" />);
      
      const button = within(container).getByRole('button', { name: /download/i });
      await userEvent.click(button);

      expect(capturedFilename).toMatch(/^qrcode-\d+\.png$/);

      // Restore
      mockCanvas.toBlob = originalToBlob;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      document.createElement = originalCreateElement;
    });
  });
});
