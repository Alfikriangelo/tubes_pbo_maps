import React from 'react';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "./addmaps.css";
import Button from '@mui/material/Button';

const AddSurat = () => {
  const navigate = useNavigate();

  const handleSuratClick = () => {
    const isAuthenticated = true; 

    if (isAuthenticated) {
      navigate('/surat');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <div className={"form-container"}>
        <Button onClick={handleSuratClick}>
          Surat
        </Button>
      </div>
    </div>
  );
}

export default AddSurat;
