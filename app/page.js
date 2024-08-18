'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Container, Typography, AppBar, Toolbar, Button, Box, Grid } from "@mui/material";
import Head from 'next/head';
import { useRouter } from 'next/navigation'; 

export default function Home() {
  const router = useRouter();  

  const handleSubmit = async (plan) => {
    const checkoutSession = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            origin: 'http://localhost:3000',
        },
        body: JSON.stringify({ plan }),
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
        console.error(checkoutSession.message);
        return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
    });

    if (error) {
        console.warn(error.message);
    }
};

  const handleGetStarted = () => {
    router.push('/generate');  
  };

  return (
    <Container maxWidth="100vw" sx={{ px: 3, py: 4 }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar 
        position="fixed" 
        sx={{ 
          top: 0, 
          left: 0, 
          width: '100%', 
          backgroundColor: '#115fad',
          boxShadow: 'none', 
          zIndex: 1100,
          padding: 0,
          margin: 0
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in" sx={{ mx: 1 }}>Login</Button>
            <Button color="inherit" href="sign-up" sx={{ mx: 1 }}>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: 'center',
          my: 10,
          color: '#115fad',
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
          The easiest way to make flashcards from your text
        </Typography>
        <Button variant="contained" color="primary" sx={{ py: 1, px: 4, borderRadius: 2 }} onClick={handleGetStarted}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" sx={{ color: '#115fad', textAlign: 'center', mb: 4 }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#0088ca', fontWeight: 'medium', mb: 1 }}>
                Easy Text Input
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Simply input your text and let our software do the rest. Creating flashcards has never been easier.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#0088ca', fontWeight: 'medium', mb: 1 }}>
                Create Collections
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Organize your flashcards into collections for easier access and better study management.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#0088ca', fontWeight: 'medium', mb: 1 }}>
                Account Sync
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Sync your flashcards across all your devices. Study anytime, anywhere.
              </Typography>
            </Box>
          </Grid>
          
          
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{color: '#0088ca', marginBottom: '3vw'}}>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Typography variant='h5' gutterBottom>Basic</Typography>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>$1 / month</Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                Basic access to flashcard features and support.
              </Typography>
              <Button variant="contained" color="primary" sx={{ py: 1, px: 4, borderRadius: 2 }} onClick={() => handleSubmit('basic')}>
                Choose Basic
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <Typography variant='h5' gutterBottom>Pro</Typography>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>$5 / month</Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                Unlimited flashcards and storage, additional features, and priority support.
              </Typography>
              <Button variant="contained" color="primary" sx={{ py: 1, px: 4, borderRadius: 2 }} onClick={() => handleSubmit('pro')}>
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
