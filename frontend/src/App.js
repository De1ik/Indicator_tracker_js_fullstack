import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Row, Col, Image} from 'react-bootstrap'

import ProtectedRoute from "./auth/protectedRoute";

import RegistrationForm from './auth/registration';
import LoginForm from "./auth/login";
import HomePage from './pages/home';
import Header from "./components/Header";
import Footter from "./components/Footter";
import SideComponent from "./components/SideComponent";
import Profile from "./pages/profile";
import AdminProtect from "./auth/adminProtect";
import Admin from "./pages/admin";


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
                <Route path="/profile"           element={
                                              <ProtectedRoute>
                                                <Profile />
                                              </ProtectedRoute>
                                            } />
                <Route path="/admin"           element={
                                              <AdminProtect>
                                                <Admin />
                                              </AdminProtect>
                                            } />
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
