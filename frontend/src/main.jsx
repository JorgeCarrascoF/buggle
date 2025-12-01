import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import * as Sentry from "@sentry/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

const queryClient = new QueryClient();

Sentry.init({
  dsn: "https://c8f07b4b38b745219e04a09995e7f343@backend-llwm.onrender.com/42",
  sendDefaultPii: true,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || "development",
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ["error", "warn", "info"],
    }),
  ],
  // beforeSend(event, hint) {
  //   console.log("Evento que se va a enviar a Sentry:");
  //   console.log("Event JSON:", JSON.stringify(event, null, 2));
  //   console.log("Información adicional (hint):");
  //   console.log("Hint JSON:", JSON.stringify(hint, null, 2));
  //   return event;
  // },
});



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
