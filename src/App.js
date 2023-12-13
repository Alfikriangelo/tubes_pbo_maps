import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Icon, divIcon, point } from "leaflet";

// create custom icon
const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl: require("./icons/placeholder.png"),
  iconSize: [38, 38] // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

// markers
const markers = [
  {
    geocode: [-6.971660085187147, 107.6320512243386],
    popUp: "Telkom"
  },
  {
    geocode: [-6.917180173576364, 107.60944619736932],
    popUp: "Braga"
  },
  {
    geocode: [-6.892025427936757, 107.61040025588153],
    popUp: "ITB"
  }
];

export default function App() {
  return (
    <MapContainer center={[-6.900466928446799, 107.5969945024512]} zoom={13}>
      {/* OPEN STREEN MAPS TILES */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* WATERCOLOR CUSTOM TILES */}
      <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
      />
      {/* GOOGLE MAPS TILES */}
      <TileLayer
        attribution="Google Maps"
        // url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
        // url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
        url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />
      
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {/* Mapping through the markers */}
        {markers.map((marker) => (
          <Marker position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}

        {/* Hard coded markers */}
        <Marker position={[-6.8926637795365355, 107.6106950906953]} icon={customIcon}>
          <Popup>FSRD</Popup>
        </Marker>
        <Marker position={[-6.890489236923567, 107.61101611958775]} icon={customIcon}>
          <Popup>STEI</Popup>
        </Marker>
        <Marker position={[-6.887960559912165, 107.60918600462124]} icon={customIcon}>
          <Popup>SBM</Popup>
        </Marker>

        <Marker position={[-6.968843164685907, 107.62836766238622]} icon={customIcon}>
          <Popup>TULT</Popup>
        </Marker>
      
      </MarkerClusterGroup>
    </MapContainer>
  );
}
