import {React, useState, useEffect} from 'react';
import { Sidebar } from 'react-pro-sidebar';
import { X, MapPin } from 'lucide-react';
import './SideBar.css'
import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';


const SideBar = ({ isOpen, selectedMarkerData, surat, onClose, hapus }) => {
  const navigate = useNavigate();

  const handleTambahAnakClick = () => {
    const isAuthenticated = true; 

    if (isAuthenticated) {
      navigate('/tambah-anak');
    } else {
      navigate('/');
    }
  };

  return (
    <Sidebar collapsed={!isOpen} style={{ width: '55vh' }}>
      {selectedMarkerData && (
        <div className='container' style={{ padding: 0, height: '100vh', position: 'relative' }}>
          <button onClick={onClose} style={{
            right: 10,
            marginTop: '5px',
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: '36px',
            display:'flex',
            padding:'3px'
          }}><X />
          </button>
          <img
            src={selectedMarkerData.image_url}
            alt={selectedMarkerData.name}
            style={{ display: 'block', margin: '0 auto', height: '300px' }}
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
          </div>
          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Nama</span>
            </div>
            <div className='row2'>
              <span className='warga-name'>{selectedMarkerData.name}</span>
            </div>
              <hr className='container-line'/>
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Nama Istri</span>
            </div>
            <div>
              {selectedMarkerData.istri ? (
                selectedMarkerData.istri.map((istriName, index) => (
                  <div key={index} className='warga-name-container'>
                    <span className='warga-name'>{istriName}</span>
                  </div>
                ))
              ) : (
                <span className='warga-name'>Belum ada data istri</span>
              )}
              
            </div>
            <hr className='container-line'/>
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Riwayat Surat</span>
            </div>
            <div>
              {surat && surat[selectedMarkerData.name] && surat[selectedMarkerData.name].fileNames.length > 0 ? (
                surat[selectedMarkerData.name].fileNames.map((fileName, index) => (
                  <div key={index} className='warga-name-container'>
                    <span className='warga-name'>{fileName}</span>
                  </div>
                ))
              ) : (
                <span className='warga-name'>Belum ada data surat</span>
              )}
     
            </div>
            <hr className='container-line'/>
          </div>
          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Foto KK</span>
            </div>
            <div>
              {Array.isArray(selectedMarkerData.image_url_KK) ? (
                selectedMarkerData.image_url_KK.map((image_url, index) => (
                  <div key={index} className='warga-name-container'>
                    <img
                      src={image_url}
                      alt={`KK ${index + 1}`}
                      style={{ display: 'block', margin: '0 auto', height: '300px', marginTop: 10 }}
                    />
                  </div>
                ))
              ) : (
                <span className='warga-name'>Belum ada foto KK</span>
              )}
            </div>
            <hr className='container-line' />
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Foto KTP</span>
            </div>
            <div>
              {Array.isArray(selectedMarkerData.image_url_KTP) ? (
                selectedMarkerData.image_url_KTP.map((image_url, index) => (
                  <div key={index} className='warga-name-container'>
                    <img
                      src={image_url}
                      alt={`KTP ${index + 1}`}
                      style={{ display: 'block', margin: '0 auto', height: '300px', marginTop: 10}}
                    />
                  </div>
                ))
              ) : (
                <span className='warga-name'>Belum ada foto KTP</span>
              )}
            </div>
            <hr className='container-line' />
          </div>
          <Button
            style={{ width: 'calc(100% - 20px)', margin: '5px 5px 5px 10px', textAlign: 'center', textTransform: 'none' }}
            className='update'
            variant="outlined"
            color='primary'
            onClick={handleTambahAnakClick}
          >
            Tambah Anak
          </Button>

          <Button style={{ width: 'calc(100% - 20px)', margin: '5px 5px 5px 10px', textAlign: 'center', textTransform:'none' }} className='delete' variant="contained" color='error' onClick={() => { hapus(selectedMarkerData.name); onClose(); }}>Hapus</Button>
        </div>
      )}

    </Sidebar>
  );
};

export default SideBar;