import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </Router>,
);
