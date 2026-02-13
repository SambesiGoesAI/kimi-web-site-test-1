import { useState, useEffect, useCallback } from 'react';
import PorssisahkoWidget from './PorssisahkoWidget';
import './hub.css';

type ActiveWidget = 'none' | 'electricity';

const KEY_MAP: Record<string, ActiveWidget> = {
  e: 'electricity',
  Escape: 'none',
};

export default function HubApp() {
  const [activeWidget, setActiveWidget] = useState<ActiveWidget>('none');

  const handleKey = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const widget = KEY_MAP[e.key];
    if (widget !== undefined) {
      setActiveWidget((prev) => (prev === widget ? 'none' : widget));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div className="hub-root">
      {/* Idle screen */}
      {activeWidget === 'none' && (
        <div className="hub-idle animate-fade-in">
          <h1 className="hub-title">Hub</h1>
          <div className="hub-keys">
            <KeyHint keyChar="E" label="Electricity price" />
          </div>
          <div className="hub-hint">Press a key to get started</div>
        </div>
      )}

      {/* Electricity widget */}
      {activeWidget === 'electricity' && (
        <div className="hub-widget-container animate-fade-in">
          <PorssisahkoWidget />
          <div className="hub-back-hint">
            Press <kbd>E</kbd> or <kbd>Esc</kbd> to close
          </div>
        </div>
      )}
    </div>
  );
}

function KeyHint({ keyChar, label }: { keyChar: string; label: string }) {
  return (
    <button
      className="hub-key-hint"
      onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: keyChar.toLowerCase() }))}
    >
      <kbd className="hub-kbd">{keyChar}</kbd>
      <span className="hub-key-label">{label}</span>
    </button>
  );
}
