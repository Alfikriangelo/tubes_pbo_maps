import React, { useState, useRef } from 'react'
import Isi from '../Components/Surat/Isi'
import Pembuka from '../Components/Surat/Pembuka'
import Header from '../Components/Surat/Header'
import Judul from '../Components/Surat/Judul'
import Penutup from '../Components/Surat/Penutup'
import { TextField } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import SignatureCanvas from 'react-signature-canvas';
import dayjs from 'dayjs'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';


const Surat = () => {
    const navigate = useNavigate();
    const [showInvoice, setShowInvoice] = useState(false)
    const [nomorSurat, setNomorSurat] = useState("")
    const [nama, setNama] = useState("")
    const [ttl, setTtl] = useState("")
    const [pekerjaan, setPekerjaan] = useState("")
    const [pendidikanTerakhir, setPendidikanTerakhir] = useState("")
    const [keteranganSurat, setKeteranganSurat] = useState("")
    const [blok, setBlok] = useState("")
    const [noRumah, setNoRumah] = useState("")
    const [tanggal, setTanggal] = useState([dayjs(), dayjs()])

    const componentRef = useRef()
    const signatureRef = useRef()

    const handlePrint = () => {
        window.print()
    }

    const clearSignature = () => {
        signatureRef.current.clear();
    };

    const handleDownload = () => {
        const content = componentRef.current;
        const pdfConfig = {
            margin: 5,
            padding: 10,
        };

        const fileName = `surat_${nomorSurat}_${nama}.pdf`;

        // Send the file name and "nama" to the backend
        fetch('http://127.0.0.1:5000/save_file_name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nama, fileName }),
        })
            .then(response => response.json())
            .then(data => {
                // After sending the file name and "nama" to the backend, generate and download the PDF
                html2pdf().from(content).set(pdfConfig).save(fileName);
            })
            .catch(error => {
                console.error('Error sending file name and "nama" to the backend:', error);
            });
    };





    return (
        <>
            <main className='m-5 p-10 md:max-w-xl md:mx-auto lg:max-w-2xl xl:max-w-4xl bg-white rounded shadow'>

                {showInvoice ? (
                    <>
                        <div className='flex' style={{ justifyContent: "space-between" }}>
                            <Button
                                variant='outlined'
                                onClick={() => navigate('/maps')}
                                style={
                                    { textTransform: 'none' }}
                            >
                                Kembali
                            </Button>
                            <Button
                                variant='contained'
                                onClick={handleDownload}
                                style={{ textTransform: 'none' }}
                            >
                                Download
                            </Button>
                        </div>
                        <div ref={componentRef} className='p-5'>
                            <Header handlePrint={handlePrint} />


                            <Judul nomorSurat={nomorSurat} />

                            <Pembuka />

                            <Isi
                                nama={nama}
                                ttl={ttl}
                                pekerjaan={pekerjaan}
                                pendidikanTerakhir={pendidikanTerakhir}
                                blok={blok}
                                noRumah={noRumah}
                                keteranganSurat={keteranganSurat}
                                tanggal={tanggal}
                            />

                            <Penutup />

                            <p className="text-right mt-10 mr-2">Ketua Rukun Tetangga 05</p>

                            <div className="text-right mt-10">
                                <SignatureCanvas
                                    ref={signatureRef}
                                    canvasProps={{ width: 400, height: 200, className: 'signature-canvas ml-auto' }}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <button className='bg-red-500 mb-5 text-white font-bold py-2 px-8 rounded shadow border-2 border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-300 ml-auto' onClick={clearSignature}>Hapus</button>
                        </div>
                        <button onClick={() => setShowInvoice(false)} className='mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300'>Edit</button>
                    </>
                ) : (
                    <>
                        <p className='font-bold text-3xl mb-3 text-center'>Surat</p>
                        <div className='flex flex-col justify-center'>
                            <label htmlFor='nomorSurat' className='mb-2'>Nomor Surat</label>
                            <TextField type='text' name='text' id='nomorSurat' placeholder='' autoComplete='off' value={nomorSurat} onChange={(e) => setNomorSurat(e.target.value)} />

                            <label htmlFor='nama' className='mb-2 mt-2'>Nama</label>
                            <TextField type='text' name='text' id='nama' placeholder='' autoComplete='off' value={nama} onChange={(e) => setNama(e.target.value)} />

                            <label htmlFor='ttl' className='mb-2 mt-2'>Tempat / Tanggal Lahir</label>
                            <TextField type='text' name='text' id='ttl' placeholder='' autoComplete='off' value={ttl} onChange={(e) => setTtl(e.target.value)} />

                            <label htmlFor='pekerjaan' className='mb-2 mt-2'>Pekerjaan</label>
                            <TextField type='text' name='text' id='pekerjaan' placeholder='' autoComplete='off' value={pekerjaan} onChange={(e) => setPekerjaan(e.target.value)} />

                            <label htmlFor='pendidikanTerakhir' className='mb-2 mt-2'>Pendidikan Terakhir</label>
                            <TextField type='text' name='text' id='pendidikanTerakhir' placeholder='' autoComplete='off' value={pendidikanTerakhir} onChange={(e) => setPendidikanTerakhir(e.target.value)} />

                            <label htmlFor='Blok' className='mb-2 mt-2'>Blok</label>
                            <TextField type='text' name='text' id='blok' placeholder='' autoComplete='off' value={blok} onChange={(e) => setBlok(e.target.value)} />

                            <label htmlFor='noRumah' className='mb-2 mt-2'>No Rumah</label>
                            <TextField type='text' name='text' id='noRumah' placeholder='' autoComplete='off' value={noRumah} onChange={(e) => setNoRumah(e.target.value)} />



                            <label htmlFor="notes" className='mb-2 mt-2'>Keterangan</label>
                            <textarea className='mt-2 mb-2' name="keterangan" id="notes" cols="30" rows="10" placeholder='Keterangan Surat' value={keteranganSurat} onChange={(e) => setKeteranganSurat(e.target.value)}></textarea>

                            <div className='mt-5 mb-5'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateRangePicker']} >
                                        <DateRangePicker localeText={{ start: 'Dari', end: 'Sampai' }} value={tanggal} onChange={setTanggal} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>

                            <div className="flex" style={{ justifyContent: "space-between" }}>
                                <Button variant='outlined' onClick={() => navigate("/maps")}>Kembali</Button>
                                <Button variant='contained' onClick={() => setShowInvoice(true)}>Kirim</Button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    )
}

export default Surat 