import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField } from '@mui/material';

const FormPopup = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    anakName: '',
    anakNIK: '',
    tanggalLahir: '',
  });

  const handleInputChange = (fieldName) => (event) => {
    setFormData({ ...formData, [fieldName]: event.target.value });
  };

  const handleFormSubmit = () => {
    // Lakukan validasi atau pemanggilan ke backend jika diperlukan
    // ...

    // Panggil fungsi onSubmit untuk menyimpan data anak
    onSubmit(formData);

    // Reset form setelah submit
    setFormData({ anakName: '', anakNIK: '', tanggalLahir: '' });

    // Tutup popup
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Tambah Anak"
    >
      <div>
        <TextField
          label="Nama Anak"
          value={formData.anakName}
          onChange={handleInputChange('anakName')}
          style={{ margin: '5px' }}
        />
        <TextField
          label="NIK Anak"
          value={formData.anakNIK}
          onChange={handleInputChange('anakNIK')}
          style={{ margin: '5px' }}
        />
        <TextField
          label="Tanggal Lahir Anak"
          type="date"
          value={formData.tanggalLahir}
          onChange={handleInputChange('tanggalLahir')}
          style={{ margin: '5px' }}
        />
        <Button
          style={{ margin: '5px' }}
          className='update'
          variant="outlined"
          color='primary'
          onClick={handleFormSubmit}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
};

export default FormPopup;
