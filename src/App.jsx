import React from 'react';
import { Container, Title, Text, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import GitHubApiFetcher from './components/GitHubApiFetcher';
import AppFooter from './components/AppFooter';
import { Analytics } from "@vercel/analytics/react"
function App() {
  const handleFetchComplete = (data) => {
    console.log('Fetched Data:', data);
  };

  return (
    <MantineProvider forceColorScheme={'dark'} maw="100%">
      <Analytics/>
      <Title align="center" mt="xl">{"GitHub Repo -> LLM"}</Title>
      <Text align="center" mb="xl">Turn your GitHub Repository file structure into JSON to share easily with an LLM</Text>
      <GitHubApiFetcher onFetchComplete={handleFetchComplete} />
      <Container  pos={'fixed'} bottom={0}>
        <AppFooter />
      </Container>
  </MantineProvider>
  );
}

export default App;
