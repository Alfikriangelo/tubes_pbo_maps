import React from 'react';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "./tombolLogout.css";
import Button from '@mui/material/Button';

const TombolLogout = () => {
  const navigate = useNavigate();

  const handleWargaClick = () => {
    const isAuthenticated = true; 

    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <div className={"form-container"}>
        <Button onClick={handleWargaClick}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default TombolLogout;
