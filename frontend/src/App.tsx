import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { HomePage } from "./pages/HomePage";
import { SessionPage } from "./pages/SessionPage";

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session/:sessionId" element={<SessionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  );
}

export default App;
