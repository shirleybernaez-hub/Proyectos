import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 

export default function App() {
  const [data, setData] = useState(null);
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [tiempoReal, setTiempoReal] = useState("00:00:00");

  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv'; 

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

  // --- VISTA TV: ESTRUCTURA DE FRANJAS RÍGIDAS ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans p-16 flex">
        {!enPartida ? (
          <div className="flex w-full h-full border border-white/10 rounded-[3rem] overflow-hidden">
            {/* LADO IZQUIERDO */}
            <div className="w-[65%] h-full bg-[#1a1c1e] flex flex-col relative border-r border-white/5">
              <div className="p-10"><span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-[0.4em]">En Espera</span></div>
              
              <div className="flex-1 flex items-center justify-center p-12 mb-40">
                <img src={LogoBilliard} alt="Logo" className="max-h-[220px] w-auto object-contain opacity-90" />
              </div>

              {/* FRANJA BLANCA FIJA (AL FONDO) */}
              <div className="absolute bottom-0 left-0 w-full h-[180px] bg-white text-black flex items-center px-12 gap-10">
                <div className="h-32 w-32 bg-white rounded-xl flex items-center justify-center p-4 shadow-xl border border-black/5">
                  <QRCodeSVG value={qrUrl} size="100%" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[14px] font-bold tracking-[0.2em] uppercase mb-1 text-black">Mesa {mesaId.replace("mesa", "")} Disponible</p>
                  <p className="text-4xl font-light tracking-tighter uppercase text-black leading-none">Escanea para comenzar</p>
                </div>
              </div>
            </div>

            {/* LADO DERECHO (PUBLICIDAD) */}
            <div className="w-[35%] h-full bg-[#111] flex flex-col items-center justify-center p-10 relative">
               <span className="absolute top-10 text-[10px] tracking-[0.6em] text-white/10 uppercase font-bold">Publicidad</span>
               <p className="text-white/5 text-7xl font-normal tracking-[0.1em] uppercase leading-none text-center">PUBLICIDAD</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-10 p-4">
             <div className="flex justify-between items-center bg-[#111] p-8 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-6 bg-green-500/10 px-8 py-3 rounded-full border border-green-500/20">
                   <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_green]"></div>
                   <span className="text-xl tracking-[0.4em] text-green-500 uppercase font-black">En Vivo</span>
                </div>
                <span className="text-7xl font-mono text-[#D4AF37] tracking-[0.2em] tabular-nums">{tiempoReal}</span>
                <p className="text-3xl font-black uppercase tracking-widest text-white/20">Mesa {mesaId.replace("mesa", "")}</p>
             </div>
             <div className="flex-1 grid grid-cols-2 gap-10">
                <div className="bg-[#111] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col">
                   <div className="bg-[#A2FF00] p-6 text-center"><span className="text-black font-black uppercase tracking-[0.3em] text-3xl">{data.jugador1}</span></div>
                   <div className="flex-1 flex items-center justify-center"><span className="text-[35vh] font-black">{data.puntos1}</span></div>
                </div>
                <div className="bg-[#111] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col">
                   <div className="bg-[#00A3FF] p-6 text-center"><span className="text-black font-black uppercase tracking-[0.3em] text-3xl">{data.jugador2}</span></div>
                   <div className="flex-1 flex items-center justify-center"><span className="text-[35vh] font-black">{data.puntos2}</span></div>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // VISTA MOVIL (Sin cambios)
  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col p-4 gap-4">
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
            <button onClick={reiniciarPuntos} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all shadow-lg"><span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Reiniciar</span></button>
            <div className="bg-[#111] border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-4 shadow-2xl"><span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Mesa {mesaId.replace("mesa", "")}</span></div>
          </div>
          <div onClick={(e) => updateScore('puntos1', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="bg-[#A2FF00] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador1}</span></div>
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
          </div>
          <div className="flex items-center justify-center py-1 font-normal"><div className="bg-[#111] border border-white/5 px-10 py-3 rounded-xl shadow-lg"><span className="text-4xl font-mono tracking-[0.2em]">{tiempoReal}</span></div></div>
          <div onClick={(e) => updateScore('puntos2', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
            <div className="bg-[#00A3FF] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador2}</span></div>
          </div>
          <div className="flex justify-end items-center px-1 pb-1">
            <button onClick={finalizarSesion} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all flex items-center shadow-lg"><span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Cerrar Mesa</span></button>
          </div>
        </div>
      )}
    </div>
  );
}