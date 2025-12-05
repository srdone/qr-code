import { ChangeEvent } from 'react';
import './AdvancedOptions.css';

interface AdvancedOptionsProps {
  isExpanded: boolean;
  onToggle: () => void;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  onErrorCorrectionChange: (level: 'L' | 'M' | 'Q' | 'H') => void;
  qrSize: number;
  onSizeChange: (size: number) => void;
}

const ERROR_CORRECTION_DESCRIPTIONS = {
  L: 'Low (~7% error correction)',
  M: 'Medium (~15% error correction)',
  Q: 'Quartile (~25% error correction)',
  H: 'High (~30% error correction)'
};

export function AdvancedOptions({
  isExpanded,
  onToggle,
  errorCorrectionLevel,
  onErrorCorrectionChange,
  qrSize,
  onSizeChange
}: AdvancedOptionsProps) {
  const handleErrorCorrectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onErrorCorrectionChange(e.target.value as 'L' | 'M' | 'Q' | 'H');
  };

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize >= 128 && newSize <= 512) {
      onSizeChange(newSize);
    }
  };

  return (
    <div className="advanced-options">
      <button
        className="advanced-toggle"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls="advanced-controls"
      >
        {isExpanded ? '▼' : '▶'} Advanced Options
      </button>

      {isExpanded && (
        <div id="advanced-controls" className="advanced-controls">
          <div className="control-group">
            <label htmlFor="error-correction">
              Error Correction Level
            </label>
            <select
              id="error-correction"
              value={errorCorrectionLevel}
              onChange={handleErrorCorrectionChange}
              aria-label="Error correction level"
            >
              <option value="L">{ERROR_CORRECTION_DESCRIPTIONS.L}</option>
              <option value="M">{ERROR_CORRECTION_DESCRIPTIONS.M}</option>
              <option value="Q">{ERROR_CORRECTION_DESCRIPTIONS.Q}</option>
              <option value="H">{ERROR_CORRECTION_DESCRIPTIONS.H}</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="qr-size">
              QR Code Size: {qrSize}px
            </label>
            <input
              type="range"
              id="qr-size"
              min="128"
              max="512"
              step="32"
              value={qrSize}
              onChange={handleSizeChange}
              aria-label="QR code size"
            />
            <input
              type="number"
              id="qr-size-number"
              min="128"
              max="512"
              value={qrSize}
              onChange={handleSizeChange}
              aria-label="QR code size number input"
            />
          </div>
        </div>
      )}
    </div>
  );
}
