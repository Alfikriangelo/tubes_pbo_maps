import React, { useState, useEffect } from 'react';
import "./maps.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";
import AddMaps from "../Components/addMaps"

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

  return (
    <div className="app-container">
      <AddMaps />
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

      </MapContainer>
    </div>
  );
}

export default Maps;
