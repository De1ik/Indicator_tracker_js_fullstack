import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useState, useEffect } from "react";

const Methods = () => {
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


    const [methods, setMethods] = useState([]);

    const [methodName, setmethodName] = useState('')
    const [methodDesc, setmethodDesc] = useState('')
    const [isAddNew, setIsAddNew] = useState(false);


    const handleCreate = async () => {
        try {


            const formData = {
                name: methodName,
                description: methodDesc,
            }

            const response = await fetch("http://localhost:8080/api/create-method", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });


            const responseData = await response.json();

            
            if (response.status === 201) {
                setmethodDesc('')
                setmethodName('')
                setMessage("success", "New Method was Created")
                fetchMethods()
                setIsAddNew(false)
            } else {
                setMessage("error", `${responseData.message}`)
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("error", "An error occurred during method creating.");
    }
    };


    const handleDelete = async (id) => {
        try {

            const formData = {
                id: id
            }

            const response = await fetch("http://localhost:8080/api/delete-method", {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });


            const responseData = await response.json();

            
            if (response.status === 201) {
                setMessage("success", "Method was delete successfully")
                fetchMethods()
            } else {
                setMessage("error", `${responseData.message}`)
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("error", "An error occurred during deleting method.");
    }
    };

    const fetchMethods = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/get-methods', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const responseData = await response.json();

            const methods = responseData.data;
            setMethods(methods)
          } else {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            setMessage("error", `Failed to receive methods data: ${errorText}`);
          }
        } catch (error) {
          console.error("Error request methods:", error);
          setMessage("error", "An error occurred while methods data receiving.");
        }
      };


    useEffect(() => {
        fetchMethods();
      }, []);




  return (
    <Container className="mt-5">
      <h1 className="mb-4">Methods</h1>
      {messageSuccess && <Alert variant="success" className="mt-3">{messageSuccess}</Alert>}
      {messageError && <Alert variant="danger" className="mt-3">{messageError}</Alert>}

      <Row className="justify-content-center align-items-center my-4">
        <Col md="auto">
            <Form.Check
            type="checkbox"
            label="Add new method"
            checked={isAddNew}
            onChange={(e) => setIsAddNew(e.target.checked)}
            className="fw-bold"
            />
        </Col>
      </Row>

      {isAddNew ?   
        <Container className="d-flex flex-column justify-content-center align-items-center">
            <Card className="mb-4" style={{ minWidth: '50%'}}>
                <Card.Body>
                    <Row>

                    <Col>
                        <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                            required
                            type="text"
                            value={methodName}
                            onChange={(e) => setmethodName(e.target.value)}
                            placeholder="Enter name of the method"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                            required
                            as="textarea"
                            rows={4}
                            // type="text"
                            value={methodDesc}
                            onChange={(e) => setmethodDesc(e.target.value)}
                            placeholder="Enter method description"
                            />
                        </Form.Group>
                        <Button
                            onClick={() => handleCreate()}
                            className="w-100"
                        >
                            Add Method
                        </Button>
                        </Form>
                    </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
        :
        <Container className="d-flex flex-column justify-content-center align-items-center">
            {methods.length > 0 ?
            <table className='text-left styled-table' style={{ minWidth: '85%'}}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {methods.map((method) => (
                        <tr key={method.id} className='active-row'>
                            <td className='text-start'>{method.id}</td>
                            <td className='text-start'>{method.name}</td>
                            <td className='text-start'>{method.description}</td>
                            <td>
                                <Row>
                                    <Col><Button variant="danger" onClick={() => handleDelete(method.id)}>Delete</Button></Col>
                                </Row>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            :
            <p>No Methods..</p>
            }
        </Container>
      }
    </Container>
  );
};

export default Methods;
