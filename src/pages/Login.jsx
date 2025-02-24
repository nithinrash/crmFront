import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import api from '../services/api'; // Create this file for API calls
import './Login.css';

// 3D Cube Component
function Cube() {
  const cubeRef = useRef(); // ✅ Fix: No TypeScript generics

  return <mesh ref={cubeRef} />;

  // Rotate the cube
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

// 3D Sphere Component
function Sphere() {
  const sphereRef = useRef();

  // Rotate the sphere
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.01;
      sphereRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={sphereRef} position={[3, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
}

// Login Component
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/api/auth/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Show the user's role in an alert box
        alert(`Login successful! Your role is: ${response.data.user.role}`);

        // Redirect based on the user's role
        if (response.data.user.role === 'Sourcing') {
          navigate('/'); // Redirect to SourcingScreen
        } else if (response.data.user.role === 'Lead') {
          navigate('/LeadScreen'); // Redirect to LeadScreen
        } else if (response.data.user.role === 'Sales') {
          navigate('/SalesScreen'); // Redirect to SalesScreen
        } else {
          navigate('/Login'); // Default redirect for other roles
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      {/* 3D Background */}
      <div className="parallax-background">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Cube />
          <Sphere />
        </Canvas>
      </div>

      {/* Login Form */}
      <div className="login-wrapper">
        <h1>Please Log In</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;