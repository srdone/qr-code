import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { AdvancedOptions } from './AdvancedOptions';

afterEach(() => {
  cleanup();
});

describe('AdvancedOptions Component', () => {
  describe('Property-Based Tests', () => {
    it('Property 17: Advanced options toggle - for any state (expanded or collapsed), clicking toggle should switch to opposite state', () => {
      // Feature: qr-code-generator, Property 17: Advanced options toggle
      // Validates: Requirements 8.2, 8.3
      
      fc.assert(
        fc.asyncProperty(
          fc.boolean(), // Initial expanded state
          fc.constantFrom('L', 'M', 'Q', 'H'), // Error correction level
          fc.integer({ min: 128, max: 512 }), // QR size
          async (initialExpanded, errorLevel, qrSize) => {
            const onToggle = vi.fn();
            const onErrorCorrectionChange = vi.fn();
            const onSizeChange = vi.fn();

            const { container, unmount } = render(
              <AdvancedOptions
                isExpanded={initialExpanded}
                onToggle={onToggle}
                errorCorrectionLevel={errorLevel}
                onErrorCorrectionChange={onErrorCorrectionChange}
                qrSize={qrSize}
                onSizeChange={onSizeChange}
              />
            );

            const toggleButton = within(container).getByRole('button', { name: /advanced options/i });
            
            // Verify initial state
            expect(toggleButton).toHaveAttribute('aria-expanded', String(initialExpanded));
            
            // Click the toggle button
            await userEvent.click(toggleButton);
            
            // Verify onToggle was called
            expect(onToggle).toHaveBeenCalledTimes(1);
            
            // Clean up
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('Property 18: Advanced controls presence - when expanded, controls for error correction and size should be present', () => {
      // Feature: qr-code-generator, Property 18: Advanced controls presence
      // Validates: Requirements 8.4, 8.5
      
      fc.assert(
        fc.property(
          fc.boolean(), // isExpanded state
          fc.constantFrom('L', 'M', 'Q', 'H'), // Error correction level
          fc.integer({ min: 128, max: 512 }), // QR size
          (isExpanded, errorLevel, qrSize) => {
            const onToggle = vi.fn();
            const onErrorCorrectionChange = vi.fn();
            const onSizeChange = vi.fn();

            const { container, unmount } = render(
              <AdvancedOptions
                isExpanded={isExpanded}
                onToggle={onToggle}
                errorCorrectionLevel={errorLevel}
                onErrorCorrectionChange={onErrorCorrectionChange}
                qrSize={qrSize}
                onSizeChange={onSizeChange}
              />
            );

            if (isExpanded) {
              // When expanded, controls should be present
              const errorCorrectionSelect = within(container).queryByLabelText(/error correction level/i);
              const sizeSlider = within(container).queryByLabelText(/qr code size$/i);
              
              expect(errorCorrectionSelect).toBeInTheDocument();
              expect(sizeSlider).toBeInTheDocument();
              
              // Verify the controls have the correct values
              expect(errorCorrectionSelect).toHaveValue(errorLevel);
              expect(sizeSlider).toHaveValue(String(qrSize));
            } else {
              // When collapsed, controls should not be present
              const errorCorrectionSelect = within(container).queryByLabelText(/error correction level/i);
              const sizeSlider = within(container).queryByLabelText(/qr code size$/i);
              
              expect(errorCorrectionSelect).not.toBeInTheDocument();
              expect(sizeSlider).not.toBeInTheDocument();
            }
            
            // Clean up
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should render in collapsed state initially', () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={false}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const toggleButton = within(container).getByRole('button', { name: /advanced options/i });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Controls should not be visible
      const controls = container.querySelector('#advanced-controls');
      expect(controls).not.toBeInTheDocument();
    });

    it('should toggle expand/collapse when button is clicked', async () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={false}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const toggleButton = within(container).getByRole('button', { name: /advanced options/i });
      await userEvent.click(toggleButton);
      
      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should show controls when expanded', () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={true}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const controls = container.querySelector('#advanced-controls');
      expect(controls).toBeInTheDocument();
      
      const errorCorrectionSelect = within(container).getByLabelText(/error correction level/i);
      const sizeSlider = within(container).getByLabelText(/qr code size$/i);
      
      expect(errorCorrectionSelect).toBeInTheDocument();
      expect(sizeSlider).toBeInTheDocument();
    });

    it('should display all error correction level options', () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={true}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const select = within(container).getByLabelText(/error correction level/i);
      const options = within(select as HTMLSelectElement).getAllByRole('option');
      
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveValue('L');
      expect(options[1]).toHaveValue('M');
      expect(options[2]).toHaveValue('Q');
      expect(options[3]).toHaveValue('H');
    });

    it('should call onErrorCorrectionChange when error correction level is changed', async () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={true}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const select = within(container).getByLabelText(/error correction level/i);
      await userEvent.selectOptions(select, 'H');
      
      expect(onErrorCorrectionChange).toHaveBeenCalledWith('H');
    });

    it('should display size slider and number input', () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={true}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const sizeSlider = within(container).getByLabelText(/qr code size$/i);
      const sizeNumber = within(container).getByLabelText(/qr code size number input/i);
      
      expect(sizeSlider).toHaveAttribute('type', 'range');
      expect(sizeNumber).toHaveAttribute('type', 'number');
      expect(sizeSlider).toHaveValue('256');
      expect(sizeNumber).toHaveValue(256);
    });

    it('should have size slider with correct attributes', () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={true}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const sizeSlider = within(container).getByLabelText(/qr code size$/i) as HTMLInputElement;
      
      expect(sizeSlider).toHaveAttribute('min', '128');
      expect(sizeSlider).toHaveAttribute('max', '512');
      expect(sizeSlider).toHaveValue('256');
    });

    it('should have size number input with correct attributes', () => {
      const onToggle = vi.fn();
      const onErrorCorrectionChange = vi.fn();
      const onSizeChange = vi.fn();

      const { container } = render(
        <AdvancedOptions
          isExpanded={true}
          onToggle={onToggle}
          errorCorrectionLevel="M"
          onErrorCorrectionChange={onErrorCorrectionChange}
          qrSize={256}
          onSizeChange={onSizeChange}
        />
      );

      const sizeNumber = within(container).getByLabelText(/qr code size number input/i) as HTMLInputElement;
      
      expect(sizeNumber).toHaveAttribute('min', '128');
      expect(sizeNumber).toHaveAttribute('max', '512');
      expect(sizeNumber).toHaveValue(256);
    });
  });
});
