import { useEffect,useState } from "react";

import { useNavigate,useParams } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

import "../assets/css/editKamar.css";

import {

getKamarById,

updateKamar

}

from "../services/kamarService";

function EditKamar(){

const {id}=useParams();

const navigate=useNavigate();

const [form,setForm]=useState({

nomor_kamar:"",

tipe_kamar:"Deluxe Room",

harga:"",

status:"Tersedia",

gambar:"",

deskripsi:""

});

useEffect(()=>{

load();

},[]);

const load=async()=>{

const data=await getKamarById(id);

setForm(data);

};

const simpan=async(e)=>{

e.preventDefault();

await updateKamar(id,form);

alert("Data berhasil diubah");

navigate("/admin/kamar");

};

return(

<>

<Sidebar/>

<div className="main">

<Topbar/>

<div className="edit-container">

<h1>Edit Kamar</h1>

<form onSubmit={simpan}>

<label>Nomor Kamar</label>

<input

value={form.nomor_kamar}

onChange={(e)=>setForm({...form,nomor_kamar:e.target.value})}

/>

<label>Tipe Kamar</label>

<select

value={form.tipe_kamar}

onChange={(e)=>setForm({...form,tipe_kamar:e.target.value})}

>

<option>Deluxe Room</option>

<option>Family Room</option>

<option>Suite Room</option>

</select>

<label>Harga</label>

<input

type="number"

value={form.harga}

onChange={(e)=>setForm({...form,harga:e.target.value})}

/>

<label>Status</label>

<select

value={form.status}

onChange={(e)=>setForm({...form,status:e.target.value})}

>

<option>Tersedia</option>

<option>Terisi</option>

<option>Maintenance</option>

</select>

<label>Gambar</label>

<input

value={form.gambar}

onChange={(e)=>setForm({...form,gambar:e.target.value})}

/>

<label>Deskripsi</label>

<textarea

rows="5"

value={form.deskripsi}

onChange={(e)=>setForm({...form,deskripsi:e.target.value})}

/>

<div className="button-group">

<button type="submit">

Simpan Perubahan

</button>

<button

type="button"

onClick={()=>navigate("/admin/kamar")}

>

Batal

</button>

</div>

</form>

</div>

</div>

</>

);

}

export default EditKamar;