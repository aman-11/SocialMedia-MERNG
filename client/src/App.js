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

//context API
import { AuthProvider } from "./context/auth";

//authentication of route
import AuthRoute from "./utils/AuthRoute"; //and use in place of the route
import ViewPost from "./pages/ViewPost";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthRoute Component={Login} />} />
            <Route
              path="/register"
              element={<AuthRoute Component={Register} />}
            />
            <Route path="/posts/:postId" element={<ViewPost />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
