import { Link, NavLink } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-gray-900">
            ParkHub
          </Link>
          <div className="flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Шукаю паркомісце
            </NavLink>
            <NavLink
              to="/owners"
              className={({ isActive }) =>
                `transition-colors ${isActive ? 'text-emerald-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`
              }
            >
              Здати паркомісце
            </NavLink>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
