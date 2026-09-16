import { useEffect } from 'react';
import './Lightbox.css';

export default function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    if (!src) return;

    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt || 'Image preview'}>
      <button className="lightbox__close" onClick={onClose} aria-label="Close image preview">
        ✕
      </button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}