import { useRef } from 'react';
import './BingoTile.css';

function BingoTile({ label, index }) {
  const tileRef = useRef(null);

  const handleMouseMove = (e) => {
    const tile = tileRef.current;
    const rect = tile.getBoundingClientRect();

    // Calculate mouse position relative to tile center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply rotation (inverted for natural feel)
    const rotateX = y * -20; // tilt up/down
    const rotateY = x * 20;  // tilt left/right

    tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
  };

  const handleMouseLeave = (e) => {
    const tile = tileRef.current;
    tile.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <div
      ref={tileRef}
      className="bingo-tile"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tile-content">
        <span className="tile-label">{label}</span>
      </div>
    </div>
  );
}

export default BingoTile;
