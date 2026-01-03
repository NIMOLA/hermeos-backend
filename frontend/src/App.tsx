import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
    // Simple auth check mock (in real app, use Context/Redux)
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                    />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
