import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap'
import RegistrationForm from './auth/registration';
import LoginForm from "./auth/login";
import HomePage from './pages/home';
import Header from "./components/Header";
import Footter from "./components/Footter";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
        // <Route path="/register" element={<RegistrationForm />} />
    //   </Routes>
    // </Router>
    <>
      <Header />
      <main>
        <Container style={{ maxWidth: "80%" }}>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/registration" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </Container>
      </main>
      <Footter />
    </>
  );
}

export default App;
