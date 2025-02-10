import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '../store'
import { fetchGames } from '../store/slices/gamesSlice'
import GameGenerationForm from '../components/GameGenerationForm'
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Divider
} from '@mui/material'

const Home = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { availableGames } = useSelector((state: RootState) => state.games)

    useEffect(() => {
        dispatch(fetchGames())
    }, [dispatch])

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom textAlign="center">
                    Game AI Platform
                </Typography>

                <GameGenerationForm />

                <Box sx={{ mt: 6 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Available Games
                    </Typography>

                    <Grid container spacing={3}>
                        {availableGames.map(game => (
                            <Grid item xs={12} sm={6} md={4} key={game.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {game.title}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {game.description || 'Generated Game'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            component={Link}
                                            to={`/game/generated/${game.id}`}
                                            size="small"
                                        >
                                            Play Now
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default Home 