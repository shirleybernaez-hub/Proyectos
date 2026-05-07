import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiard play.svg';

export default function App() {
  const [data, setData] = useState(null);
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [tiempoReal, setTiempoReal] = useState("00:00:00");

  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv';

  // ... dentro de export default function App() { ...

  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv';

  // --- CONFIGURACIÓN DINÁMICA DEL QR ---
  // Esto detecta si estás en localhost o en marcador-pool.vercel.app
  const baseUrl = window.location.origin; 
  const qrUrl = `${baseUrl}/?mesa=${mesaId}`;

// ... resto del código ...

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

  // Función de reinicio verificada
  const reiniciarPuntos = async () => {
    if(window.confirm("¿Reiniciar el marcador a cero?")) {
      try {
        await updateDoc(doc(db, "mesas", mesaId), {
          puntos1: 0,
          puntos2: 0
        });
      } catch (error) {
        console.error("Error al reiniciar:", error);
      }
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

  // --- VISTA TV (Manteniendo layout previo) ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white flex overflow-hidden font-sans">
        {!enPartida ? (
          <div className="flex w-full h-full">
            {/* ... Contenido de Espera ... */}
            <div className="w-[60%] flex flex-col h-full bg-[#24292E]">
              <div className="p-10 pb-0"><span className="bg-[#4C5FD5] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg text-white">En Espera</span></div>
              <div className="flex-1 flex items-center justify-center p-20 pt-0"><img src={LogoBilliard} alt="Logo" className="w-full max-w-xl" /></div>
              <div className="h-60 bg-white text-black flex items-center px-16 gap-12">
                <div className="p-2 bg-white rounded-lg shadow-2xl border border-black/5"><QRCodeSVG value={qrUrl} size={190} /></div>
                <div className="flex flex-col justify-center">
                  <p className="text-6xl font-light tracking-tighter uppercase mb-2">Mesa {mesaId.replace("mesa", "")} Disponible</p>
                  <p className="text-3xl font-light tracking-tight opacity-50 italic">Escanea para comenzar</p>
                </div>
              </div>
            </div>
            <div className="w-[40%] h-full bg-[#1A1A1A] flex flex-col justify-center items-center p-12 text-center text-white">
               <div className="w-full h-full rounded-2xl bg-[#222] border border-white/5 flex flex-col items-center justify-center p-20 relative">
                  <span className="absolute top-10 text-[10px] tracking-[0.5em] text-white/20 uppercase font-bold">Publicidad</span>
                  <p className="text-white/10 text-7xl font-light tracking-[0.1em] uppercase">Publicidad</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-8 gap-8 relative text-white">
            <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-4 bg-green-500/10 px-6 py-2 rounded-full border border-green-500/20">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_green]"></div>
                <span className="text-sm tracking-[0.5em] text-green-500 uppercase font-black">En Vivo</span>
              </div>
              <div className="bg-[#111] border border-white/10 px-16 py-4 rounded-xl shadow-2xl">
                <span className="text-6xl font-mono font-light text-[#D4AF37] tracking-[0.2em]">{tiempoReal}</span>
              </div>
              <div className="w-[120px]"></div>
            </div>
            <div className="flex-1 flex gap-8">
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#A2FF00] p-6 flex justify-between items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador1}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[480px] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#00A3FF] p-6 flex justify-between items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador2}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[480px] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
              </div>
            </div>
            <div className="flex justify-end pr-4">
              <div className="bg-[#111] border border-white/10 px-8 py-4 rounded-xl flex items-center gap-6 shadow-2xl">
                <span className="text-xl font-black text-white uppercase tracking-[0.3em]">Mesa {mesaId.replace("mesa", "")}</span>
                <div className="flex items-center gap-3 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Activa</span></div>
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
          <img src={LogoBilliard} className="w-40 mb-12 opacity-80" alt="logo" />
          <div className="w-full max-w-sm space-y-4">
            <input className="w-full bg-[#111] border border-white/10 p-5 rounded-xl outline-none" placeholder="Equipo 1" value={nombre1} onChange={e => setNombre1(e.target.value)} />
            <input className="w-full bg-[#111] border border-white/10 p-5 rounded-xl outline-none" placeholder="Equipo 2" value={nombre2} onChange={e => setNombre2(e.target.value)} />
            <button onClick={iniciarPartida} className="w-full bg-white text-black font-black p-5 rounded-xl uppercase tracking-widest active:scale-95 transition-all">Empezar</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col relative gap-4 pt-2">
          
          {/* HEADER SUPERIOR: REINICIAR (Izquierda) | MESA ACTIVA (Derecha) */}
          <div className="flex justify-between items-center px-1">
            <button 
              onClick={reiniciarPuntos} 
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Reiniciar</span>
            </button>

            <div className="bg-[#111] border border-white/10 px-5 py-2.5 rounded-xl flex items-center gap-4 shadow-2xl">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Mesa {mesaId.replace("mesa", "")}</span>
              <div className="flex items-center gap-2 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-green-500 uppercase">Activa</span>
              </div>
            </div>
          </div>

          {/* CARD EQUIPO 1 */}
          <div onClick={(e) => updateScore('puntos1', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="bg-[#A2FF00] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador1}</span><div className="w-8 h-1 bg-black/10"></div></div>
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
            <div className="absolute left-6 bottom-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
          </div>

          {/* CRONOMETRO */}
          <div className="flex items-center justify-center py-1">
             <div className="bg-[#111] border border-white/5 px-10 py-3 rounded-xl shadow-lg"><span className="text-4xl font-mono font-light tracking-[0.2em] text-white/80 tabular-nums">{tiempoReal}</span></div>
          </div>

          {/* CARD EQUIPO 2 */}
          <div onClick={(e) => updateScore('puntos2', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden active:bg-white/5 relative shadow-xl">
            <div className="flex-1 flex items-center justify-center"><span className="text-[230px] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
            {/* Texto en normal (removido italic) */}
            <div className="bg-[#00A3FF] p-4 flex justify-between items-center"><span className="text-black font-black uppercase tracking-widest text-xs">{data.jugador2}</span><div className="w-8 h-1 bg-black/10"></div></div>
            <div className="absolute right-6 top-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
          </div>

          {/* FOOTER: BOTÓN CERRAR MESA ALINEADO A LA DERECHA */}
          <div className="flex justify-end items-center px-1 pb-1">
            <button 
              onClick={finalizarSesion} 
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg active:scale-90 transition-all flex items-center"
            >
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Cerrar Mesa</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}