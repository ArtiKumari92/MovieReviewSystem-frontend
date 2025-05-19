import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

const Login = ({ setAuth }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', credentials);
      localStorage.setItem('token', response.data.token);
      setAuth(true);
      setMessage('Login successful!');
    } catch (error) {
      console.error(error);
      setMessage('Invalid email or password');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '450px' }} className="p-4 shadow">
        <h3 className="text-center mb-4 text-info">Login to Your Account</h3>

        {message && <Alert variant={message.includes('successful') ? 'success' : 'danger'}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaEnvelope /></InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="info" className="w-100">Login</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
