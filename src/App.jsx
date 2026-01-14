import BingoCard from './components/BingoCard'
import './App.css'

// Replace with your actual image path
import bingoImage from './assets/bingo.png'

function App() {
  return (
    <div className="app">
      <BingoCard imageSrc={bingoImage} />
    </div>
  )
}

export default App
