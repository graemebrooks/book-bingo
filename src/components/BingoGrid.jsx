import { useRef, useState } from 'react';
import BingoTile from './BingoTile';
import DetailCard from './DetailCard';
import './BingoGrid.css';

// Sample data for tiles
const tileData = [
  { title: "Fantasy", goal: 3, booksRead: ["The Name of the Wind"], potentialBooks: ["Mistborn", "The Way of Kings"] },
  { title: "Mystery", goal: 2, booksRead: [], potentialBooks: ["Gone Girl", "The Silent Patient"] },
  { title: "Sci-Fi", goal: 3, booksRead: ["Project Hail Mary"], potentialBooks: ["Dune", "Foundation"] },
  { title: "Romance", goal: 1, booksRead: [], potentialBooks: ["Beach Read"] },
  { title: "Historical Fiction", goal: 2, booksRead: [], potentialBooks: ["All the Light We Cannot See"] },
  { title: "Memoir", goal: 1, booksRead: [], potentialBooks: ["Educated", "Born a Crime"] },
  { title: "Poetry", goal: 1, booksRead: [], potentialBooks: ["Milk and Honey"] },
  { title: "Graphic Novel", goal: 2, booksRead: ["Maus"], potentialBooks: ["Persepolis", "Saga Vol. 1"] },
  { title: "Award Winner", goal: 1, booksRead: [], potentialBooks: ["Klara and the Sun"] },
  { title: "Debut Author", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Over 500 Pages", goal: 1, booksRead: [], potentialBooks: ["The Count of Monte Cristo"] },
  { title: "Under 200 Pages", goal: 2, booksRead: ["The Old Man and the Sea"], potentialBooks: ["Animal Farm"] },
  { title: "Free Space", goal: 1, booksRead: ["Any book!"], potentialBooks: [] },
  { title: "Translated Work", goal: 1, booksRead: [], potentialBooks: ["The Alchemist", "1Q84"] },
  { title: "Non-Fiction", goal: 2, booksRead: [], potentialBooks: ["Sapiens", "Atomic Habits"] },
  { title: "Classic", goal: 1, booksRead: [], potentialBooks: ["Pride and Prejudice", "1984"] },
  { title: "Horror", goal: 1, booksRead: [], potentialBooks: ["The Shining", "Mexican Gothic"] },
  { title: "YA Novel", goal: 1, booksRead: [], potentialBooks: ["The Hunger Games"] },
  { title: "Reread", goal: 1, booksRead: [], potentialBooks: ["Harry Potter"] },
  { title: "Audiobook", goal: 2, booksRead: [], potentialBooks: [] },
  { title: "Book Club Pick", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Set in Asia", goal: 1, booksRead: [], potentialBooks: ["Pachinko", "Shōgun"] },
  { title: "LGBTQ+", goal: 1, booksRead: [], potentialBooks: ["Red, White & Royal Blue"] },
  { title: "Published 2026", goal: 2, booksRead: [], potentialBooks: [] },
  { title: "Rec from Friend", goal: 1, booksRead: [], potentialBooks: [] },
];

function BingoGrid({ imageSrc }) {
  const cardRef = useRef(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);

  const getTileFromPosition = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Get position relative to card (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Clamp to valid range
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;

    // Calculate tile index
    const col = Math.floor(x * 5);
    const row = Math.floor(y * 5);
    return row * 5 + col;
  };

  const handleMouseMove = (e) => {
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
        >
          <div className="bingo-grid">
            {tiles}
          </div>
        </div>
        {selectedTile !== null && (
          <DetailCard
            data={tileData[selectedTile]}
            onClose={() => setSelectedTile(null)}
          />
        )}
      </div>
    </div>
  );
}

export default BingoGrid;
