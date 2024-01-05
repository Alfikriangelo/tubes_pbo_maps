import React from 'react';
import { Sidebar } from 'react-pro-sidebar';

const SideBar = ({ isOpen, selectedMarkerData, onClose }) => {
  return (
    <Sidebar collapsed={!isOpen} style={{width: 400}}>
      {selectedMarkerData && (
        <div style={{padding: 20, height: '100vh'}}>
          <h2>Informasi Warga</h2>
          <p>Nama: {selectedMarkerData.name}</p>
          <p>NIK: {selectedMarkerData.nik}</p>
          <p>Alamat: {selectedMarkerData.address}</p>
          <button onClick={onClose}>Tutup</button>
        </div>
      )}
    </Sidebar>
  );
};

export default SideBar;