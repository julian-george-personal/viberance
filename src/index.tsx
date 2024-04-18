import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MIDIProvider } from "@react-midi/hooks";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MIDIProvider>
      <App />
    </MIDIProvider>
  </React.StrictMode>
);
