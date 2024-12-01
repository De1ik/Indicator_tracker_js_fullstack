import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footter() {
  return (
    <footer className="footer bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="text-center text-md-left mb-3 mb-md-0">
            <h5>About Us</h5>
            <p>
              Tool that help you to track your parameters
            </p>
          </Col>
          <Col md={4} className="text-center mb-3 mb-md-0">
            <h5>Follow Us</h5>
            <div className="social-icons d-flex justify-content-center align-items-center mt-4">
              <a href="https://facebook.com" className="text-white mx-3"><i className="fab fa-facebook-f fa-2x"></i></a>
              <a href="https://t.me/delik17" className="text-white mx-3"><i className="fab fa-telegram fa-2x"></i></a>
              <a href="https://instagram.com" className="text-white"><i className="fab fa-instagram fa-2x"></i></a>
            </div>
          </Col>
          <Col md={4} className="text-center text-md-right">
            <h5>Contact Us</h5>
            <p>Email: support@best_tool_.com</p>
            <p>Phone: +123 456 7890</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} DelikTool</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footter