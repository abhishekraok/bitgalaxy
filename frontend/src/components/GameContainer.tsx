import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Phaser from 'phaser'
import { staticGames } from '../games/static/registry'

const GameContainer = () => {
    const gameRef = useRef<Phaser.Game | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { gameType, gameId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const initAttemptRef = useRef(false)

    // First, let's add a mount effect to verify the container
    useEffect(() => {
        console.log('Container mount check:', {
            containerRef: containerRef.current,
            containerExists: !!containerRef.current,
            dimensions: containerRef.current ? {
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            } : null
        })
    }, []) // Empty dependency array to run only on mount

    // Separate effect for game initialization
    useEffect(() => {
        console.log('Game initialization effect triggered with:', {
            gameType,
            gameId,
            containerExists: !!containerRef.current
        })

        let isMounted = true

        async function initGame() {
            if (initAttemptRef.current) {
                console.log('Initialization already attempted, waiting for cleanup...')
                return
            }
            initAttemptRef.current = true

            // Verify container immediately
            if (!containerRef.current) {
                console.error('Container ref not available immediately')
                if (isMounted) {
                    setError('Failed to initialize game container')
                    setLoading(false)
                }
                return
            }

            console.log('Container verified:', {
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
                children: containerRef.current.children.length
            })

            if (!document.createElement('canvas').getContext('webgl')) {
                console.error('WebGL is not supported in this browser')
                if (isMounted) {
                    setError('Your browser does not support WebGL')
                    setLoading(false)
                }
                return
            }

            if (gameType === 'static') {
                const gameInfo = staticGames.find(g => g.id === gameId)
                if (!gameInfo) {
                    if (isMounted) {
                        setError('Game not found')
                        setLoading(false)
                    }
                    return
                }

                try {
                    // Clear any existing game
                    if (gameRef.current) {
                        console.log('Destroying existing game instance...')
                        gameRef.current.destroy(true)
                        gameRef.current = null
                        await new Promise(resolve => setTimeout(resolve, 100))
                    }

                    // Clear container
                    console.log('Preparing container...')
                    containerRef.current.innerHTML = ''

                    // Wait for DOM updates
                    await new Promise(resolve => requestAnimationFrame(resolve))

                    if (!isMounted || !containerRef.current) {
                        console.log('Component unmounted during initialization')
                        return
                    }

                    const configImport = await gameInfo.getConfig()
                    const gameConfig = configImport.default || configImport

                    console.log('Creating new game instance...', {
                        containerEmpty: containerRef.current.children.length === 0,
                        containerDimensions: {
                            width: containerRef.current.offsetWidth,
                            height: containerRef.current.offsetHeight
                        }
                    })

                    gameRef.current = new Phaser.Game({
                        ...gameConfig,
                        scale: {
                            mode: Phaser.Scale.FIT,
                            autoCenter: Phaser.Scale.CENTER_BOTH,
                            width: gameConfig.width || 800,
                            height: gameConfig.height || 600,
                            parent: containerRef.current
                        },
                        parent: containerRef.current,
                        transparent: false,
                        backgroundColor: '#4488aa'
                    })

                    console.log('Game instance created successfully')

                    if (isMounted) {
                        setLoading(false)
                    }
                } catch (err) {
                    console.error('Failed to load game:', err)
                    if (isMounted) {
                        setError('Failed to load game')
                        setLoading(false)
                    }
                }
            } else if (gameType === 'generated') {
                if (isMounted) {
                    setError('Generated games are not supported yet.')
                    setLoading(false)
                }
                return
            } else {
                setError('Unsupported game type')
                setLoading(false)
                return
            }
        }

        initGame().catch(error => {
            console.error('Unhandled error during game initialization:', error)
            if (isMounted) {
                setError('Unexpected error occurred')
                setLoading(false)
            }
        })

        return () => {
            console.log('Cleanup triggered', {
                hasGame: !!gameRef.current,
                hasContainer: !!containerRef.current
            })
            isMounted = false

            if (gameRef.current) {
                console.log('Destroying game in cleanup')
                try {
                    gameRef.current.destroy(true, false)
                    gameRef.current = null
                } catch (error) {
                    console.error('Error during game cleanup:', error)
                }
            }

            if (containerRef.current) {
                console.log('Clearing container in cleanup')
                try {
                    containerRef.current.innerHTML = ''
                } catch (error) {
                    console.error('Error during container cleanup:', error)
                }
            }

            initAttemptRef.current = false
        }
    }, [gameType, gameId, navigate])

    // Render the container first, before any game initialization
    return (
        <div className="game-wrapper">
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                }}>
                    Loading game...
                </div>
            )}
            {error && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                }}>
                    Error: {error}
                </div>
            )}
            <div
                id="game-container"
                ref={containerRef}
                style={{
                    backgroundColor: '#000',
                    width: '800px',
                    height: '600px',
                    position: 'relative',
                    border: '2px solid red',
                    opacity: loading || error ? 0 : 1,
                    visibility: loading || error ? 'hidden' : 'visible'
                }}
            />
        </div>
    )
}

export default GameContainer 