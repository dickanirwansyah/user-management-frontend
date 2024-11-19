import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import './App.css';
import AccountList from './pages/account/AccountList';
import PermissionList from './pages/account/PermissionList';
import SettingRoles from './pages/account/SettingRoles';
import RolesList from './pages/account/RolesList';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  //callback function onLogin
  const handleLogin = () => {
    setIsAuthenticated(true);
    window.location.reload();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token){
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  if (loading){
    return <div>Loading Apps..</div>
  }

  return (
    <Router>
      <div className={`app ${isAuthenticated ? 'with-sidebar' : ''}`}>
          {isAuthenticated && <Sidebar/>}
          <div className="content">
            {isAuthenticated && <Header onLogout={handleLogout}/>}
            <div className="main-content">
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/app/home" />} />
              <Route path="/app/home" element={isAuthenticated ? <Home/> : <Navigate to="/login"/>}/>
              <Route path="/app/management-product/data-product" />
              <Route path="/app/management-product/data-category" />
              <Route path="/app/management-account/data-account" element={isAuthenticated ? <AccountList/> : <Navigate to="/login"/>}/>
              <Route path="/app/management-account/data-permissions" element={isAuthenticated ? <PermissionList/> : <Navigate to="/login" />}/>
              <Route path="/app/management-account/settings-roles" element={isAuthenticated ? <SettingRoles/> : <Navigate to="/login"/>}/>
              <Route path="/app/management-account/data-roles" element={isAuthenticated ? <RolesList/> : <Navigate to="/login"/>}/>
              <Route path="/app/management-transaction" />
            </Routes>
            </div>
          </div>
      </div>
    </Router>
  );
}

export default App;
