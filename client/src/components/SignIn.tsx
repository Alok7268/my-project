import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nhost } from '../App';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../theme/AppTheme';
import ColorModeSelect from '../theme/ColorModeSelect';
// import { useAuth } from '@nhost/react';
import { NhostProvider } from '@nhost/react';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100dvh',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  // Sign In Function
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { session, error } = await nhost.auth.signIn({ email, password });

    if (error) {
      alert(`Error: ${error.message}`);
      if (error.message === "User is already signed in") {
        navigate('/main');
      }
    } else {
      alert('Sign-in successful!');
      navigate('/main'); // Redirect to the main page
    }

    console.log('JWT Token:', session?.accessToken);
  };

  // Sign Up Function
  // Inside handleSignUp function
  // Sign Up Function

  const handleSignUp = () => {
    navigate('/signup'); // ✅ Correct usage
  };



  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignInContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign In & Sign Up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSignIn}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Stack spacing={2}>
              <Button type="submit" fullWidth variant="contained">
                Sign in
              </Button>
              <br />
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSignUp}
              >
                New User? Sign up here.
              </Button>
            </Stack>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
