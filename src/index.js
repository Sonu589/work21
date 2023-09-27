// index.js or App.js
import"./index.css"
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // Import the Router component
import App from "./App"; // Assuming your App component is in a separate file

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
