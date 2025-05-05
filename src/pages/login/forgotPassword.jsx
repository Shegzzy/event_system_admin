import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email) {
            setStatus({ loading: false, error: 'Please enter your email', success: '' });
            return;
        }

        setStatus({ loading: true, error: '', success: '' });

        try {
            await sendPasswordResetEmail(auth, email);
            setStatus({
                loading: false,
                error: '',
                success: 'Password reset email sent. Please check your inbox.',
            });
        } catch (error) {
            setStatus({
                loading: false,
                error: error.message,
                success: '',
            });
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Typography variant="h5" gutterBottom>
                    Reset Password
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Enter your email address to receive a password reset link.
                </Typography>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    size='small'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {status.error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {status.error}
                    </Alert>
                )}
                {status.success && (
                    <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                        {status.success}
                    </Alert>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleSubmit}
                    disabled={status.loading}
                >
                    {status.loading ? <CircularProgress size={24} /> : 'Send Reset Email'}
                </Button>

                <Button
                    fullWidth
                    sx={{
                        mt: 1, '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
                    }}
                    onClick={() => navigate('/login')}
                    disabled={status.loading}
                >
                    Back to Login
                </Button>
            </Box>
        </Container>
    );
}
