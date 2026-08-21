import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../services/api';

function LoginPage({ onLoginSuccess = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const accounts = await loginAPI(email, password);

    if (accounts && accounts.length > 0) {
      const user = accounts[0];
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('fer_current_user', JSON.stringify(user));
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      navigate('/');
    } else {
      setError('Email hoặc mật khẩu không đúng!'); 
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <Card className="p-4 shadow-sm">
        <h3 className="text-center mb-3">Sign In</h3>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>
        </Form>

        <div className="bg-light p-2.5 rounded-3 text-center border mt-2">
          <small className="text-muted d-block fw-bold mb-1">Tài khoản thử nghiệm:</small>
          <small className="text-secondary d-block">Khách: user@gmail.com / 123456</small>
          <small className="text-secondary d-block">Admin: admin@gmail.com / admin123</small>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;
