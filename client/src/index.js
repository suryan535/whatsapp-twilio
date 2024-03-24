import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { Provider as SupabaseProvider } from 'react-supabase';
import supabase from './supabase';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    {/* <SupabaseProvider value={supabase}> */}
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    {/* </SupabaseProvider> */}
  </StrictMode>
);
