import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChakraProvider>
      <Suspense fallback={<h1>loading</h1>}>
        <Provider store={store}>
          <App />
        </Provider>
      </Suspense>
      <ToastContainer
        autoClose={300}
        pauseOnHover={true}
        position="top-center"
      />
    </ChakraProvider>
  </BrowserRouter>
);
