import { ChangeEvent } from 'react';
import './TextInput.css';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

export function TextInput({ value, onChange, maxLength }: TextInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="text-input-container">
      <textarea
        className="text-input"
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder="Enter text to generate QR code..."
        aria-label="Text input for QR code generation"
      />
      <div className="character-counter">
        {value.length} / {maxLength}
      </div>
    </div>
  );
}
