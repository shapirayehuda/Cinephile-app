import { Routes, Route } from 'react-router-dom'
import './App.css'
import { DiscoveryProvider } from './context/DiscoveryContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './assets/components/Header'
import MoviesHomePage from './pages/MoviesHomePage'
import MovieDetailPage from './pages/MovieDetailPage'

export default function App() {
  return (
    <ThemeProvider>
      <DiscoveryProvider>
        <div className="app-layout">
          <Header />
          <Routes>
            <Route path="/" element={<MoviesHomePage />} />
            <Route path="/movie/:imdbId" element={<MovieDetailPage />} />
          </Routes>
        </div>
      </DiscoveryProvider>
    </ThemeProvider>
  )
}
