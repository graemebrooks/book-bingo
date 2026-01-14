import BingoGrid from './components/BingoGrid'
import './App.css'

import bingoImage from './assets/bingo.png'

function App() {
  return (
    <div className="app">
      <BingoGrid imageSrc={bingoImage} />
    </div>
  )
}

export default App
