import { Routes, Route } from 'react-router-dom'
import './App.css'
import { DiscoveryProvider } from './context/DiscoveryContext'
import { ThemeProvider } from './context/ThemeContext'
import { WatchlistProvider } from './context/WatchlistContext'
import Header from './assets/components/Header'
import MoviesHomePage from './pages/MoviesHomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import WatchlistPage from './pages/WatchlistPage'

export default function App() {
  return (
    <ThemeProvider>
      <DiscoveryProvider>
        <WatchlistProvider>
          <div className="app-layout">
            <Header />
            <Routes>
              <Route path="/" element={<MoviesHomePage />} />
              <Route path="/movie/:imdbId" element={<MovieDetailPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </WatchlistProvider>
      </DiscoveryProvider>
    </ThemeProvider>
  )
}
