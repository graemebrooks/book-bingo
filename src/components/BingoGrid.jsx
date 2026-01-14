import BingoTile from './BingoTile';
import './BingoGrid.css';

// Default prompts - you can customize these
const defaultPrompts = [
  "Fantasy",
  "Mystery",
  "Sci-Fi",
  "Romance",
  "Historical",
  "Memoir",
  "Poetry",
  "Graphic Novel",
  "Award Winner",
  "Debut Author",
  "Over 500 pages",
  "Under 200 pages",
  "FREE SPACE",
  "Translated",
  "Non-Fiction",
  "Classic",
  "Horror",
  "YA Novel",
  "Reread",
  "Audiobook",
  "Book Club Pick",
  "Set in Asia",
  "LGBTQ+",
  "Published 2025",
  "Rec from Friend"
];

function BingoGrid({ prompts = defaultPrompts }) {
  return (
    <div className="bingo-container">
      <h1 className="bingo-title">2025 Book Bingo</h1>
      <div className="bingo-grid">
        {prompts.map((prompt, index) => (
          <BingoTile key={index} label={prompt} index={index} />
        ))}
      </div>
    </div>
  );
}

export default BingoGrid;
