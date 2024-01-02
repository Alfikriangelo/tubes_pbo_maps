import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./addmaps.css";

const AddMaps = () => {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [status, setStatus] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [file, setFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_data");
        setData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('nik', nik);
      formData.append('status', status);
      formData.append('lokasi', lokasi);
      formData.append('file', file);

      await axios.post("http://127.0.0.1:5000/add_data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Fetch updated data after submitting the form
      const response = await axios.get("http://127.0.0.1:5000/get_data");
      setData(response.data);

      // Clear the form fields and file input
      setNama("");
      setNik("");
      setStatus("");
      setLokasi("");
      setFile(null);

      // Close the sidebar after submitting the form
      setIsSidebarOpen(false);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="app-container">
      <div className={`form-container ${isSidebarOpen ? 'open' : ''}`}>
        <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
        {isSidebarOpen && (
          <form onSubmit={handleFormSubmit}>
            <TextField
              id="outlined-basic-nama"
              label="Nama"
              variant="outlined"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
            <TextField
              id="outlined-basic-lokasi"
              label="NIK"
              variant="outlined"
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              required
            />
            <TextField
              id="outlined-basic-lokasi"
              label="Status"
              variant="outlined"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <TextField
              id="outlined-basic-lokasi"
              label="Lokasi"
              variant="outlined"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              required
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <Button
              variant="contained"
              type="submit"
              style={{
                backgroundColor: 'blue',
                color: 'white',
                marginLeft: '8px',
                height: '52px', // Adjust the height to match the text field height
              }}
            >
              Simpan
            </Button>
          </form>
        )}
      </div>

    </div>
  );
}

export default AddMaps;
