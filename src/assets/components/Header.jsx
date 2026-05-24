import { Link } from 'react-router-dom'
import { useDiscovery } from '../../context/DiscoveryContext'
import HeaderSearch from './HeaderSearch'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const { resetToFeed } = useDiscovery()

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <div className="site-header__brand-block">
          <div className="site-header__inner">
            <h1 className="site-header__title">
              <Link
                className="site-header__homelink"
                to="/"
                onClick={() => resetToFeed()}
              >
                <span className="site-header__brand">Cinephile</span>
                <span className="site-header__sep">,</span>
                <span className="site-header__tagline">a movie discovery dashboard</span>
              </Link>
            </h1>
          </div>
        </div>

        <div className="site-header__actions">
          <ThemeToggle />
          <HeaderSearch />
        </div>
      </div>
    </header>
  )
}
