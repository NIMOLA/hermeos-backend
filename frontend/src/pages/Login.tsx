import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-hermeos-deepBlue">
            <Card className="w-[350px] border-hermeos-gold bg-black/40 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-hermeos-gold text-2xl text-center">Hermeos PropTech</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button onClick={handleLogin} className="w-full bg-hermeos-gold text-black hover:bg-yellow-400">
                        Enter Platform
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
