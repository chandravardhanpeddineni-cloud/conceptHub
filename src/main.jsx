import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter,RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries:{
      staleTime:300000
    }
  }
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    {/* <StrictMode> */}
      <App/>
      <ReactQueryDevtools initialIsOpen={false} />
    {/* </StrictMode> */}
  </QueryClientProvider>
);
