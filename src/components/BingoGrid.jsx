import { useRef, useState, useEffect } from 'react';
import BingoTile from './BingoTile';
import DetailCard from './DetailCard';
import './BingoGrid.css';

// Sample data for tiles
// Books can be strings (title only) or objects with { title, cover }
const tileData = [
  { title: "Set During a Historical Crisis", goal: 1, booksRead: [], potentialBooks: [{ title: "Mistborn", cover: null }] },
  { title: "Living Author Translation", goal: 1, booksRead: [], potentialBooks: [{ title: "Gone Girl", cover: null }, { title: "The Silent Patient", cover: null }] },
  { title: "Poetry Collection", goal: 1, booksRead: [{ title: "Project Hail Mary", cover: null }], potentialBooks: [{ title: "Dune", cover: null }, { title: "Foundation", cover: null }] },
  { title: "Selected by a Friend", goal: 1, booksRead: [], potentialBooks: [{ title: "Beach Read", cover: null }] },
  { title: "Written by Authors from 10 Different Countries", goal: 10, booksRead: [], potentialBooks: [{ title: "All the Light We Cannot See", cover: null }] },
  { title: "Book Club Selection", goal: 1, booksRead: [], potentialBooks: [{ title: "Educated", cover: null }, { title: "Born a Crime", cover: null }] },
  { title: "Horror", goal: 2, booksRead: [], potentialBooks: [{ title: "Milk and Honey", cover: null }] },
  { title: "Annotate", goal: 2, booksRead: [{ title: "Maus", cover: null }], potentialBooks: [{ title: "Persepolis", cover: null }, { title: "Saga Vol. 1", cover: null }] },
  { title: "Short Story Collections", goal: 3, booksRead: [], potentialBooks: [{ title: "Klara and the Sun", cover: null }] },
  { title: "Published 2026", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Romantasy", goal: 1, booksRead: [], potentialBooks: [{ title: "The Count of Monte Cristo", cover: null }] },
  { title: "Reread", goal: 1, booksRead: [{ title: "The Old Man and the Sea", cover: null }], potentialBooks: [{ title: "Animal Farm", cover: null }] },
  { title: "Read 26 in 26", goal: 26, booksRead: [{ title: "Any book!", cover: null }], potentialBooks: [] },
  { title: "Selected at Random", goal: 1, booksRead: [], potentialBooks: [{ title: "The Alchemist", cover: null }, { title: "1Q84", cover: null }] },
  { title: "Longer than 700 Pages", goal: 3, booksRead: [], potentialBooks: [{ title: "Sapiens", cover: null }, { title: "Atomic Habits", cover: null }] },
  { title: "Features a Physical Journey", goal: 1, booksRead: [], potentialBooks: [{ title: "Pride and Prejudice", cover: null }, { title: "1984", cover: null }] },
  { title: "Shorter than 200 Pages", goal: 4, booksRead: [], potentialBooks: [{ title: "The Shining", cover: null }, { title: "Mexican Gothic", cover: null }] },
  { title: "Written by Female Authors", goal: 10, booksRead: [], potentialBooks: [{ title: "The Hunger Games", cover: null }] },
  { title: "By Same Author", goal: 3, booksRead: [], potentialBooks: [{ title: "Harry Potter", cover: null }] },
  { title: "Philosophy", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Book on Writing Craft", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Lonesome Dove!", goal: 1, booksRead: [], potentialBooks: [{ title: "Pachinko", cover: null }, { title: "Shōgun", cover: null }] },
  { title: "Controversial+", goal: 1, booksRead: [], potentialBooks: [{ title: "Red, White & Royal Blue", cover: null }] },
  { title: "Nonfiction", goal: 3, booksRead: [], potentialBooks: [] },
  { title: "Book Getaway Day", goal: 1, booksRead: [], potentialBooks: [] },
];

function BingoGrid({ imageSrc }) {
  const cardRef = useRef(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="bingo-container">
      <h1 className="bingo-title">2026 Book Bingo</h1>
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
        {selectedTile !== null && (
          <>
            {isMobile && (
              <div
                className="detail-backdrop"
                onClick={() => setSelectedTile(null)}
              />
            )}
            <DetailCard
              key={selectedTile}
              data={tileData[selectedTile]}
              onClose={() => setSelectedTile(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default BingoGrid;
