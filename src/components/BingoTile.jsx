import './BingoTile.css';
import doneSticker from '../assets/done_sticker.png';

function BingoTile({ row, col, index, imageSrc, isHovered, isSelected, isDone }) {
  const backgroundPositionX = `${col * 25}%`;
  const backgroundPositionY = `${row * 25}%`;

  return (
    <div
      className={`bingo-tile ${isHovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: `${backgroundPositionX} ${backgroundPositionY}`,
      }}
    >
      {isDone && (
        <div className="sticker">
          <img src={doneSticker} alt="Done" className="sticker-image" />
        </div>
      )}
    </div>
  );
}

export default BingoTile;
