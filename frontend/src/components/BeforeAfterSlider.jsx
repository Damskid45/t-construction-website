import { useRef, useState, useCallback } from 'react';
import './BeforeAfterSlider.css';

export default function BeforeAfterSlider({ beforeSrc, afterSrc, beforeAlt, afterAlt }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50); // percent
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  function handlePointerDown(e) {
    dragging.current = true;
    updatePosition(e.clientX ?? e.touches?.[0]?.clientX);
  }

  function handlePointerMove(e) {
    if (!dragging.current) return;
    updatePosition(e.clientX ?? e.touches?.[0]?.clientX);
  }

  function stopDragging() {
    dragging.current = false;
  }

  return (
    <div
      className="ba-slider"
      ref={containerRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={stopDragging}
    >
      <img src={afterSrc} alt={afterAlt || 'After'} className="ba-slider__layer" draggable={false} />
      <img
        src={beforeSrc}
        alt={beforeAlt || 'Before'}
        className="ba-slider__layer"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      <div className="ba-slider__handle" style={{ left: `${position}%` }}>
        <span className="ba-slider__grip">↔</span>
      </div>

      <span className="ba-slider__label ba-slider__label--before">Before</span>
      <span className="ba-slider__label ba-slider__label--after">After</span>
    </div>
  );
}
