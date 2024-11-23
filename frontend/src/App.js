import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Row, Col, Image} from 'react-bootstrap'


import RegistrationForm from './auth/registration';
import LoginForm from "./auth/login";
import HomePage from './pages/home';
import Header from "./components/Header";
import Footter from "./components/Footter";
import SideComponent from "./components/SideComponent";


function App() {
  return (
    <>
      <Header />
      <main>
        {/* <Container style={{ maxWidth: "100%" }}>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/registration" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </Container> */}

        <Container fluid className="vh-100  d-flex flex-column">
          <Row className="flex-grow-1 align-items-center">
            
            {/* Left block */}
            <Col xs={2} className="bg-secondary text-center p-3">
              <SideComponent/>
            </Col>

            {/* Center block */}
            <Col className="text-center p-3">
              <Routes>
                <Route path="/" element={<HomePage />} exact />
                <Route path="/registration" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
              </Routes>

            </Col>

            {/* Right block */}
            <Col xs={2} className="bg-secondary text-center p-3">
              <SideComponent/>
            </Col>
          </Row>

        </Container>
      </main>
      <Footter />
    </>
  );
}

export default App;
