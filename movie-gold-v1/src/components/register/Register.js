import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card, InputGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // Real-time email uniqueness check
    if (name === 'email' && value) {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/check-email?email=${value}`);
        setEmailExists(res.data.exists);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailExists) {
      setMessage('Email already registered.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/users/register', user);
      setMessage('Registration successful!');
      setUser({ name: '', email: '', password: '' });
    } catch (error) {
      console.error(error);
      setMessage('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '450px' }} className="p-4 shadow">
        <h3 className="text-center mb-4 text-info">Create an Account</h3>
        {message && <Alert variant={message.includes('successful') ? 'success' : 'danger'}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaUser /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="John Doe"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaEnvelope /></InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
                isInvalid={emailExists}
              />
            </InputGroup>
            {emailExists && <small className="text-danger">Email already exists</small>}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text><FaLock /></InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="********"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="info" className="w-100" disabled={loading || emailExists}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Register'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
