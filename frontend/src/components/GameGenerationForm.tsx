import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { generateGame } from '../store/slices/gamesSlice'
import {
    Button,
    TextField,
    Box,
    CircularProgress,
    Alert,
    Paper,
    Typography
} from '@mui/material'

const GameGenerationForm = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { loading, error } = useSelector((state: RootState) => state.games)

    const [formData, setFormData] = useState({
        title: '',
        description: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim()) return

        try {
            await dispatch(generateGame({
                title: formData.title,
                description: formData.description
            })).unwrap()

            // Clear form after successful generation
            setFormData({ title: '', description: '' })
        } catch (err) {
            // Error handling is managed by Redux
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Generate New Game
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Game Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        fullWidth
                    />

                    <TextField
                        label="Game Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        disabled={loading}
                        fullWidth
                        helperText="Describe the game you want to create"
                    />

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !formData.title.trim()}
                        sx={{ mt: 2 }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                Generating...
                            </>
                        ) : (
                            'Generate Game'
                        )}
                    </Button>
                </Box>
            </form>
        </Paper>
    )
}

export default GameGenerationForm 