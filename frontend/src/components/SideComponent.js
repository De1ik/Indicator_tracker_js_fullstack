import { Link } from "react-router-dom";
import { Container, Row, Col, Image  } from "react-bootstrap";

const SideComponent = () => {
  return (
    <>
        <h5>Side Block</h5>
        <p>Some content here.</p>
        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <Image 
                src="https://cdn.pixabay.com/photo/2022/10/09/12/07/plant-7508987_640.jpg" 
                alt="Example" 
                rounded 
                fluid
            />
        </a>
    </>
  );
};

export default SideComponent;