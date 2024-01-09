import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lakukan sesuatu dengan data yang sudah diinput, misalnya kirim ke server atau tampilkan di console
    console.log(formData);
  };

  return (
    <div>
      <h1>Form Input Data</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nama:
          <input type="text" name="nama" value={formData.nama} onChange={handleChange} />
        </label>
        <br />
        <label>
          NIK:
          <input type="text" name="nik" value={formData.nik} onChange={handleChange} />
        </label>
        <br />
        <label>
          Tempat Lahir:
          <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} />
        </label>
        <br />
        <label>
          Tanggal Lahir:
          <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
