import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="home">
            <h1>Game AI Platform</h1>
            <div className="game-list">
                <h2>Available Games</h2>
                <Link to="/game/static/collect-stars">
                    Play Collect Stars
                </Link>
            </div>
        </div>
    )
}

export default Home 