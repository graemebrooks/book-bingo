import { useRef, useState, useEffect } from 'react';
import BingoTile from './BingoTile';
import DetailCard from './DetailCard';
import './BingoGrid.css';

// Sample data for tiles
// Books use { title, isbn } - covers are fetched from Open Library API
const tileData = [
  { title: "Set During a Historical Crisis", color: "#f97316", goal: 1, booksRead: [], potentialBooks: [{ title: "For Whom the Bell Tolls", isbn: "9780684803357" }, { title: "All Quiet on the Western Front", isbn: "9780449213940" }, { title: "Salvage the Bones", isbn: "9781608196265" }] },
  { title: "Living Author Translation", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [{ title: "Gone Girl", isbn: "9780307588371" }, { title: "The Silent Patient", isbn: "9781250301697" }] },
  { title: "Poetry Collection", color: "#3b82f6", goal: 1, booksRead: [{ title: "Project Hail Mary", isbn: "9780593135204" }], potentialBooks: [{ title: "Dune", isbn: "9780441172719" }, { title: "Foundation", isbn: "9780553293357" }] },
  { title: "Selected by a Friend", color: "#ef4444", goal: 1, booksRead: [], potentialBooks: [{ title: "Beach Read", isbn: "9781984806734" }] },
  { title: "Written by Authors from 10 Different Countries", color: "#166534", goal: 10, booksRead: [], potentialBooks: [{ title: "All the Light We Cannot See", isbn: "9781476746586" }] },
  { title: "Book Club Selection", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [{ title: "Educated", isbn: "9780399590504" }, { title: "Born a Crime", isbn: "9780399588174" }] },
  { title: "Horror", color: "#ef4444", goal: 2, booksRead: [], potentialBooks: [{ title: "The Shining", isbn: "9780307743657" }] },
  { title: "Annotate", color: "#fef3c7", goal: 2, booksRead: [{ title: "Maus", isbn: "9780394747231" }], potentialBooks: [{ title: "Persepolis", isbn: "9780375714573" }, { title: "Saga Vol. 1", isbn: "9781607066019" }] },
  { title: "Short Story Collections", color: "#93c5fd", goal: 3, booksRead: [], potentialBooks: [{ title: "Klara and the Sun", isbn: "9780571364879" }] },
  { title: "Published 2026", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Romantasy", color: "#bbf7d0", goal: 1, booksRead: [], potentialBooks: [{ title: "The Count of Monte Cristo", isbn: "9780140449266" }] },
  { title: "Reread", color: "#e5e5e5", goal: 1, booksRead: [{ title: "The Old Man and the Sea", isbn: "9780684801223" }], potentialBooks: [{ title: "Animal Farm", isbn: "9780451526342" }] },
  { title: "Read 26 in 26", color: "#ef4444", goal: 26, booksRead: [{ title: "Any book!", isbn: null }], potentialBooks: [] },
  { title: "Selected at Random", color: "#3b82f6", goal: 1, booksRead: [], potentialBooks: [{ title: "The Alchemist", isbn: "9780062315007" }, { title: "1Q84", isbn: "9780307593313" }] },
  { title: "Longer than 700 Pages", color: "#f9a8d4", goal: 3, booksRead: [], potentialBooks: [{ title: "Sapiens", isbn: "9780062316097" }, { title: "Atomic Habits", isbn: "9780735211292" }] },
  { title: "Features a Physical Journey", color: "#6ee7b7", goal: 1, booksRead: [], potentialBooks: [{ title: "Pride and Prejudice", isbn: "9780141439518" }, { title: "1984", isbn: "9780451524935" }] },
  { title: "Shorter than 200 Pages", color: "#d2b48c", goal: 4, booksRead: [], potentialBooks: [{ title: "The Old Man and the Sea", isbn: "9780684801223" }, { title: "Mexican Gothic", isbn: "9780525620785" }] },
  { title: "Written by Female Authors", color: "#e5e5e5", goal: 10, booksRead: [], potentialBooks: [{ title: "The Hunger Games", isbn: "9780439023481" }] },
  { title: "By Same Author", color: "#f97316", goal: 3, booksRead: [], potentialBooks: [{ title: "Harry Potter and the Sorcerer's Stone", isbn: "9780590353427" }] },
  { title: "Philosophy", color: "#facc15", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Book on Writing Craft", color: "#c4b5fd", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Lonesome Dove!", color: "#ea580c", goal: 1, booksRead: [], potentialBooks: [{ title: "Pachinko", isbn: "9781455563920" }, { title: "Shōgun", isbn: "9780440178002" }] },
  { title: "Controversial+", color: "#ef4444", goal: 1, booksRead: [], potentialBooks: [{ title: "Red, White & Royal Blue", isbn: "9781250316776" }] },
  { title: "Nonfiction", color: "#1d4ed8", goal: 3, booksRead: [], potentialBooks: [] },
  { title: "Book Getaway Day: Cover 2 Cover", color: "#f97316", goal: 1, booksRead: [], potentialBooks: [] },
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
    <>
      <div className={`bingo-container ${selectedTile !== null && isMobile ? 'shifted' : ''}`}>
        <h1 className="bingo-title">
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
    </>
  );
}

export default BingoGrid;
