import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useState, useEffect } from "react";

const AdminAdds = () => {

    const [messageSuccess, setMessageSuccess] = useState("");
    const [messageError, setMessageError] = useState("");

    const setMessage = (type, message) => {
        setMessageError("");
        // setMessageWarning("");
        setMessageSuccess("");
    
        if (type === "error") setMessageError(message);
        // if (type === "warning") setMessageWarning(message);
        if (type === "success") setMessageSuccess(message);
      };


    const [adds, setAdds] = useState([]);

    const [imageTarget, setImageTarget] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [counter, setCounter] = useState(0)
    const [isAddNew, setIsAddNew] = useState(false);


    const handleCreate = async () => {
        try {


            const formData = {
                imageTarget: imageTarget,
                imageUrl: imageUrl,
                counter: counter
            }

            const response = await fetch("http://localhost:8080/api/admin/create-add", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });


            const responseData = await response.json();

            
            if (response.status === 201) {
                setImageTarget('')
                setImageUrl('')
                setCounter(0)
                // fetchAdds()
                setIsAddNew(false)
                window.location.reload();
                setMessage("success", "New Add was Created")
            } else {
                setMessage("error", `${responseData.message}`)
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("error", "An error occurred during adding new add.");
    }
    };


    const handleDelete = async (id) => {
        try {

            const formData = {
                id: id
            }

            const response = await fetch("http://localhost:8080/api/admin/delete-add", {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });


            const responseData = await response.json();

            
            if (response.status === 201) {
                window.location.reload();
                setMessage("success", "Add was delete successfully")
                // fetchAdds()
            } else {
                setMessage("error", `${responseData.message}`)
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("error", "An error occurred during deleting new add.");
    }
    };

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
            setMessage("error", `Failed to receive adds data: ${errorText}`);
          }
        } catch (error) {
          console.error("Error exporting adds:", error);
          setMessage("error", "An error occurred while adds data receiving.");
        }
      };


    useEffect(() => {
        fetchAdds();
      }, []);



  return (
    <Container className="mt-5">
      <h1 className="mb-4">Admin Adds</h1>
      {messageSuccess && <Alert variant="success" className="mt-3">{messageSuccess}</Alert>}
      {messageError && <Alert variant="danger" className="mt-3">{messageError}</Alert>}

      <Row className="justify-content-center align-items-center my-4">
        <Col md="auto">
            <Form.Check
            type="checkbox"
            label="Add new advertisement"
            checked={isAddNew}
            onChange={(e) => setIsAddNew(e.target.checked)}
            className="fw-bold"
            />
        </Col>
      </Row>

      {isAddNew ?   
        <Card className="mb-4">
            <Card.Body>
                <Row>

                <Col md={4} className="d-flex justify-content-center align-items-center">
                    <img
                        src={imageUrl || 'https://via.placeholder.com/250'}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '250px', maxWidth: '100%' }}
                    />
                </Col>

                <Col md={8}>
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                        required
                        type="text"
                        value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Target Link</Form.Label>
                        <Form.Control
                        required
                        type="text"
                        value={imageTarget}
                        onChange={(e) => setImageTarget(e.target.value)}
                        placeholder="Enter target URL"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Counter</Form.Label>
                        <Form.Control
                        required
                        type="number"
                        value={counter}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10) || 0;
                            setCounter(value < 0 ? 0 : value);
                        }}
                        />
                    </Form.Group>
                    <Button
                        onClick={() => handleCreate()}
                        className="w-100"
                    >
                        Add new one
                    </Button>
                    </Form>
                </Col>
                </Row>
            </Card.Body>
        </Card>

        :
        <>
        {adds.map((add, index) => (
            <Card className="mb-4" key={add.id}>
            <Card.Body>
                <Row>
                <Col md={4} className="d-flex justify-content-center align-items-center">
                    {add.image_link && (
                    <img
                        src={add.image_link}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '250px', maxWidth: '100%' }}
                    />
                    )}
                </Col>

                <Col md={8}>
                    <Form>
                    <Form.Group className="mb-3" controlId={`image_link_${add.id}`}>
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                        type="text"
                        value={add.image_link}
                        placeholder="Enter image URL"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId={`target_link_${add.id}`}>
                        <Form.Label>Target Link</Form.Label>
                        <Form.Control
                        type="text"
                        value={add.target_link}
                        placeholder="Enter target URL"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId={`counter_${add.id}`}>
                        <Form.Label>Counter</Form.Label>
                        <Form.Control
                        type="number"
                        value={add.counter}
                        placeholder="Enter counter"
                        />
                    </Form.Group>
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(add.id)}
                        className="w-100"
                    >
                        Delete
                    </Button>
                    </Form>
                </Col>
                </Row>
            </Card.Body>
            </Card>
        ))}
        </>
      }
    </Container>
  );
};

export default AdminAdds;
