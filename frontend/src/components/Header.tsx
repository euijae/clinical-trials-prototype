import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="top-5 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="px-2 text-lg py-1 rounded hover:bg-black/5 font-medium">
          Argon AI
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            className="px-2 text-lg py-1 rounded hover:bg-black/5 font-medium"
          >
            Home
          </NavLink>
          <NavLink
            to="/search"
            className="px-2 text-lg py-1 rounded hover:bg-black/5 font-medium"
          >
            Search
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
