import { Container, Card, Button, Form, Row, Col, Alert, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from "react";

import getUserId from '../utils/getUserId';
import LineChart from '../components/LineChart';

const Profile = () => {

  const [loading, setLoading] = useState(true)

  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageWarning, setMessageWarning] = useState("");

  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")


  const setMessage = (type, message) => {
      setMessageError("");
      setMessageWarning("");
      setMessageSuccess("");
  
      if (type === "error") setMessageError(message);
      if (type === "warning") setMessageWarning(message);
      if (type === "success") setMessageSuccess(message);
    };



  const [weights, setWeights] = useState([]);
  const [heartbeats, setHeartbeats] = useState([]);
  const [steps, setSteps] = useState([]);

  const [methods, setMethods] = useState([])
  const [methodType, setMethodType] = useState('')

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [measureList, setMeasureList] = useState(weights)
  const [filteredList, setFilteredList] = useState(null)
  const [measureListType, setMeasureListType] = useState('weights')

  const handleMeasureListChange = (listName) => {
      handleClearFilter()
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
          const sortedData = combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));
          setMeasureList(sortedData); 
      }
    };



  const fetchData = async (mode) => {
      try {

        const response = await fetch(`http://localhost:8080/api/user/get-${mode}?id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const responseData = await response.json();

          const data = responseData.data;
          if (mode === 'weights'){
              setWeights(data)
          } else if (mode === 'steps'){
              setSteps(data)
          } else {
              setHeartbeats(data)
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

  const handleApplyFilter = async () => {
    let newFilteredList = measureList;
    if (methodType){
      newFilteredList = measureList.filter(
        (element) => element.method_name.toLowerCase() === methodType.toLowerCase()
      )
    }
    if (startDate){
      newFilteredList = newFilteredList.filter(
        (element) => new Date(element.date) >= new Date(startDate)
      );
    }
    if (endDate){
      newFilteredList = newFilteredList.filter(
        (element) => new Date(element.date) <= new Date(endDate)
      );
    }



    if (newFilteredList !== measureList){
      setFilteredList(newFilteredList)
      setMessage("warning", "")
    }
    else {
      setMessage("warning", "Select Filters before usage")
    }
  }


  const handleClearFilter = async () => {
    setFilteredList(null)
    setMethodType('')
    setStartDate('')
    setEndDate("")
  }




  useEffect(() => {
      setUserId(getUserId())
      fetchMethods()
    }, []);


  useEffect(() => {
      if (userId){
          const loadData = async () => {
              await fetchData('weights');
              await fetchData('steps');
              await fetchData('heartbeats');
              setLoading(false)
          }
          loadData()
      }
  }, [userId]);


  useEffect(() => {
      handleMeasureListChange(measureListType)
  }, [weights, steps, heartbeats]);

  // useEffect(() => {
  //   setUserId(getUserId())
  //   fetchMethods()
  // }, [filteredList]);

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Your Tendention</h1>
      {messageSuccess && <Alert variant="success" className="mt-3">{messageSuccess}</Alert>}
      {messageError && <Alert variant="danger" className="mt-3">{messageError}</Alert>}
      {messageWarning && <Alert variant="warning" className="mt-3">{messageWarning}</Alert>}

 
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row className="d-flex align-items-center">
            <Col className="mb-3 mb-md-0">
                <Button onClick={() => handleClearFilter()} variant="danger" className="w-100">
                  Clear Filter
                </Button>
              </Col>


              <Col className="mb-3 mb-md-0">
                <Form.Group>
                        <Form.Select
                            required
                            value={methodType}
                            onChange={(e) => setMethodType(e.target.value)}>
                            <option value="">Select a method</option>
                            {methods.map((method, index) => (
                                <option value={method.name} key={method.id}>{method.name}</option>
                            ))};
                        </Form.Select>
                </Form.Group>
              </Col>

              <Col className="mb-3 mb-md-0">
                <Form.Group>
                    <Form.Control
                        required
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Enter the start date"
                    />
                </Form.Group>
              </Col>

              <Col className="mb-3 mb-md-0">
                <Form.Group>
                    <Form.Control
                        required
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="Enter the end date"
                    />
                </Form.Group>
              </Col>

              <Col className="mb-3 mb-md-0">
                <Button onClick={() => handleApplyFilter()} variant='success' className="w-100">
                  Apply Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Container className="d-flex flex-column justify-content-center align-items-center">
            <ButtonGroup className="d-flex justify-content-center mb-3">
                <Button
                variant={measureListType === 'weights' ? 'primary' : 'outline-primary'}
                onClick={() => handleMeasureListChange('weights')}
                >
                Weights
                </Button>
                <Button
                variant={measureListType === 'steps' ? 'primary' : 'outline-primary'}
                onClick={() => handleMeasureListChange('steps')}
                >
                Steps
                </Button>
                <Button
                variant={measureListType === 'heartbeats' ? 'primary' : 'outline-primary'}
                onClick={() => handleMeasureListChange('heartbeats')}
                >
                Heartbeats
                </Button>
                <Button
                variant={measureListType === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => handleMeasureListChange('all')}
                >
                All
                </Button>
        </ButtonGroup>

      </Container>

      <Container>
        {measureList.length < 1 && <p className="fw-bold">No Data</p>}
        {measureList ?
          <LineChart data={filteredList ? filteredList : measureList}/>
        :
        <></>
        }
      </Container>

    </Container>
  );
};

export default Profile;
