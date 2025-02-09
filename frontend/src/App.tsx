import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Navbar from './components/Navbar'
import GameContainer from './components/GameContainer'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:gameType/:gameId" element={<GameContainer />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App
