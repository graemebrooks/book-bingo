import { useState } from 'react';
import { createPortal } from 'react-dom';
import './DetailCard.css';

// Generate Open Library cover URL from ISBN
function getCoverUrl(isbn) {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

// Create a dark background tint from a hex color
function getDarkBackground(hex) {
  if (!hex) return '#1a1010';
  // Parse hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Darken significantly (10% of original + dark base)
  const darkR = Math.floor(r * 0.1 + 10);
  const darkG = Math.floor(g * 0.1 + 5);
  const darkB = Math.floor(b * 0.1 + 5);
  return `rgb(${darkR}, ${darkG}, ${darkB})`;
}

function BookCover({ isbn, title, author }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMagnified, setIsMagnified] = useState(false);
  const [largeLoading, setLargeLoading] = useState(true);
  const [preloaded, setPreloaded] = useState(false);
  const coverUrl = getCoverUrl(isbn);
  const largeCoverUrl = coverUrl?.replace('-M.jpg', '-L.jpg');

  // Check if image loaded is the "no cover" placeholder (1x1 pixel)
  const handleLoad = (e) => {
    // Open Library returns a tiny image when no cover exists
    if (e.target.naturalWidth <= 1 || e.target.naturalHeight <= 1) {
      setHasError(true);
    }
    setIsLoading(false);
  };

  // Preload large image on hover
  const handleMouseEnter = () => {
    if (!preloaded && largeCoverUrl) {
      const img = new Image();
      img.src = largeCoverUrl;
      img.onload = () => setPreloaded(true);
    }
  };

  const handleMagnify = () => {
    setLargeLoading(!preloaded);
    setIsMagnified(true);
  };

  if (!coverUrl || hasError) {
    return (
      <div className="book-cover-fallback">
        <span className="fallback-title">{title}</span>
        {author && <span className="fallback-author">{author}</span>}
      </div>
    );
  }

  return (
    <>
      <div className="book-cover-wrapper" onClick={handleMagnify} onMouseEnter={handleMouseEnter}>
        {isLoading && <div className="book-cover-skeleton" />}
        <img
          src={coverUrl}
          alt={title}
          className={`book-cover ${isLoading ? 'loading' : ''}`}
          onLoad={handleLoad}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
        {!isLoading && (
          <div className="magnify-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        )}
      </div>
      {isMagnified && createPortal(
        <div className="magnify-overlay" onClick={() => setIsMagnified(false)}>
          {largeLoading && <div className="magnified-skeleton" />}
          <img
            src={largeCoverUrl}
            alt={title}
            className={`magnified-cover ${largeLoading ? 'loading' : ''}`}
            onLoad={() => setLargeLoading(false)}
          />
          <span className="magnify-hint">click anywhere to close</span>
        </div>,
        document.body
      )}
    </>
  );
}

function BookItem({ book, type }) {
  // Handle both string format and object format
  const title = typeof book === 'string' ? book : book.title;
  const author = typeof book === 'object' ? book.author : null;
  const isbn = typeof book === 'object' ? book.isbn : null;

  return (
    <li className={`book-item ${type}`}>
      <BookCover isbn={isbn} title={title} author={author} />
      <div className="book-info">
        <span className="book-title">{title}</span>
        {author && <span className="book-author">{author}</span>}
      </div>
    </li>
  );
}

function DetailCard({ data, onClose }) {
  const { title, color, goal, booksRead, potentialBooks } = data;

  // ASCII progress bar with separate spans for styling
  const barLength = 20;
  const filled = Math.round((booksRead.length / goal) * barLength);
  const empty = barLength - filled;

  // Use tile color as accent, with CSS custom property
  const cardStyle = {
    '--accent-color': color || '#dd3333',
    '--accent-glow': `${color}66` || '#dd333366',
    '--accent-dim': `${color}33` || '#dd333333',
    '--accent-bg': getDarkBackground(color),
  };

  return (
    <div className="detail-card" style={cardStyle}>
      <button className="detail-close" onClick={onClose}>[x]</button>

      <div className="detail-card-content">
        <h2 className="detail-title">{title}</h2>

        <div className="detail-section">
          <div className="progress-header">
            <span>progress</span>
            <span>{booksRead.length}/{goal}</span>
          </div>
          <div className="progress-bar">
            <span className="bracket">[</span>
            <span className="filled">{'█'.repeat(filled)}</span>
            <span className="empty">{'░'.repeat(empty)}</span>
            <span className="bracket">]</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>books read</h3>
          {booksRead.length > 0 ? (
            <ul className="book-list">
              {booksRead.map((book, i) => (
                <BookItem key={i} book={book} type="read" />
              ))}
            </ul>
          ) : (
            <p className="empty-state">no books read yet</p>
          )}
        </div>

        <div className="detail-section">
          <h3>potential</h3>
          {potentialBooks.length > 0 ? (
            <ul className="book-list">
              {potentialBooks.map((book, i) => (
                <BookItem key={i} book={book} type="potential" />
              ))}
            </ul>
          ) : (
            <p className="empty-state">no books added</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailCard;
