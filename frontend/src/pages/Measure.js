import { Container, Card, Button, Form, Row, Col, Alert, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from "react";

import getUserEmail from '../utils/getUserEmail';
import getUserId from '../utils/getUserId';


const Measure = () => {

    const [messageSuccess, setMessageSuccess] = useState("");
    const [messageError, setMessageError] = useState("");

    const [email, setEmail] = useState("")
    const [userId, setUserId] = useState("")

    const setMessage = (type, message) => {
        setMessageError("");
        // setMessageWarning("");
        setMessageSuccess("");
    
        if (type === "error") setMessageError(message);
        // if (type === "warning") setMessageWarning(message);
        if (type === "success") setMessageSuccess(message);
      };



    const [weights, setWeights] = useState([]);
    const [heartbeats, setHeartbeat] = useState([]);
    const [steps, setSteps] = useState([]);

    const [methods, setMethods] = useState("")
    const [methodType, setMethodType] = useState('')

    const [measureDate, setMeasureDate] = useState(new Date().toISOString().split('T')[0])
    const [measureType, setMeasureType] = useState("")
    const [measureValue, setMeasureValue] = useState('')
    const [isAddNew, setIsAddNew] = useState(false);

    const [measureList, setMeasureList] = useState(weights)
    const [measureListType, setMeasureListType] = useState(weights)

    const handleMeasureListChange = (listName) => {
        if (listName === "steps"){
            setMeasureListType("steps")
            setMeasureList(steps);
        } else if (listName === "heartbeats"){
            setMeasureListType("heartbeats")
            setMeasureList(heartbeats);
        } else if (listName === "weights"){
            setMeasureListType("weights")
            setMeasureList(weights); 
        } else {
            setMeasureListType("all")
            const combinedData = [...weights, ...heartbeats, ...steps];
            const sortedData = combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));
            setMeasureList(sortedData); 
        }
      };


    const handleCreate = async () => {
        try {
            const formData = {
                mode: measureType,
                methodType: methodType,
                date: measureDate,
                value: measureValue,
                id: userId
            }


            const response = await fetch('/api/user/add-measure', {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });


            const responseData = await response.json();

            
            if (response.status === 201) {
                setMessage("success", `New measure of ${measureType} was Added`)
                fetchData(measureType)
                handleMeasureListChange(measureType)
                setMeasureType('')
                setMeasureValue('')
                setMethodType('')
                setMeasureDate(new Date().toISOString().split('T')[0])
                setIsAddNew(false)
            } else {
                setMessage("error", `${responseData.message}`)
            }
        } catch (err) {
            setMessage("error", `An error occurred during adding new measurement: ${err}`);
        }
    };

    const handleDelete = async (id) => {
        // try {

        //     const formData = {
        //         id: id
        //     }

        //     const response = await fetch(`http://localhost:8080/api/user/delete-${measureType}`, {
        //         method: "DELETE",
        //         headers: {
        //         "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(formData),
        //     });


        //     const responseData = await response.json();

            
        //     if (response.status === 201) {
        //         setMessage("success", `${measureType} was delete successfully`)
        //         fetchData(measureType)
        //     } else {
        //         setMessage("error", `${responseData.message}`)
        //     }
        // } catch (err) {
        //     console.error("Error:", err);
        //     setMessage("error", "An error occurred during deleting measure.");
        // }
    };


    const fetchData = async (mode) => {
        try {

          const formData = {
            mode : mode,
            id: userId,
          }

          const response = await fetch(`http://localhost:8080/api/user/get-${mode}?id=${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            const responseData = await response.json();

            const data = responseData.data;
            setMessage("success", `data: ${data}`)
            if (mode === 'weights'){
                setWeights(data)
            } else if (mode === 'steps'){
                setSteps(data)
            } else {
                setHeartbeat(data)
            }
          } else {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            setMessage("error", `Failed to receive ${mode} data: ${errorText}`);
          }
        } catch (error) {
        //   console.error("Error:", error);
          setMessage("error", `An error occurred while adding new measure: ${error}`);
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
        setEmail(getUserEmail())
        setUserId(getUserId())
      }, []);


    useEffect(() => {
        fetchMethods()
        if (email){
            fetchData('weights')
            fetchData('steps')
            fetchData('heartbeats')
        }
      }, [email]);

    
  return (
    <Container className="mt-5">
      <h1 className="mb-4">Measurmnet {email} {userId}</h1>
      {messageSuccess && <Alert variant="success" className="mt-3">{messageSuccess}</Alert>}
      {messageError && <Alert variant="danger" className="mt-3">{messageError}</Alert>}

      <Row className="justify-content-center align-items-center my-4">
        <Col md="auto">
            <Form.Check
            type="checkbox"
            label="Add new Measure"
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

                <Col>
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Select
                            required
                            value={measureType}
                            onChange={(e) => setMeasureType(e.target.value)}
                        >
                            <option value="">Select an option</option>
                            <option value="weights">Weights</option>
                            <option value="steps">Steps</option>
                            <option value="heartbeats">Heartbeats</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Select
                            required
                            value={methodType}
                            onChange={(e) => setMethodType(e.target.value)}>
                            <option value="">Select a method</option>
                            {methods.map((method, index) => (
                                <option value={method.id}>{method.name}</option>
                            ))};
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                    <Form.Control
                        required
                        type="date"
                        value={measureDate}
                        onChange={(e) => setMeasureDate(e.target.value)}
                        placeholder="Enter a date" // Необязательная подсказка
                    />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                        required
                        type="text"
                        value={measureValue}
                        onChange={(e) => setMeasureValue(e.target.value)}
                        placeholder="Enter new value"
                        />
                    </Form.Group>
                    <Button
                        onClick={() => handleCreate()}
                        className="w-100"
                    >
                        Add
                    </Button>
                    </Form>
                </Col>
                </Row>
            </Card.Body>
        </Card>

        :
        <Container className="d-flex flex-column justify-content-center align-items-center">
            <ButtonGroup className="d-flex justify-content-center mb-3">
                <Button
                variant={measureListType === 'weights' ? 'danger' : 'outline-danger'}
                onClick={() => handleMeasureListChange('weights')}
                >
                Weights
                </Button>
                <Button
                variant={measureListType === 'steps' ? 'danger' : 'outline-danger'}
                onClick={() => handleMeasureListChange('steps')}
                >
                Steps
                </Button>
                <Button
                variant={measureListType === 'heartbeats' ? 'danger' : 'outline-danger'}
                onClick={() => handleMeasureListChange('heartbeats')}
                >
                Heartbeats
                </Button>
                <Button
                variant={measureListType === 'all' ? 'danger' : 'outline-danger'}
                onClick={() => handleMeasureListChange('all')}
                >
                All
                </Button>
        </ButtonGroup>
            {steps.length > 0 ?
            <table className='text-left styled-table' style={{ minWidth: '90%'}}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Value</th>
                        <th>Method</th>
                        <th>Method Description</th>
                    </tr>
                </thead>
                <tbody>
                    {measureList.map((type) => (
                        <tr key={type.id} className='active-row'>
                            <td className='text-start'>{type.id}</td>
                            <td className='text-start'>{new Date(type.date).toLocaleDateString('en-GB')}</td>
                            <td className='text-start'>{type.value}</td>
                            <td className='text-start'>{type.method_name}</td>
                            <td className='text-start'>{type.method_description}</td>
                            <td>
                                <Row>
                                    {/* <Col><Button variant="dark" onClick={() => userEditHandle(user._id)}>Edit</Button></Col> */}
                                    <Col><Button variant="danger" onClick={() => handleDelete(type.id)}>Delete</Button></Col>
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

export default Measure;
