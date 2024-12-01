import React, {useState, useEffect} from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
// import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { jwtDecode } from "jwt-decode";



function Header() {

  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("authToken"))
  const [role, setRole] = useState("")


  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role); // Устанавливаем роль
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [token, navigate]);



  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateRegistration = () => {
    navigate("/registration");
  };

  const handleNavigateMethods = () => {
    navigate("/methods");
  };

  const handleNavigateMeasure = () => {
    navigate("/measurment");
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const handleNavigateMeasureExport = () => {
    navigate("/user/measure-export");
  };

  const handleNavigateAdmin = (path) => {
    navigate(path);
  };


  return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="py-4">
                    <Navbar.Brand onClick={handleNavigateHome} style={{ cursor: "pointer" }} className='ms-4'>
                        Scales Tools
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                      <Navbar.Brand onClick={handleNavigateMethods} style={{ cursor: "pointer" }} className='me-4'>
                        Methods
                      </Navbar.Brand>
                      <Navbar.Brand onClick={handleNavigateMeasure} style={{ cursor: "pointer" }} className='me-4'>
                        Measure
                      </Navbar.Brand>
                      {token ? 
                        <>
                        <Navbar.Brand onClick={handleNavigateProfile} style={{ cursor: "pointer" }} className='me-4'>
                          Profile
                        </Navbar.Brand>
                        </>
                      :
                      <Navbar.Brand onClick={handleNavigateRegistration} style={{ cursor: "pointer" }} className='me-4'>
                        Registration
                      </Navbar.Brand>
                      }
                      {role === "admin" ?
                          // <Navbar.Brand onClick={handleNavigateAdmin} style={{ cursor: "pointer" }} className='me-4'>
                          //   Admin
                          // </Navbar.Brand>

                          // <NavDropdown title="More" id="admin-nav-dropdown">
                          //   <NavDropdown.Item onClick={() => handleNavigateAdmin('/admin/something')}>Something</NavDropdown.Item>
                          //   <NavDropdown.Divider />
                          //   <NavDropdown.Item onClick={() => handleNavigateAdmin('/admin/another-thing')}>Another Thing</NavDropdown.Item>
                          // </NavDropdown>
                          <NavDropdown
                            title="Admin Pannel"
                            id="basic-nav-dropdown"
                            align="end" // Выпадающее меню выравнивается вправо
                            menuVariant="dark" // Опционально: стиль для меню
                          >
                            <NavDropdown.Item onClick={() => handleNavigateAdmin('/admin/data')}>Import/Export Data</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleNavigateAdmin('/admin/users')}>Edit Users</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => handleNavigateAdmin('/admin/adds')}>Advertisement</NavDropdown.Item>
                          </NavDropdown>
                      :
                      <></>
                      }
                    </Nav>
            </Navbar>
        </header>
  )
}

export default Header