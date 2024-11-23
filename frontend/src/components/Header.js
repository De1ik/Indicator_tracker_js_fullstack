import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
// import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

function Header() {

  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 768px)' });
  const userData = true
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  };

  const handleNavigateRegistration = () => {
    navigate("/registration");
  };


  return (

//     <header>
//       <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="py-4">
//         <Container>
//           <LinkContainer to={"/"}>
//             <Navbar.Brand>Scales Tools</Navbar.Brand>
//           </LinkContainer>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ml-auto mr-auto d-flex align-items-center w-100">
//                   <LinkContainer to={"/scales"}>
//                     <Nav.Link><i className='fas fa-shopping-cart'></i>Scale</Nav.Link>
//                   </LinkContainer>
// {/*                 
//                   {userData && userData.is_staff &&
//                   <NavDropdown
//                               id="nav-dropdown-dark-example"
//                               title="Admin"
//                               menuVariant="dark"
//                   >
//                       <LinkContainer to={"/admin/users"}>
//                           <NavDropdown.Item>User</NavDropdown.Item>
//                       </LinkContainer> 
//                       <LinkContainer to={"/admin/orders"}>
//                           <NavDropdown.Item>Orders</NavDropdown.Item>
//                       </LinkContainer> 
//                       <LinkContainer to={"/admin/products"}>
//                           <NavDropdown.Item>Products</NavDropdown.Item>
//                       </LinkContainer> 
//                   </NavDropdown>
               
//                   } */}
//                 {!userData ? 
//                   <LinkContainer to={"/login"}>
//                     <Nav.Link><i className='fas fa-user'></i>Login</Nav.Link>
//                   </LinkContainer>
//                 :   <>
//                       <LinkContainer to={"/profile"}>
//                         <Nav.Link><i className='fas fa-user'></i>Profile</Nav.Link>
//                       </LinkContainer>      
//                 </>}


//               </Nav>
//               </Navbar.Collapse>
//           </Container>
//       </Navbar>
//     </header>
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="py-4">
                    <Navbar.Brand onClick={handleNavigateHome} style={{ cursor: "pointer" }}>
                        Scales Tools
                    </Navbar.Brand>
                    <Navbar.Brand onClick={handleNavigateRegistration} style={{ cursor: "pointer" }}>
                        Registration
                    </Navbar.Brand>
            </Navbar>
        </header>
  )
}

export default Header