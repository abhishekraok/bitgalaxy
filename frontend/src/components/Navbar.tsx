import { Link } from 'react-router-dom'
import { staticGames } from '../games/static/registry'

const Navbar = () => {
    const firstGame = staticGames[0]

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            {firstGame && (
                <Link to={`/game/static/${firstGame.id}`}>
                    Play Demo Game
                </Link>
            )}
        </nav>
    )
}

export default Navbar 