import { useRef, useState, useEffect } from 'react';
import BingoTile from './BingoTile';
import DetailCard from './DetailCard';
import './BingoGrid.css';

// Tile data - books will be filled in later
// Books use { title, isbn } - covers are fetched from Open Library API
const tileData = [
  { title: "Set During a Historical Crisis", color: "#f97316", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Living Author Translation", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Poetry Collection", color: "#3b82f6", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Selected by a Friend", color: "#ef4444", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Written by Authors from 10 Different Countries", color: "#166534", goal: 10, booksRead: [], potentialBooks: [] },
  { title: "Book Club Selection", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Horror", color: "#ef4444", goal: 2, booksRead: [], potentialBooks: [], effect: "/effects/horror.gif" },
  { title: "Annotate", color: "#fef3c7", goal: 2, booksRead: [], potentialBooks: [] },
  { title: "Short Story Collections", color: "#93c5fd", goal: 3, booksRead: [], potentialBooks: [] },
  { title: "Published 2026", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Romantasy", color: "#bbf7d0", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Reread", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Read 26 in 26", color: "#ef4444", goal: 26, booksRead: [], potentialBooks: [] },
  { title: "Selected at Random", color: "#3b82f6", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Longer than 700 Pages", color: "#f9a8d4", goal: 3, booksRead: [], potentialBooks: [] },
  { title: "Features a Physical Journey", color: "#6ee7b7", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Shorter than 200 Pages", color: "#d2b48c", goal: 4, booksRead: [], potentialBooks: [] },
  { title: "Written by Female Authors", color: "#e5e5e5", goal: 10, booksRead: [], potentialBooks: [] },
  { title: "By Same Author", color: "#f97316", goal: 3, booksRead: [], potentialBooks: [] },
  { title: "Philosophy", color: "#facc15", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Book on Writing Craft", color: "#c4b5fd", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Lonesome Dove!", color: "#ea580c", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Controversial+", color: "#ef4444", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Nonfiction", color: "#1d4ed8", goal: 3, booksRead: [], potentialBooks: [] },
  { title: "Book Getaway Day: Cover 2 Cover", color: "#f97316", goal: 1, booksRead: [], potentialBooks: [] },
];

function BingoGrid({ imageSrc }) {
  const cardRef = useRef(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeEffect, setActiveEffect] = useState(null);

  // Detect mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getTileFromPosition = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Get position relative to card (0 to 1)
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    // Clamp to valid range
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;

    // Calculate tile index
    const col = Math.floor(x * 5);
    const row = Math.floor(y * 5);
    return row * 5 + col;
  };

  const handleMouseMove = (e) => {
    if (isMobile) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -20;
    const rotateY = x * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px)`;

    // Update hovered tile based on position
    const tileIndex = getTileFromPosition(e);
    if (tileIndex !== null && tileIndex !== hoveredTile) {
      setHoveredTile(tileIndex);
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;

    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    setHoveredTile(null);
  };

  const handleCardClick = (e) => {
    const tileIndex = getTileFromPosition(e);
    if (tileIndex !== null) {
      // Check if tile has an effect
      const tile = tileData[tileIndex];
      if (tile.effect && selectedTile !== tileIndex) {
        setActiveEffect(tile.effect);
        // Auto-dismiss effect after animation
        setTimeout(() => setActiveEffect(null), 3000);
      }
      setSelectedTile(selectedTile === tileIndex ? null : tileIndex);
    }
  };

  // Handle touch for sticker lift on mobile
  const handleTouchStart = (e) => {
    const tileIndex = getTileFromPosition(e);
    if (tileIndex !== null) {
      setHoveredTile(tileIndex);
    }
  };

  const handleTouchEnd = () => {
    // Small delay before removing hover state so animation can be seen
    setTimeout(() => setHoveredTile(null), 300);
  };

  // Test stickers
  const doneTiles = [5, 12];

  // Generate 5x5 grid of tiles
  const tiles = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const tileIndex = row * 5 + col;
      tiles.push(
        <BingoTile
          key={`${row}-${col}`}
          row={row}
          col={col}
          index={tileIndex}
          imageSrc={imageSrc}
          isHovered={hoveredTile === tileIndex}
          isSelected={selectedTile === tileIndex}
          isDone={doneTiles.includes(tileIndex)}
        />
      );
    }
  }

  return (
    <>
      <div className={`bingo-container ${selectedTile !== null && isMobile ? 'shifted' : ''}`}>
        <h1
          className="bingo-title"
          style={selectedTile !== null ? { '--title-color': tileData[selectedTile].color } : undefined}
        >
          {'2026 Book Bingo'.split('').map((char, i) => (
            <span key={i} className={`title-char char-${i}`}>{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </h1>
        <div className={`bingo-layout ${selectedTile !== null ? 'expanded' : ''}`}>
          <div
            ref={cardRef}
            className="bingo-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="bingo-grid">
              {tiles}
            </div>
          </div>
          {selectedTile !== null && !isMobile && (
            <DetailCard
              key={selectedTile}
              data={tileData[selectedTile]}
              onClose={() => setSelectedTile(null)}
            />
          )}
        </div>
      </div>
      {selectedTile !== null && isMobile && (
        <>
          <div
            className="detail-backdrop"
            onClick={() => setSelectedTile(null)}
          />
          <DetailCard
            key={selectedTile}
            data={tileData[selectedTile]}
            onClose={() => setSelectedTile(null)}
          />
        </>
      )}
      {activeEffect && (
        <div className="effect-overlay" onClick={() => setActiveEffect(null)}>
          <img src={activeEffect} alt="" className="effect-image" />
        </div>
      )}
    </>
  );
}

export default BingoGrid;
