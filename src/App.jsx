import BingoGrid from './components/BingoGrid'
import './App.css'

import bingoImage from './assets/bingo.png'

function App() {
  return (
    <div className="app">
      <div className="grid-floor" />
      <div className="particles" />
      <BingoGrid imageSrc={bingoImage} />
    </div>
  )
}

export default App
