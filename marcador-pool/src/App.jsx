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

  // =========================================================
  // --- VISTA TV: DISEÑO DE REJILLA RÍGIDA ANTI-FALLOS ---
  // He usado Grid con áreas fijas y márgenes de seguridad
  // para que Silk Browser no pueda amontonar nada.
  // =========================================================
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans p-10 select-none">
        {/* p-10 es el MARGEN DE SEGURIDAD contra recortes físicos de la TV */}
        
        {!enPartida ? (
          <div className="grid grid-cols-10 h-full gap-5">
            {/* COLUMNA IZQUIERDA (60% del ancho) - Grid Interno */}
            <div className="col-span-6 grid grid-rows-10 h-full bg-[#1a1c1e] rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative">
              
              {/* Row 1-2: Cabecera */}
              <div className="row-span-2 p-8 flex justify-between items-start">
                <span className="bg-[#4C5FD5] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">En Espera</span>
                <div className="text-right">
                  <p className="text-[10px] uppercase opacity-40 tracking-[0.4em]">Mesa</p>
                  <p className="text-3xl font-black">{mesaId.replace("mesa", "")}</p>
                </div>
              </div>

              {/* Row 3-7: Logo (Área grande y central) */}
              <div className="row-span-5 flex items-center justify-center p-10">
                <img src={LogoBilliard} alt="Logo" className="max-h-full w-auto object-contain opacity-80" />
              </div>

              {/* Row 8-10: Bloque Blanco (Anclado rígidamente abajo) */}
              <div className="row-span-3 bg-white text-black flex items-center px-10 gap-8 min-h-[220px]">
                {/* QR con tamaño fijo */}
                <div className="w-36 h-36 bg-white rounded-xl flex items-center justify-center p-4 shadow-xl border border-black/5">
                  <QRCodeSVG value={qrUrl} size="100%" />
                </div>
                {/* Textos con jerarquía corregida y SIN italic */}
                <div className="flex flex-col justify-center">
                  <p className="text-[12px] font-bold tracking-[0.3em] uppercase mb-1 text-black opacity-60">Mesa Disponible</p>
                  <p className="text-4xl font-light tracking-tighter uppercase leading-tight text-black">Escanea para comenzar</p>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (40% del ancho) - Publicidad */}
            <div className="col-span-4 h-full bg-[#111] rounded-3xl border border-white/5 flex flex-col justify-center items-center p-12 text-center text-white relative overflow-hidden">
               <span className="absolute top-10 text-[10px] tracking-[0.6em] text-white/20 uppercase font-bold w-full text-center">Espacio Disponible</span>
               <p className="text-white/10 text-6xl font-normal tracking-[0.1em] uppercase leading-nonetext-center">PUBLICIDAD</p>
            </div>
          </div>
        ) : (
          /* Marcador en Vivo (También con estructura rígida) */
          <div className="grid grid-rows-10 h-full gap-5">
            {/* Header: Tiempo */}
            <div className="row-span-2 bg-[#111] border border-white/10 rounded-3xl p-6 flex justify-between items-center shadow-2xl">
              <div className="flex items-center gap-6 bg-green-500/10 px-8 py-3 rounded-full border border-green-500/20">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_green]"></div>
                <span className="text-xl tracking-[0.4em] text-green-500 uppercase font-black">En Vivo</span>
              </div>
              <span className="text-8xl font-mono font-normal text-[#D4AF37] tracking-[0.2em] tabular-nums">{tiempoReal}</span>
              <div className="text-right p-4 border border-white/5 rounded-xl bg-[#050505]"><p className="text-[10px] uppercase opacity-30 tracking-[0.4em]">Mesa</p><p className="text-3xl font-black">{mesaId.replace("mesa", "")}</p></div>
            </div>
            
            {/* Scores */}
            <div className="row-span-8 grid grid-cols-2 gap-5">
              <div className="bg-[#111] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
                <div className="bg-[#A2FF00] p-6 text-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador1}</span></div>
                <div className="flex-1 flex items-center justify-center p-10"><span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
                <div className="absolute left-6 bottom-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
              </div>
              <div className="bg-[#111] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
                <div className="bg-[#00A3FF] p-6 text-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador2}</span></div>
                <div className="flex-1 flex items-center justify-center p-10"><span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
                <div className="absolute right-6 top-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
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
            <button onClick={reiniciarPuntos} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all shadow-lg"><span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Reiniciar</span></button>
            <div className="bg-[#111] border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-4 shadow-2xl"><span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Mesa {mesaId.replace("mesa", "")}</span></div>
          </div>
          <div onClick={(e) => updateScore('puntos1', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="bg-[#A2FF00] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador1}</span></div>
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
            <div className="absolute left-6 bottom-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
          </div>
          <div className="flex items-center justify-center py-1 font-normal"><div className="bg-[#111] border border-white/5 px-10 py-3 rounded-xl shadow-lg"><span className="text-4xl font-mono tracking-[0.2em] text-white/80 tabular-nums">{tiempoReal}</span></div></div>
          <div onClick={(e) => updateScore('puntos2', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
            <div className="bg-[#00A3FF] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador2}</span></div>
            <div className="absolute right-6 top-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
          </div>
          <div className="flex justify-end items-center px-1 pb-1">
            <button onClick={finalizarSesion} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all flex items-center shadow-lg"><span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Cerrar Mesa</span></button>
          </div>
        </div>
      )}
    </div>
  );
}