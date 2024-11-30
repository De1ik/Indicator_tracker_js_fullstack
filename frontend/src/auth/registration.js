import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
// import api from "../api";

import FormContainer from "../components/FormContainer";
import Message from "../components/Message";



const RegistrationForm = () => {
  const navigate = useNavigate();

  const handleNavigationHome = () => {
    // navigate("/");
    window.location.replace("/");
  };

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [age, setAge] = useState("")
    const [height, setHeight] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")


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
                    localStorage.setItem("authToken", responseData.token);
                    alert("Registration successful!");
                    handleNavigationHome()
                } else {
                    setMessage(`${responseData.message}`)
                }
            } catch (err) {
                console.error("Error:", err);
                alert("An error occurred during registration:", err);
            }
        }
    };


    useEffect(() => {
        if (password !== "" && confirmPassword !== "" && password !== confirmPassword){
            setMessage("passwords must be equal")
        }
        else{
            setMessage("")
        }
    }, [password, confirmPassword])


    useEffect(() => {
        if (name === "admin"){
            setMessage("Name can not be 'admin'")
        }
        else{
            setMessage("")
        }
    }, [name])

    
  return (
    <>
        <h1 className='text-center m-5'>Sign Up</h1>
        <FormContainer>
            {/* <form onSubmit={handleSubmit}>
                <div>
                    <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    min="1"
                    max="99"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <input
                    type="number"
                    name="height"
                    placeholder="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </div>
                <div>
                    <input
                    type="password"
                    name="confPassword"
                    placeholder="Confirm password"
                    value={formData.confPassword}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className="d-flex flex-column justify-content-center align-items-center">
                        <Button style={{ minWidth: '100px' }} variant="primary" type='submit'>
                            Register
                        </Button>
                        <span className='m-3'>
                            Already have the account? <Link to="/login">Login now</Link>
                        </span>
                </div>
            </form> */}
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
                {message && <Message type="danger">{message}</Message>}
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <Button variant='primary' type='submit'>
                        Registrate
                    </Button>
                    <span className='m-3'>
                            Already have the account? <Link to="/login">Login now</Link>
                    </span>
                </div>
            </Form>
        </FormContainer>
    </>
  );
};

export default RegistrationForm;
