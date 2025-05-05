import * as React from 'react';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    TextField,
    InputAdornment,
    Link,
    IconButton,
    Typography,
    Alert,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../NNCL.png';
import { useState } from 'react';
import { useContext } from 'react';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomEmailField() {
    return (
        <TextField
            label="Email"
            name="email"
            type="email"
            size="small"
            required
            fullWidth
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <AccountCircle fontSize="inherit" />
                    </InputAdornment>
                ),
            }}
            variant="outlined"
        />
    );
}

function CustomPasswordField() {
    const [showPassword, setShowPassword] = useState(false);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
            <InputLabel size="small" htmlFor="outlined-adornment-password">
                Password
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                size="small"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="small"
                        >
                            {showPassword ? (
                                <VisibilityOff fontSize="inherit" />
                            ) : (
                                <Visibility fontSize="inherit" />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
}


function ForgotPasswordLink() {
    return (
        <Link href='/reset-password' variant="body2">
            Forgot password?
        </Link>
    );
}

function Title() {
    return <h2 style={{ marginBottom: 8 }}>Admin Login</h2>;
}

function Subtitle({ status }) {
    return (
        <Typography sx={{ mb: 2, px: 1, py: 0.25 }} variant='body2' color="text.secondary">
            Enter your email and password below.
            {
                status.error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {status.error}
                    </Alert>
                )
            }
        </Typography>

    );
}

const BRANDING = {
    logo: (
        <img
            src={logo}
            alt="NNCL logo"
            style={{ height: 40 }}
        />
    ),
    title: 'Admin Sign In',
};

export default function LoginPage() {
    const theme = useTheme();
    const { dispatch } = useContext(AuthContext);
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });
    const navigate = useNavigate();

    const handleLogin = async ({ formData }) => {

        try {
            let email = formData.get('email');
            let password = formData.get('password');

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const adminRef = doc(db, "admins", user.uid);
            const adminSnap = await getDoc(adminRef);

            if (!adminSnap.exists()) {
                setStatus({ loading: false, error: 'Unauthorized: You do not have admin access', success: '' });
                throw new Error("Unauthorized: You do not have admin access");
            }

            dispatch({ type: "LOGIN", payload: userCredential.user });
            navigate("/");
        } catch (error) {
            console.error("Login error:", error.message);
            setStatus({ loading: false, error: 'Incorrect email or password', success: '' });
        }
    };


    return (
        <AppProvider branding={BRANDING} theme={theme}>
            <SignInPage
                signIn={(provider, formData) => handleLogin({ formData })}
                slots={{
                    title: Title,
                    subtitle: () => (Subtitle({ status })),
                    emailField: CustomEmailField,
                    passwordField: CustomPasswordField,
                    forgotPasswordLink: ForgotPasswordLink,
                }}
                providers={providers}
            />
        </AppProvider>
    );
}
