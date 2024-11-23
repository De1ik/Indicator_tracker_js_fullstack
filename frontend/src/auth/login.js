import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

import FormContainer from "../components/FormContainer";
import Message from "../components/Message";


const LoginForm = () => {
  const navigate = useNavigate();

  const handleNavigationHome = () => {
    navigate("/");
  };


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
                const formData = {
                    email: email,
                    password: password,
                }

                const response = await fetch("http://localhost:8080/api/login", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const responseData = await response.json();

                if (response.status === 201) {
                    alert("Sign in was successful!");
                    handleNavigationHome()
                } else {
                    // const errorData = await response.json();
                    setMessage(`${responseData.message}`)
                }
            } catch (err) {
                console.error("Error:", err);
                alert("An error occurred during login.");
        }
        
    };

  return (
    <>
        <h1 className='text-center m-5'>Sign In</h1>
        <FormContainer>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Control
                        required
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3 mt-1" controlId="password">
                    <Form.Control
                        required
                        minLength={8}
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                {message && <Message type="danger">{message}</Message>}
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <Button variant='primary' type='submit'>
                        Login
                    </Button>
                    <span className='m-3'>
                        Do not have an account? <Link to="/registration">Sign Up now</Link>
                    </span>
                </div>
            </Form>
        </FormContainer>
    </>
  );
};

export default LoginForm;
