import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//CSS
//import "semantic-ui-css";
import "./App.css";
import { Container } from "semantic-ui-react";

//component
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";

function App() {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
