import { Link } from "react-router-dom";
import { Container, Row, Col, Image  } from "react-bootstrap";
import { useEffect, useState } from "react";

const SideComponent = () => {

  const [adds, setAdds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchAdds = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/get-adds', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const adds = responseData.data;
        setAdds(adds)
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error exporting adds:", error);
    }
  };


  const handleImageClick = async (id) => {

    try {
      const formData = {
          id: id
      }

      const response = await fetch("http://localhost:8080/api/admin/update-clicks", {
          method: "PUT",
          headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });

      const data = await response.json();
      // console.log("Update successful:", data);

  } catch (err) {
      console.error("Error:", err);
      // alert("An error occurred update click.");
  }

      
    const targetLink = adds[currentIndex]?.target_link || '#';
    window.open(targetLink, '_blank', 'noopener noreferrer');
  };

  useEffect(() => {
    fetchAdds();
  }, []);


  useEffect(() => {
    if (adds.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % adds.length);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [adds]);




  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "rgba(44, 62, 80, 0.8)"}}>
      {adds.length > 0 && (
        <div
          className="clickable-image"
          onClick={() => handleImageClick(adds[currentIndex]?.id)}
          style={{ cursor: 'pointer' }}
        >
          <Image
            src={adds[currentIndex]?.image_link || 'https://via.placeholder.com/250'}
            alt="Advertisement"
            rounded
            fluid
          />
        </div>
      )}
    </Container>
  );
};

export default SideComponent;