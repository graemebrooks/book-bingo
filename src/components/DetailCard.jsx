import './DetailCard.css';

function DetailCard({ data, onClose }) {
  const { title, goal, booksRead, potentialBooks } = data;

  // ASCII progress bar
  const barLength = 20;
  const filled = Math.round((booksRead.length / goal) * barLength);
  const empty = barLength - filled;
  const progressBar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <div className="detail-card">
      <button className="detail-close" onClick={onClose}>[x]</button>

      <h2 className="detail-title">{title}</h2>

      <div className="detail-section">
        <div className="progress-header">
          <span>progress</span>
          <span>{booksRead.length}/{goal}</span>
        </div>
        <div className="progress-bar">
          [{progressBar}]
        </div>
      </div>

      <div className="detail-section">
        <h3>books read</h3>
        {booksRead.length > 0 ? (
          <ul className="book-list">
            {booksRead.map((book, i) => (
              <li key={i} className="book-item read">{book}</li>
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
              <li key={i} className="book-item potential">{book}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">no books added</p>
        )}
      </div>
    </div>
  );
}

export default DetailCard;
