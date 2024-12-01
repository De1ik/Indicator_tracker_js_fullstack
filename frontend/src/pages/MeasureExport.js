import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Alert, Card, Row, Col } from 'react-bootstrap';
import getUserId from '../utils/getUserId';


const MeasureExport = () => {

    const [userId, setUserId] = useState("")

    const [file, setFile] = useState(null);
    const [messageWarning, setMessageWarning] = useState("");
    const [messageSuccess, setMessageSuccess] = useState("");
    const [messageError, setMessageError] = useState("");
  
    const setMessage = (type, message) => {
      setMessageError("");
      setMessageWarning("");
      setMessageSuccess("");
  
      if (type === "error") setMessageError(message);
      if (type === "warning") setMessageWarning(message);
      if (type === "success") setMessageSuccess(message);
    };


    const [measureType, setMeasureType] = useState("")
  
    const handleExport = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/download-measure-csv/get-${measureType}?id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${measureType}_export.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          setMessage("success", `${measureType} exported successfully!`);
          setMeasureType('')
        } else {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          setMessage("error", `Failed to export ${measureType}: ${errorText}`);
        }
      } catch (error) {
        console.error("Error exporting:", error);
        setMessage("error", "An error occurred while exporting measure.");
      }
    };
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleImport = async () => {
      if (!file) {
        setMessage("warning", "Please select a file to import.");
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch(`http://localhost:8080/api/user/upload-csv/get-${userId}`, {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          setMessage("success", `${measureType} imported successfully!`);
        } else {
          const errorText = await response.text();
          setMessage("error", `Failed to import measure: ${errorText}`);
        }
      } catch (error) {
        console.error("Error importing:", error);
        setMessage("error", "An error occurred while importing mesure.");
      }
    };
  
    useEffect(() => {
        setUserId(getUserId())
    }, []);

  
    return (
      <Container className="mt-5">
        <h1 className="text-center">Imort/Export Measure Data</h1>
        {messageWarning && <Alert variant="warning" className="mt-3">{messageWarning}</Alert>}
        {messageSuccess && <Alert variant="success" className="mt-3">{messageSuccess}</Alert>}
        {messageError && <Alert variant="danger" className="mt-3">{messageError}</Alert>}
  
        <div className="d-flex flex-column align-items-center mt-4">
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
                </Form>
            </Col>
        </Row>

        <Button variant="primary" disabled={!measureType} className="mb-3" onClick={handleExport}>
            Export Measure
        </Button>
  
        <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Measure</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="success" onClick={handleImport}>
              Import Measure
            </Button>
        </Form>
        </div>
      </Container>
    );
};

export default MeasureExport;
