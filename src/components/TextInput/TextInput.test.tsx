import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { TextInput } from './TextInput';

afterEach(() => {
  cleanup();
});

describe('TextInput Component', () => {
  describe('Property-Based Tests', () => {
    it('Property 1: Text input acceptance - for any string up to 1000 characters, typing into the field should display that exact string', () => {
      // Feature: qr-code-generator, Property 1: Text input acceptance
      // Validates: Requirements 1.2, 1.5
      
      fc.assert(
        fc.asyncProperty(
          fc.string({ maxLength: 1000 }),
          async (inputText) => {
            const onChange = vi.fn();
            const { container, rerender, unmount } = render(
              <TextInput value="" onChange={onChange} maxLength={1000} />
            );

            const textarea = within(container).getByRole('textbox');
            
            // Simulate user typing - only if text is non-empty
            // userEvent.type() doesn't handle empty strings
            if (inputText.length > 0) {
              await userEvent.clear(textarea);
              await userEvent.type(textarea, inputText);

              // Verify onChange was called with the input text
              expect(onChange).toHaveBeenCalled();
              const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
              expect(lastCall[0]).toBe(inputText);
            }

            // Rerender with the new value to verify display
            rerender(
              <TextInput value={inputText} onChange={onChange} maxLength={1000} />
            );

            // Verify the textarea displays the exact string
            expect(textarea).toHaveValue(inputText);
            
            // Clean up after each iteration
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests', () => {
    it('should render with empty value initially', () => {
      const onChange = vi.fn();
      const { container } = render(<TextInput value="" onChange={onChange} maxLength={1000} />);
      
      const textarea = within(container).getByRole('textbox');
      expect(textarea).toHaveValue('');
      expect(textarea).toBeInTheDocument();
    });

    it('should display character counter with current length vs maximum', () => {
      const onChange = vi.fn();
      const { container } = render(<TextInput value="Hello" onChange={onChange} maxLength={1000} />);
      
      expect(within(container).getByText('5 / 1000')).toBeInTheDocument();
    });

    it('should update character counter when value changes', () => {
      const onChange = vi.fn();
      const { container, rerender } = render(
        <TextInput value="" onChange={onChange} maxLength={1000} />
      );
      
      expect(within(container).getByText('0 / 1000')).toBeInTheDocument();
      
      rerender(<TextInput value="Test" onChange={onChange} maxLength={1000} />);
      expect(within(container).getByText('4 / 1000')).toBeInTheDocument();
    });

    it('should invoke onChange callback when user types', async () => {
      const onChange = vi.fn();
      const { container } = render(<TextInput value="" onChange={onChange} maxLength={1000} />);
      
      const textarea = within(container).getByRole('textbox');
      await userEvent.type(textarea, 'Hello');
      
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.length).toBeGreaterThan(0);
    });

    it('should pass the new value to onChange callback', async () => {
      const onChange = vi.fn();
      const { container } = render(<TextInput value="" onChange={onChange} maxLength={1000} />);
      
      const textarea = within(container).getByRole('textbox');
      await userEvent.type(textarea, 'A');
      
      expect(onChange).toHaveBeenCalledWith('A');
    });
  });
});
