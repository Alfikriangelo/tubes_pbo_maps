import React, { useState, useEffect } from 'react';
import "./maps.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";
import TombolTambahSurat from '../Components/Surat/TombolTambahSurat';
import TombolTambahWarga from '../Components/Maps/TombolTambaWarga.jsx';
import TombolLogout from '../Components/Logout/tombolLogout';

const customIcon = new Icon({
  iconUrl: require("../icons/placeholder.png"),
  iconSize: [38, 38]
});

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

const Maps = () => {
  const [data, setData] = useState([]);
  const [multiPolygon, setMultiPolygon] = useState([]);
  const purpleOptions = { color: 'purple' }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await axios.get("http://127.0.0.1:5000/get_data");
        setData(responseData.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMultiPolygon = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_multipolygon");
        setMultiPolygon(response.data.multiPolygon);
      } catch (error) {
        console.error("Error fetching multiPolygon:", error);
      }
    };

    fetchMultiPolygon();
  }, []);


  return (
    <div className="app-container">
      <TombolLogout />
      <TombolTambahWarga />
      <TombolTambahSurat />

      <MapContainer center={[-6.900466928446799, 107.5969945024512]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
          {data.map((item) => (
            <Marker
              key={item._id}
              position={item.lokasi.split(',').map(coord => parseFloat(coord))}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <p>Nama: {item.nama}</p>
                  <p>NIK: {item.nik}</p>
                  <p>Status: {item.status}</p>
                  {item.file_path && (
                    <img
                      src={`http://127.0.0.1:5000/uploads/${item.file_path}`}
                      alt={item.nama}
                      style={{ maxWidth: '100%', maxHeight: '150px' }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
      </MapContainer>
    </div>
  );
}

export default Maps;
