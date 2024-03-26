import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChakraProvider } from '@chakra-ui/react';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <Suspense  fallback={<h1>loading</h1>}>

        <App />
        </Suspense>
        <ToastContainer autoClose={300} pauseOnHover={true} position="top-center" />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
