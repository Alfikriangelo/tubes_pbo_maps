import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TambahAnak() {
  const [formData, setFormData] = useState({
    anak: '',
    nik: '',
    ttl: ''
  });

  useEffect(() => {
    // Ambil data awal dari backend saat komponen dimuat
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_saved_data');
      setFormData(response.data.savedData[0]);  // Ambil data pertama dari array savedData
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    // Menambahkan data anak ke formDataToSend
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '') {
        formDataToSend.append(key, value);
      }
    });
  
    // Kirim data ke backend
    try {
      const response = await fetch('http://localhost:5000/save_data', {
        method: 'PUT',  // Ganti metode HTTP menjadi PUT
        headers: {
          // Jika perlu menambahkan header tertentu, tambahkan di sini
        },
        body: formDataToSend,
      });
  
      if (response.ok) {
        console.log('Data saved successfully');
        // Handle kesuksesan, misalnya redirect atau tindakan lainnya
      } else {
        console.error('Failed to save data');
        // Handle kegagalan, misalnya menampilkan pesan kesalahan kepada pengguna
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div>
      <h1>Form Update Data</h1>
      <label>
        Anak:
        <input type="text" name="anak" value={formData.anak} onChange={handleChange} />
      </label>
      <br />
      <label>
        NIK:
        <input type="text" name="nik" value={formData.nik} onChange={handleChange} />
      </label>
      <br />
      <label>
        TTL:
        <input type="text" name="ttl" value={formData.ttl} onChange={handleChange} />
      </label>
      <br />
      <button onClick={handleSubmit}>Update Backend</button>
    </div>
  );
}

export default TambahAnak;
