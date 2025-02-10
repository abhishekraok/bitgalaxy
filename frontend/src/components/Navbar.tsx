import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const Navbar = () => {
    const { availableGames } = useSelector((state: RootState) => state.games)
    const firstGame = availableGames[0]

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            {firstGame && (
                <Link to={`/game/generated/${firstGame.id}`}>
                    Play Demo Game
                </Link>
            )}
        </nav>
    )
}

export default Navbar 