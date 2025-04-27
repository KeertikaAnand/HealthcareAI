import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set up AWS Amplify or AWS SDK configuration here if needed

createRoot(document.getElementById("root")!).render(<App />);
