import React from 'react';
import { Sidebar } from 'react-pro-sidebar';
import { X, MapPin } from 'lucide-react';
import './SideBar.css'
import { auto, right } from '@popperjs/core';


const SideBar = ({ isOpen, selectedMarkerData, surat,onClose }) => {
  return (
    <Sidebar collapsed={!isOpen} style={{ width: 400 }}>
      {selectedMarkerData && (
        <div className='container' style={{ padding: 0, height: '100vh', position: 'relative' }}>
          <button onClick={onClose} style={{
            marginLeft: '360px',
            marginTop: '5px',
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: '36px',
            display:'flex',
            padding:'3px'
          }}><X />
          </button>
          {/* <h1>
            INFORMASI WARGA
          </h1> */}
          <img
            src={selectedMarkerData.image_url}
            alt={selectedMarkerData.name}
            style={{
              paddingBottom: '5px',
              paddingTop: '0px',
              maxWidth: '400px',
              Height: '150px',
              display: 'flex',
              justifyContent: 'center',
            }}
          />
          <div className='header1'>
          {selectedMarkerData.name}
          </div>
          <div className='alamat'>
          <MapPin className='pin'/>{selectedMarkerData.address}
          </div>
          <hr/>
          <div className='detail-container'>
            <span className='detail'>Details</span> 
            <span className='see-all'>See all</span> 
          </div>
          <div className='container-isi'>
          Nama: {selectedMarkerData.name}
          NIK: {selectedMarkerData.nik}
          Alamat: {selectedMarkerData.address}
          </div>
        
        </div>
      )}
    </Sidebar>
  );
};

export default SideBar;