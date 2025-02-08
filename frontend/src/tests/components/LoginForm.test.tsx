import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../test-utils'
import LoginForm from '../../components/LoginForm'

describe('LoginForm', () => {
    it('renders login form', () => {
        renderWithProviders(<LoginForm />)

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('validates email format', async () => {
        renderWithProviders(<LoginForm />)

        const emailInput = screen.getByLabelText(/email/i)
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
        fireEvent.blur(emailInput)

        expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument()
    })
}) 