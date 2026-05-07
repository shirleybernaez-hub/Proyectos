import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; // Actualizado a .png y nuevo nombre

export default function App() {
  const [data, setData] = useState(null);
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [tiempoReal, setTiempoReal] = useState("00:00:00");

  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv';

  // Configuración dinámica del QR
  const baseUrl = window.location.origin; 
  const qrUrl = `${baseUrl}/?mesa=${mesaId}`;

  useEffect(() => {
    const timer = setInterval(() => {
      if (data?.inicio) {
        const inicio = typeof data.inicio === 'number' ? data.inicio : new Date(data.inicio).getTime();
        const ahora = new Date().getTime();
        const diff = Math.floor((ahora - inicio) / 1000);
        if (diff < 0) return;
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setTiempoReal(`${h}:${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "mesas", mesaId), (docSnap) => {
      if (docSnap.exists()) setData(docSnap.data());
    });
    return () => unsub();
  }, [mesaId]);

  const iniciarPartida = async () => {
    if (!nombre1 || !nombre2) return alert("Introduce los nombres");
    await updateDoc(doc(db, "mesas", mesaId), {
      jugador1: nombre1,
      jugador2: nombre2,
      puntos1: 0,
      puntos2: 0,
      inicio: new Date().getTime()
    });
  };

  const updateScore = async (campo, valor, e) => {
    e.stopPropagation();
    await updateDoc(doc(db, "mesas", mesaId), {
      [campo]: Math.max(0, Number(data[campo]) + valor)
    });
  };

  const reiniciarPuntos = async () => {
    if(window.confirm("¿Reiniciar el marcador a cero?")) {
      await updateDoc(doc(db, "mesas", mesaId), { puntos1: 0, puntos2: 0 });
    }
  };

  const finalizarSesion = async () => {
    if(window.confirm("¿Finalizar la sesión y cerrar la mesa?")) {
      await updateDoc(doc(db, "mesas", mesaId), { 
        jugador1: "---", 
        jugador2: "---", 
        puntos1: 0, 
        puntos2: 0, 
        inicio: null 
      });
    }
  };

  if (!data) return null;
  const enPartida = data.jugador1 && data.jugador1 !== "---";

  // --- VISTA TV: ESTRUCTURA PARA 43" ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans p-6">
        {!enPartida ? (
          <div className="grid grid-cols-10 h-full gap-6">
            <div className="col-span-6 bg-[#24292E] rounded-[2rem] flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="p-10"><span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-[0.3em]">En Espera</span></div>
              <div className="flex-1 flex items-center justify-center p-10">
                <img src={LogoBilliard} alt="Logo" className="w-[70%] object-contain" />
              </div>
              <div className="bg-white text-black flex items-center p-10 gap-10">
                <div className="bg-white p-2 rounded-xl shadow-xl"><QRCodeSVG value={qrUrl} size={150} /></div>
                <div>
                  <p className="text-5xl font-black uppercase leading-none mb-2">Mesa {mesaId.replace("mesa", "")}</p>
                  <p className="text-xl opacity-50 uppercase tracking-widest font-light">Escanea para jugar</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 bg-[#111] rounded-[2rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
               <span className="absolute top-10 text-[10px] tracking-[1em] text-white/20 uppercase">Publicidad</span>
               <p className="text-white/5 text-7xl font-black uppercase -rotate-90">ONSHIFT</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            <div className="h-[15vh] flex justify-between items-center px-4">
              <div className="flex items-center gap-4 bg-green-500/10 px-8 py-3 rounded-full border border-green-500/20">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xl tracking-[0.5em] text-green-500 uppercase font-black">En Vivo</span>
              </div>
              <div className="bg-[#111] border border-white/10 px-20 py-4 rounded-2xl shadow-2xl">
                <span className="text-7xl font-mono text-[#D4AF37] tracking-widest">{tiempoReal}</span>
              </div>
              <div className="text-right">
                <p className="text-white/20 text-xs uppercase tracking-[0.5em] mb-1">Mesa</p>
                <p className="text-4xl font-black uppercase tracking-tighter">{mesaId.replace("mesa", "")}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-[#0a0a0a] border-2 border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#A2FF00] py-4 px-10"><span className="text-black font-black uppercase tracking-[0.4em] text-3xl">{data.jugador1}</span></div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-transparent to-white/5">
                  <span className="text-[55vh] font-black leading-none tabular-nums text-white">{data.puntos1}</span>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border-2 border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#00A3FF] py-4 px-10"><span className="text-black font-black uppercase tracking-[0.4em] text-3xl">{data.jugador2}</span></div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-transparent to-white/5">
                  <span className="text-[55vh] font-black leading-none tabular-nums text-white">{data.puntos2}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- VISTA MÓVIL ---
  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col select-none p-4 gap-4">
      {!enPartida ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          <img src={LogoBilliard} className="w-40 mb-12 opacity-80 object-contain" alt="logo" />
          <div className="w-full max-w-sm space-y-4">
            <input className="w-full bg-[#111] border border-white/10 p-5 rounded-xl outline-none" placeholder="Equipo 1" value={nombre1} onChange={e => setNombre1(e.target.value)} />
            <input className="w-full bg-[#111] border border-white/10 p-5 rounded-xl outline-none" placeholder="Equipo 2" value={nombre2} onChange={e => setNombre2(e.target.value)} />
            <button onClick={iniciarPartida} className="w-full bg-white text-black font-black p-5 rounded-xl uppercase tracking-widest active:scale-95 transition-all">Empezar</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative gap-4 pt-2">
          <div className="flex justify-between items-center px-1">
            <button onClick={reiniciarPuntos} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all shadow-lg">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Reiniciar</span>
            </button>
            <div className="bg-[#111] border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-4 shadow-2xl">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Mesa {mesaId.replace("mesa", "")}</span>
            </div>
          </div>

          <div onClick={(e) => updateScore('puntos1', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="bg-[#A2FF00] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador1}</span></div>
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
            <div className="absolute left-6 bottom-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
          </div>

          <div className="flex items-center justify-center py-1">
             <div className="bg-[#111] border border-white/5 px-10 py-3 rounded-xl shadow-lg"><span className="text-4xl font-mono font-light tracking-[0.2em] text-white/80 tabular-nums">{tiempoReal}</span></div>
          </div>

          <div onClick={(e) => updateScore('puntos2', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
            <div className="bg-[#00A3FF] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador2}</span></div>
            <div className="absolute right-6 top-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
          </div>

          <div className="flex justify-end items-center px-1 pb-1">
            <button onClick={finalizarSesion} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all flex items-center shadow-lg">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Cerrar Mesa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}