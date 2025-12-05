import { Component, ErrorInfo, ReactNode } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './QRCodeDisplay.css';

interface QRCodeDisplayProps {
  text: string;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

interface QRCodeDisplayState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<
  { children: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('QR Code generation error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="qr-error" role="alert">
          <p>Failed to generate QR code</p>
          <p className="error-details">{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export function QRCodeDisplay({ text, size, errorCorrectionLevel }: QRCodeDisplayProps) {
  // Ensure minimum size of 200x200 pixels
  const actualSize = Math.max(size, 200);

  if (!text || text.length === 0) {
    return (
      <div className="qr-placeholder" role="status">
        <p>Enter text to generate a QR code</p>
      </div>
    );
  }

  try {
    return (
      <ErrorBoundary>
        <div className="qr-display">
          <QRCodeCanvas
            value={text}
            size={actualSize}
            level={errorCorrectionLevel}
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('QR Code generation error:', error);
    return (
      <div className="qr-error" role="alert">
        <p>Failed to generate QR code</p>
        <p className="error-details">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
