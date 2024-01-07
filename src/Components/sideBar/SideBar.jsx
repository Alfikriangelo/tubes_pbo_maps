import React from 'react';
import { Sidebar } from 'react-pro-sidebar';
import { X, MapPin } from 'lucide-react';
import './SideBar.css'
import { Button } from '@mui/material';


const SideBar = ({ isOpen, selectedMarkerData, surat,onClose, hapus }) => {
  return (
    <Sidebar collapsed={!isOpen} style={{ width: '75vh' }}>
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
          {/* <h1>
            INFORMASI WARGA
          </h1> */}
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
            <span className='see-all'>See all</span> 
          </div>
          <div className='container-isi'>
          <div className='row1'>
              <span className='nama'>Nama</span>
            </div>
            <div className='row2'>
              <span className='warga-name'>{selectedMarkerData.name}</span>
              <span className='see-more'>See more</span>
            </div>
            <hr className='container-line'/>
          </div>
          <Button style={{ width: 'calc(100% - 20px)', margin: '10px', textAlign: 'center' }} className='delete' variant="outlined" color='error' onClick={() => { hapus(selectedMarkerData.name); onClose(); }}>Hapus</Button>
        </div>
      )}
    </Sidebar>
  );
};

export default SideBar;