import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/game/static/collect-stars">Play Demo Game</Link>
        </nav>
    )
}

export default Navbar 