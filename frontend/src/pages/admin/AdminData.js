import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';

const AdminData = () => {
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

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/download-users-csv', {
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
        a.download = 'users_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage("success", "Users exported successfully!");
      } else {
        const errorText = await response.text(); // Получение текста ошибки
        console.error("Error response:", errorText);
        setMessage("error", `Failed to export users: ${errorText}`);
      }
    } catch (error) {
      console.error("Error exporting users:", error);
      setMessage("error", "An error occurred while exporting users.");
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
      const response = await fetch('http://localhost:8080/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage("success", "Users imported successfully!");
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setMessage("error", "Failed to import users.");
      }
    } catch (error) {
      console.error("Error importing users:", error);
      setMessage("error", "An error occurred while importing users.");
    }
  };


  return (
    <Container className="mt-5">
      <h1 className="text-center">Imort/Export Data</h1>
      {messageWarning && <Alert variant="warning" className="mt-3">{messageWarning}</Alert>}
      {messageSuccess && <Alert variant="success" className="mt-3">{messageSuccess}</Alert>}
      {messageError && <Alert variant="danger" className="mt-3">{messageError}</Alert>}

      <div className="d-flex flex-column align-items-center mt-4">
        <Button variant="primary" className="mb-3" onClick={handleExport}>
          Export Users
        </Button>

        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Users</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button variant="success" onClick={handleImport}>
            Import Users
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AdminData;
