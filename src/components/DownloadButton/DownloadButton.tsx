import { useRef, useEffect } from 'react';
import './DownloadButton.css';

interface DownloadButtonProps {
  text: string;
  canvasId?: string;
}

export function DownloadButton({ text, canvasId = 'qr-canvas' }: DownloadButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Find the QR code canvas in the DOM
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    canvasRef.current = canvas;
  }, [text]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    
    if (!canvas) {
      console.error('Download error: QR code canvas not found');
      alert('Unable to download QR code. Please try generating the QR code again.');
      return;
    }

    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Download error: Failed to create blob from canvas');
          alert('Unable to download QR code. Your browser may not support this feature.');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = Date.now();
        link.href = url;
        link.download = `qrcode-${timestamp}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      alert('An error occurred while downloading the QR code. Please try again.');
    }
  };

  // Show button only when there's text (QR code is displayed)
  if (!text || text.length === 0) {
    return null;
  }

  return (
    <button 
      className="download-button"
      onClick={handleDownload}
      aria-label="Download QR code as PNG"
    >
      Download QR Code
    </button>
  );
}
