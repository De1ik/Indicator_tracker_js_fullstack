import { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const AdminUsers = () => {

  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageWarning, setMessageWarning] = useState("");

  const setMessage = (type, message) => {
      setMessageError("");
      setMessageWarning("");
      setMessageSuccess("");
  
      if (type === "error") setMessageError(message);
      if (type === "warning") setMessageWarning(message);
      if (type === "success") setMessageSuccess(message);
    };

  
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  const [isAddNew, setIsAddNew] = useState(false);    

  const defaultData = () => {
    setName("")
    setEmail("")
    setAge("")
    setHeight("")
    setPassword("")
    setConfirmPassword("")
  }


  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/get-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();

        const users = responseData.data;
        setUsers(users)
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword && confirmPassword !== "" && name !== "admin"){
        try {

            const formData = {
                name: name,
                email: email,
                password: password,
                age: age,
                height: height,
            }


            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (response.status === 201) {
                defaultData()
                setMessage("success", "User was created successfully")
                setIsAddNew(false)
                fetchUsers()
              } else {
                setMessage("error", `${responseData.message}`)
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("error", `An error occurred during registration: ${err}`)
        }
    }
  };


  const handleDelete = async (id) => {
    try {

        const formData = {
            id: id
        }

        const response = await fetch("http://localhost:8080/api/admin/delete-user", {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });


        const responseData = await response.json();

        
        if (response.status === 201) {
            setMessage("success", "User was delete successfully")
            fetchUsers()
        } else {
            setMessage("error", `${responseData.message}`)
        }
    } catch (err) {
        console.error("Error:", err);
        setMessage("error", "An error occurred during deleting new add.");
    }
  };


  useEffect(() => {
    if (password !== "" && confirmPassword !== "" && password !== confirmPassword){
        setMessageWarning("Passwords must be equal")
    }
    else{
        setMessageWarning("")
    }
  }, [password, confirmPassword])


  useEffect(() => {
      fetchUsers();
    }, []);


  return (
    <Container className="mt-5">
      <h1 className="mb-4">Edit Users</h1>
      {messageSuccess && <Alert variant="success" className="mt-3">{messageSuccess}</Alert>}
      {messageError && <Alert variant="danger" className="mt-3">{messageError}</Alert>}
      {messageWarning && <Alert variant="warning" className="mt-3">{messageWarning}</Alert>}

      <Row className="justify-content-center align-items-center my-4">
        <Col md="auto">
            <Form.Check
            type="checkbox"
            label="Add new user"
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
                  <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="name">
                      <Form.Control
                          required
                          type='text'
                          placeholder='Enter your name'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                      <Form.Control
                          required
                          type='email'
                          placeholder='Enter email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="age">
                      <Form.Control
                          required
                          type='number'
                          placeholder='Enter age'
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="height">
                      <Form.Control
                          required
                          type='number'
                          placeholder='Enter height'
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                      />
                  </Form.Group>
                  <span style={{fontSize:"small"}}>
                      *min length - 6 <br/>
                      {/* *min one letter <br/>
                      *min one number <br/>
                      *can not be easy like: <strong>qwerty12345</strong> */}
                  </span>
                  <Form.Group className="mb-3 mt-1" controlId="password">
                      <Form.Control
                          required
                          minLength={6}
                          type='password'
                          placeholder='Enter password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Control
                          required
                          type='password'
                          placeholder='Confirm password'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                  </Form.Group>
                  <div className="d-flex flex-column justify-content-center align-items-center">
                      <Button variant='primary' type='submit'>
                          Create User
                      </Button>
                  </div>
              </Form>
                </Col>
                </Row>
            </Card.Body>
        </Card>
        </Container>

        :
        <Container className="d-flex flex-column justify-content-center align-items-center">
          {users.length > 0 ?
            <table className='text-left styled-table'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Height</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className='active-row'>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td>{user.height}</td>
                            <td>
                                <Row>
                                    {/* <Col><Button variant="dark" onClick={() => userEditHandle(user._id)}>Edit</Button></Col> */}
                                    <Col><Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button></Col>
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

export default AdminUsers;
