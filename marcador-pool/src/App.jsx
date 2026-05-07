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

  if (isTV) {
    return (
      <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden relative">
        {!enPartida ? (
          <div className="absolute inset-[4%] flex gap-6"> 
            <div className="w-[60%] h-full bg-[#1a1c1e] rounded-[2rem] relative overflow-hidden border border-white/5">
              <div className="absolute top-10 left-10">
                <span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">En Espera</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pb-64">
                <img src={LogoBilliard} alt="Logo" className="w-[150px] object-contain opacity-80" />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[240px] bg-white text-black flex items-center px-12">
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-4 border border-black/5">
                  <QRCodeSVG value={qrUrl} size="100%" />
                </div>
                <div className="pl-10 flex flex-col justify-center">
                  <p className="text-[1.2vw] font-bold tracking-[0.3em] uppercase mb-1 opacity-60">Mesa Disponible</p>
                  <p className="text-[4vw] font-light tracking-tighter uppercase leading-[0.95]">Escanea para<br/>comenzar</p>
                </div>
              </div>
            </div>
            <div className="w-[40%] h-full bg-[#111] rounded-[2rem] border border-white/5 flex items-center justify-center">
               <p className="text-white/5 text-7xl font-normal tracking-[0.1em] uppercase">PUBLICIDAD</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-[4%] flex flex-col gap-6">
            <div className="h-[20%] bg-[#111] border border-white/10 rounded-[2rem] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[14vh] font-mono font-normal text-[#D4AF37] tracking-[0.1em] tabular-nums">{tiempoReal}</span>
              </div>
              <div className="absolute right-12 top-0 h-full flex flex-col justify-center text-right">
                <p className="text-[1.5vh] uppercase opacity-30 tracking-[0.4em] leading-none">Mesa</p>
                <p className="text-[6vh] font-black text-white/90 leading-tight">{mesaId.replace("mesa", "")}</p>
              </div>
            </div>
            <div className="flex-1 flex gap-6">
              <div className="flex-1 bg-[#111] rounded-[3rem] border border-white/5 flex flex-col relative overflow-hidden">
                <div className="bg-[#A2FF00] h-[15%] flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[3vh]">{data.jugador1}</div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none">{data.puntos1}</span></div>
              </div>
              <div className="flex-1 bg-[#111] rounded-[3rem] border border-white/5 flex flex-col relative overflow-hidden">
                <div className="bg-[#00A3FF] h-[15%] flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[3vh]">{data.jugador2}</div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none">{data.puntos2}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // VISTA MÓVIL REPARADA (Z-INDEX Y ESTRUCTURA LIMPIA)
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col p-4 gap-4 overflow-y-auto">
      {!enPartida ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <img src={LogoBilliard} className="w-32 mb-10 opacity-80 object-contain" alt="logo" />
          <div className="w-full max-w-xs space-y-4">
            <input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none text-white focus:border-white/30" placeholder="Equipo 1" value={nombre1} onChange={e => setNombre1(e.target.value)} />
            <input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none text-white focus:border-white/30" placeholder="Equipo 2" value={nombre2} onChange={e => setNombre2(e.target.value)} />
            <button onClick={iniciarPartida} className="w-full bg-white text-black font-black p-4 rounded-xl uppercase tracking-widest active:bg-gray-200">Empezar</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 relative">
          <div className="flex justify-between items-center py-2">
            <button onClick={reiniciarPuntos} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-wider">Reiniciar</button>
            <div className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider">Mesa {mesaId.replace("mesa", "")}</div>
          </div>
          
          <div onClick={(e) => updateScore('puntos1', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative active:bg-[#111]">
            <div className="bg-[#A2FF00] p-3 text-center text-black font-black uppercase text-xs tracking-widest">{data.jugador1}</div>
            <div className="flex-1 flex items-center justify-center text-[120px] font-black">{data.puntos1}</div>
            <div className="absolute left-4 bottom-4 w-14 h-14 flex items-center justify-center text-white/20 text-3xl z-20" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="bg-[#111] border border-white/5 px-8 py-2 rounded-xl text-3xl font-mono">{tiempoReal}</div>
          </div>

          <div onClick={(e) => updateScore('puntos2', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative active:bg-[#111]">
            <div className="flex-1 flex items-center justify-center text-[120px] font-black">{data.puntos2}</div>
            <div className="bg-[#00A3FF] p-3 text-center text-black font-black uppercase text-xs tracking-widest">{data.jugador2}</div>
            <div className="absolute right-4 top-16 w-14 h-14 flex items-center justify-center text-white/20 text-3xl z-20" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
          </div>

          <button onClick={finalizarSesion} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest mt-2 active:bg-red-500/20">Cerrar Mesa</button>
        </div>
      )}
    </div>
  );
}