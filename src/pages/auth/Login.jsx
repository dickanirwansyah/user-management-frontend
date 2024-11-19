import React, {useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container } from 'react-bootstrap';
import api from "../../configuration/ApiConfig";

function Login ({ onLogin }){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await api.post('/api/v1/auth/signin', {
                usernameOrEmail : username,
                password: password
            });
            if (response.status === 200){
                var token = response.data.data.token;
                var loginInformation = response.data.data.accountResponse;
                
                localStorage.setItem('token', "Bearer "+token);
                localStorage.setItem('login_information',JSON.stringify(loginInformation));
                onLogin();
                navigate('/app/home');
            }else{
                console.log("credentials failed");
            }
            
        }catch(error){
            console.log("error login : ",error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Form onSubmit={handleLogin} style={{ width: '400px', height: '400px'}}>
                <h3 className="text-center">Login Page</h3>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                    type="text" 
                    value={username} 
                    placeholder="Type you username"
                    onChange={(e) => setUsername(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    value={password}
                    placeholder="Type your password"
                    onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Login
                </Button>
            </Form>
        </Container>
    )
}   

export default Login;