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

  const handleSubmit = async () => {
    try {
      // Kirim data ke backend
      const response = await axios.post('http://127.0.0.1:5000/update_data', formData);

      if (response.data.message) {
        console.log(response.data.message);
        // Lakukan sesuatu setelah sukses
      } else {
        console.error('Gagal memperbarui data di backend.');
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
