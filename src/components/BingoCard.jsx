import { useRef } from 'react';
import './BingoCard.css';

function BingoCard({ imageSrc }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -20;
    const rotateY = x * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  return (
    <div className="bingo-container">
      <h1 className="bingo-title">2025 Book Bingo</h1>
      <div
        ref={cardRef}
        className="bingo-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img src={imageSrc} alt="Book Bingo Card" className="bingo-image" />
      </div>
    </div>
  );
}

export default BingoCard;
