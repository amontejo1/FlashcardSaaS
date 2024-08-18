'use client'

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import {SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import { Container, Typography, AppBar, Toolbar, Button, Box, Grid } from "@mui/material";
import Head from 'next/head'

export default function Home() {

  const handleSubmit = async ()=>{
    const checkoutSession = await fetch('/api/checkout_session',{
      method: 'POST',
      headers:{
        origin: 'http://localhost:3000' //Change later,
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const{error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error){
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth = "100vw">
      <head>
        <title>Flashcard SaaS</title>
        <meta name = "description" content = 'Create clashcard from your test'/>

      </head>

      <AppBar position = "static">
        <Toolbar>
          <Typography variant = "h6" style={{flexGrow: 1}}>
          Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in">Login</Button>
            <Button color="inherit" href="sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box 
        sx={{
          textAlign:'center', 
          my: 4,
          }}
        > 
        <Typography variant = "h2">Welcome to Flashcard SaaS</Typography>
        <Typography variant = "h5">
        {' '}
        The easiest way to make falshcards from your text
        </Typography>
        <Button variant="contained" color="primary" sx={{nt:2}}>
        Get Started
        </Button>
      </Box>
      <Box sx = {{my:6}}>
        <Typography variant = "h4" components="h2">
          Features
        </Typography>
        <Grid contained space ={4}>
          <Grid item xs={12} md={4}>
            <Typography variant = "h6">
              Easy Text Input
            </Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest. Creating 
              flashcards has never been easier.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs = {12} md = {6}>
              <Box 
                sx={{
                  p:3,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius:2,
                }}>
                <Typography variant='h5' gutterBottom>Basic</Typography>
                <Typography variant="h6" gutterBottom>$1 / month</Typography>
                <Typography>
                  {' '}
                  Basic access to flashcard features and support.
                </Typography>
                <Button variant ="contained" color="primary" sx={{nt:2}}>Choose Basic</Button>
              </Box>
            </Grid>

            <Grid item xs = {12} md = {6}>
              <Box 
                sx={{
                  p:3,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius:2,
                }}>
                <Typography variant='h5' gutterBottom>Pro</Typography>
                <Typography variant="h6" gutterBottom>$5 / month</Typography>
                <Typography>
                  {' '}
                  Unlimited flashcards and storage, additional features, and priority support.
                </Typography>
                <Button variant ="contained" color="primary" sx={{nt:2}} onClick={handleSubmit}>Choose Pro</Button>
              </Box>
            </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
