import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography as MuiTypography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { DivIcon } from "leaflet";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";

library.add(faMapMarker);

export default function TambahWarga() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nik: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    image: null,
    coordinates: { lat: -6.2088, lng: 106.8456 },
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const initialCoordinatesRef = useRef(null);

  useEffect(() => {
    // Get user's current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Update form data with current coordinates
          setFormData((prevData) => ({
            ...prevData,
            coordinates: { lat: latitude, lng: longitude },
          }));
          initialCoordinatesRef.current = { lat: latitude, lng: longitude };
        },
        (error) => {
          console.error("Error getting user's location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  }, []);

  const [isMapReady, setIsMapReady] = useState(false);

  // Merender peta hanya setelah mendapatkan koordinat
  useEffect(() => {
    if (initialCoordinatesRef.current) {
      setIsMapReady(true);
    }
  }, [initialCoordinatesRef.current]);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && value) {
          formDataToSend.append(key, value);
        } else if (key === "coordinates") {
          // Pastikan coordinates diappend sebagai objek
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("http://localhost:5000/save_data", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Data saved successfully");
        handleNext();
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      ></AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <form
          id="dataForm"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ my: 4 }}
            >
              Form Tambah Warga
            </Typography>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" textAlign={"center"} sx={{ my: 4 }}>
                  Pendaftaran Anda Berhasil!
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {isMapReady && (
                  // Hanya merender peta jika koordinat sudah tersedia
                  <AddressForm
                    formData={formData}
                    setFormData={setFormData}
                    setIsFormValid={setIsFormValid}
                  />
                )}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    disabled={!isFormValid}
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Paper>
          <Copyright />
        </form>
      </Container>
    </React.Fragment>
  );
}

function AddressForm({ formData, setFormData, setIsFormValid }) {
  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    country: "",
    nik: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Validasi input
    let isValid = true;
    let errorMessagesCopy = { ...errorMessages }; // Buat salinan objek pesan kesalahan

    const validationRules = {
      firstName: /^[A-Z][a-zA-Z\s]*$/,
      lastName: /^[A-Z][a-zA-Z\s]*$/,
      city: /^[A-Z][a-zA-Z\s]*$/,
      state: /^[A-Z][a-zA-Z\s]*$/,
      country: /^[A-Z][a-zA-Z\s]*$/,
      nik: (value) => value.length > 10 && !isNaN(Number(value)),
    };

    if (name in validationRules) {
      if (typeof validationRules[name] === "function") {
        isValid = validationRules[name](value);
      } else {
        isValid = validationRules[name].test(value);
      }
    }

    if (!isValid) {
      errorMessagesCopy[
        name
      ] = `${e.target.labels[0].innerText} harus diawali dengan huruf kapital`;
    } else if (name in errorMessagesCopy) {
      errorMessagesCopy[name] = ""; // Bersihkan pesan kesalahan jika valid
    }

    setErrorMessages(errorMessagesCopy);
    setIsFormValid(isValid);

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setFormData((prevData) => ({
      ...prevData,
      coordinates: { lat, lng },
    }));
  };

  const handleZoomEnd = (e) => {
    // Ambil koordinat marker saat ini
    const { lat, lng } = formData.coordinates;
    setFormData((prevData) => ({
      ...prevData,
      coordinates: { lat, lng },
    }));
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errorMessages.firstName}
            helperText={errorMessages.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            variant="standard"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errorMessages.lastName}
            helperText={errorMessages.lastName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="nik"
            name="nik"
            label="NIK"
            fullWidth
            variant="standard"
            value={formData.nik}
            onChange={handleChange}
            error={!!errorMessages.nik}
            helperText={errorMessages.nik}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address"
            name="address"
            label="Alamat Rumah"
            fullWidth
            autoComplete="address"
            variant="standard"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="Kota"
            fullWidth
            autoComplete="city"
            variant="standard"
            value={formData.city}
            onChange={handleChange}
            error={!!errorMessages.city}
            helperText={errorMessages.city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="Provinsi"
            fullWidth
            variant="standard"
            value={formData.state}
            onChange={handleChange}
            error={!!errorMessages.state}
            helperText={errorMessages.state}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Kode Pos"
            fullWidth
            autoComplete="kode pos"
            variant="standard"
            value={formData.zip}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Negara"
            fullWidth
            autoComplete="country"
            variant="standard"
            value={formData.country}
            onChange={handleChange}
            error={!!errorMessages.country}
            helperText={errorMessages.country}
          />
        </Grid>
        <Grid item xs={12}>
          <label htmlFor="image">
            <MuiTypography>Foto Keluarga</MuiTypography>
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <label htmlFor="image">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              <MuiTypography>Masukkan Foto</MuiTypography>
            </Button>
          </label>
          {formData.image && (
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ marginLeft: "10px" }}
            >
              File terpilih: {formData.image.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography>Tentukan Titik Rumah</Typography>
          <MapContainer
            center={[formData.coordinates.lat, formData.coordinates.lng]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
            onClick={handleMapClick}
            onZoomEnd={handleZoomEnd}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[formData.coordinates.lat, formData.coordinates.lng]}
              icon={
                new DivIcon({
                  className: "custom-div-icon",
                  html: '<div><i class="fas fa-map-marker-alt fa-2x" alt="Marker Location"></i></div>',
                  iconSize: [60, 84],
                  iconAnchor: [30, 84],
                  popupAnchor: [0, -84],
                })
              }
            >
              <Popup>Your selected location</Popup>
            </Marker>
          </MapContainer>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function Copyright() {
  return (
    <MuiTypography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.instagram.com/alfikriangelo/">
        Selamat Tahun Baru
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </MuiTypography>
  );
}

const steps = ["Tambah Warga"];
