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
import AdminData from "./pages/admin/AdminData";
import AdminAdds from "./pages/admin/AdminAdds";
import AdminUsers from "./pages/admin/AdminUsers";
import Methods from "./pages/Methods";
import Measure from "./pages/Measure";


function App() {
  return (
    <>
      <Container fluid className="vh-100 d-flex flex-column p-0 m-0">
        <Header className="w-100" />
        <main className="flex-grow-1 p-0 m-0">
          <Row className="h-100 m-0">
            {/* Left block */}
            <Col xs={2} className="text-center p-0 m-0">
              <SideComponent />
            </Col>

            {/* Center block */}
            <Col className="text-center p-0 m-0">
              <Routes>
                <Route path="/" element={<HomePage />} exact />
                <Route path="/registration" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/methods" element={<Methods />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/measurment"
                  element={
                    <ProtectedRoute>
                      <Measure />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/data"
                  element={
                    <AdminProtect>
                      <AdminData />
                    </AdminProtect>
                  }
                />
                <Route
                  path="/admin/adds"
                  element={
                    <AdminProtect>
                      <AdminAdds />
                    </AdminProtect>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminProtect>
                      <AdminUsers />
                    </AdminProtect>
                  }
                />
              </Routes>
            </Col>

            {/* Right block */}
            <Col xs={2} className=" text-center p-0 m-0">
              <SideComponent />
            </Col>
          </Row>
        </main>
        <footer className="bg-dark text-light w-100 m-0">
          <Footter />
        </footer>
      </Container>
    </>
  );
}

export default App;
