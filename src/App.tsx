import { useState, useEffect } from 'react'
import './App.css'
import { TextInput } from './components/TextInput'
import { QRCodeDisplay } from './components/QRCodeDisplay'

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface AppState {
  text: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  qrSize: number;
  showAdvanced: boolean;
}

function App() {
  // Initialize state from URL parameters
  const initializeFromURL = (): AppState => {
    const params = new URLSearchParams(window.location.search);
    return {
      text: params.get('text') || '',
      errorCorrectionLevel: (params.get('level') as ErrorCorrectionLevel) || 'M',
      qrSize: parseInt(params.get('size') || '256', 10),
      showAdvanced: false
    };
  };

  const [state, setState] = useState<AppState>(initializeFromURL);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.text) {
      params.set('text', state.text);
    }
    params.set('level', state.errorCorrectionLevel);
    params.set('size', state.qrSize.toString());
    
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }, [state.text, state.errorCorrectionLevel, state.qrSize]);

  const updateText = (text: string) => {
    setState(prev => ({ ...prev, text }));
  };

  const updateErrorCorrectionLevel = (level: ErrorCorrectionLevel) => {
    setState(prev => ({ ...prev, errorCorrectionLevel: level }));
  };

  const updateQRSize = (size: number) => {
    setState(prev => ({ ...prev, qrSize: size }));
  };

  const toggleAdvanced = () => {
    setState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }));
  };

  return (
    <div className="app">
      <h1>QR Code Generator</h1>
      <TextInput 
        value={state.text}
        onChange={updateText}
        maxLength={1000}
      />
      <QRCodeDisplay
        text={state.text}
        size={state.qrSize}
        errorCorrectionLevel={state.errorCorrectionLevel}
      />
      <div>
        <p>Error Correction: {state.errorCorrectionLevel}</p>
        <p>Size: {state.qrSize}</p>
        <p>Advanced: {state.showAdvanced ? 'Shown' : 'Hidden'}</p>
      </div>
    </div>
  )
}

export default App
