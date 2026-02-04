import { useRef, useState, useEffect } from 'react';
import BingoTile from './BingoTile';
import DetailCard from './DetailCard';
import './BingoGrid.css';

// Currently reading book - floats behind the bingo card
const currentlyReading = {
  title: "By Night in Chile",
  author: "Roberto Bolaño",
  isbn: "9780811215473"
};

// Tile data - books will be filled in later
// Books use { title, isbn } - covers are fetched from Open Library API
const tileData = [
  { title: "Set During a Historical Crisis", color: "#f97316", goal: 1, booksRead: [], potentialBooks: [
    { title: "2666", author: "Roberto Bolaño", isbn: "9780312429218" },
    { title: "The Grapes of Wrath", author: "John Steinbeck", isbn: "9780143039433" },
    { title: "Things Fall Apart", author: "Chinua Achebe", isbn: "9780385474542" }
  ] },
  { title: "Living Author Translation", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [
    { title: "Solenoid", author: "Mircea Cărtărescu", isbn: "9781646052028" }
  ] },
  { title: "Poetry Collection", color: "#3b82f6", goal: 1, booksRead: [], potentialBooks: [
    { title: "The Dream Songs", author: "John Berryman", isbn: "9780374534554" },
    { title: "Self-Portrait in a Convex Mirror", author: "John Ashbery", isbn: "9780140586688" },
    { title: "North", author: "Seamus Heaney", isbn: "9780571108138" }
  ] },
  { title: "Selected by a Friend", color: "#ef4444", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Written by Authors from 10 Different Countries", color: "#166534", goal: 10, booksRead: [
    { title: "By Night in Chile", author: "Roberto Bolaño", isbn: "9780811215473", country: "Chile" }
  ], potentialBooks: [
    { title: "When I Sing, Mountains Dance", author: "Irene Solà", isbn: "9781644450802" },
    { title: "Madonna in a Fur Coat", author: "Sabahattin Ali", isbn: "9781590518809" },
    { title: "Pedro Páramo", author: "Juan Rulfo", isbn: "9780802160935" },
    { title: "White Nights", author: "Fyodor Dostoevsky", isbn: "9780241252086" }
  ] },
  { title: "Book Club Selection", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Horror", color: "#ef4444", goal: 2, booksRead: [], potentialBooks: [
    { title: "Mexican Gothic", author: "Silvia Moreno-Garcia", isbn: "9780525620808" },
    { title: "Frankenstein", author: "Mary Shelley", isbn: "9780553212471" },
    { title: "The Haar", author: "David Sodergren", isbn: "9798800159837" }
  ], effect: "/effects/horror.gif" },
  { title: "Annotate", color: "#fef3c7", goal: 2, booksRead: [], potentialBooks: [] },
  { title: "Short Story Collections", color: "#93c5fd", goal: 3, booksRead: [], potentialBooks: [
    { title: "Tenth of December", author: "George Saunders", isbn: "9780812984255" },
    { title: "Orbital", author: "Samantha Harvey", isbn: "9780802161543" },
    { title: "The Martian Chronicles", author: "Ray Bradbury", isbn: "9781451678192" }
  ] },
  { title: "Published 2026", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [
    { title: "Vigil", author: "George Saunders", isbn: "9780525509622" }
  ] },
  { title: "Romantasy", color: "#bbf7d0", goal: 1, booksRead: [], potentialBooks: [
    { title: "A Court of Mist and Fury", author: "Sarah J. Maas", isbn: "9781635575583" }
  ] },
  { title: "Reread", color: "#e5e5e5", goal: 1, booksRead: [], potentialBooks: [
    { title: "A Swim in a Pond in the Rain", author: "George Saunders", isbn: "9781984856036" },
    { title: "Foundation", author: "Isaac Asimov", isbn: "9780553293357" },
    { title: "Annihilation", author: "Jeff VanderMeer", isbn: "9780374104092" }
  ] },
  { title: "Read 26 in 26", color: "#ef4444", goal: 26, booksRead: [
    { title: "By Night in Chile", author: "Roberto Bolaño", isbn: "9780811215473" }
  ], potentialBooks: [] },
  { title: "Selected at Random", color: "#3b82f6", goal: 1, booksRead: [], potentialBooks: [] },
  { title: "Longer than 700 Pages", color: "#f9a8d4", goal: 3, booksRead: [], potentialBooks: [
    { title: "The Count of Monte Cristo", author: "Alexandre Dumas", isbn: "9780140449266" },
    { title: "Lonesome Dove", author: "Larry McMurtry", isbn: "9781439195260" },
    { title: "The Stand", author: "Stephen King", isbn: "9780307743688" }
  ] },
  { title: "Features a Physical Journey", color: "#6ee7b7", goal: 1, booksRead: [], potentialBooks: [
    { title: "The Road", author: "Cormac McCarthy", isbn: "9780307387899" },
    { title: "The Grapes of Wrath", author: "John Steinbeck", isbn: "9780143039433" },
    { title: "2666", author: "Roberto Bolaño", isbn: "9780312429218" }
  ] },
  { title: "Shorter than 200 Pages", color: "#d2b48c", goal: 4, booksRead: [
    { title: "By Night in Chile", author: "Roberto Bolaño", isbn: "9780811215473" }
  ], potentialBooks: [
    { title: "Of Mice and Men", author: "John Steinbeck", isbn: "9780140177398" },
    { title: "Sula", author: "Toni Morrison", isbn: "9781400033430" },
    { title: "Notes from Underground", author: "Fyodor Dostoevsky", isbn: "9780679734529" }
  ] },
  { title: "Written by Female Authors", color: "#e5e5e5", goal: 10, booksRead: [], potentialBooks: [
    { title: "Katabasis", author: "R.F. Kuang", isbn: "9780063446243" },
    { title: "Orbital", author: "Samantha Harvey", isbn: "9780802161543" },
    { title: "Gilead", author: "Marilynne Robinson", isbn: "9780312424404" }
  ] },
  { title: "By Same Author", color: "#f97316", goal: 3, booksRead: [], potentialBooks: [] },
  { title: "Philosophy", color: "#facc15", goal: 1, booksRead: [], potentialBooks: [
    { title: "Fear and Trembling", author: "Søren Kierkegaard", isbn: "9780140444491" },
    { title: "The Republic", author: "Plato", isbn: "9780140455113" },
    { title: "The Myth of Sisyphus", author: "Albert Camus", isbn: "9780525564454" }
  ] },
  { title: "Book on Writing Craft", color: "#c4b5fd", goal: 1, booksRead: [], potentialBooks: [
    { title: "The Art of Fiction", author: "John Gardner", isbn: "9780679734031" },
    { title: "Bird by Bird", author: "Anne Lamott", isbn: "9780385480017" },
    { title: "The Elements of Style", author: "William Strunk Jr.", isbn: "9780205309023" }
  ] },
  { title: "Lonesome Dove!", color: "#ea580c", goal: 1, booksRead: [], potentialBooks: [
    { title: "Lonesome Dove", author: "Larry McMurtry", isbn: "9781439195260" }
  ] },
  { title: "Controversial", color: "#ef4444", goal: 1, booksRead: [], potentialBooks: [
    { title: "Lolita", author: "Vladimir Nabokov", isbn: "9780679723165" },
    { title: "Johnny Got His Gun", author: "Dalton Trumbo", isbn: "9780553274325" }
  ] },
  { title: "Nonfiction", color: "#1d4ed8", goal: 3, booksRead: [], potentialBooks: [
    { title: "The Serviceberry", author: "Robin Wall Kimmerer", isbn: "9781668072240" },
    { title: "One Day, Everyone Will Have Always Been Against This", author: "Omar El Akkad", isbn: "9781524712815" },
    { title: "Is a River Alive?", author: "Robert Macfarlane", isbn: "9780393242133" },
    { title: "A Supposedly Fun Thing I'll Never Do Again", author: "David Foster Wallace", isbn: "9780316925280" }
  ] },
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
      {/* Floating currently reading book */}
      <div className="floating-book-container">
        <div className="floating-book-drift">
          <div className="floating-book-tumble">
            <img
              src={`https://covers.openlibrary.org/b/isbn/${currentlyReading.isbn}-M.jpg`}
              alt={currentlyReading.title}
              className="floating-book-cover"
            />
            <div className="floating-book-label">
              <span className="floating-book-status">currently reading</span>
              <span className="floating-book-title">{currentlyReading.title}</span>
              <span className="floating-book-author">{currentlyReading.author}</span>
            </div>
          </div>
        </div>
      </div>
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
