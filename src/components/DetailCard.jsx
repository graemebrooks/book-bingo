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

function BookItem({ book, type }) {
  // Handle both string format and object format
  const title = typeof book === 'string' ? book : book.title;
  const isbn = typeof book === 'object' ? book.isbn : null;
  const coverUrl = getCoverUrl(isbn);

  return (
    <li className={`book-item ${type}`}>
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="book-cover" />
      ) : (
        <div className="book-cover-placeholder" />
      )}
      <span className="book-title">{title}</span>
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
