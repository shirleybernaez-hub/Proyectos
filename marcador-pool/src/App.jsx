import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 
import KFCPubli from './assets/kfcpubli.jpg'; // Importación de la nueva publicidad

export default function App() {
  const [data, setData] = useState(null);
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

  if (!data) return null;
  const enPartida = data.jugador1 && data.jugador1 !== "---";

  if (isTV) {
    return <TvView data={data} enPartida={enPartida} tiempoReal={tiempoReal} qrUrl={qrUrl} mesaId={mesaId} />;
  } else {
    return <MobileView data={data} enPartida={enPartida} tiempoReal={tiempoReal} mesaId={mesaId} db={db} />;
  }
}

// =========================================================
// --- VISTA TV (BIENVENIDA CON PUBLICIDAD REAL) ---
// =========================================================
function TvView({ data, enPartida, tiempoReal, qrUrl, mesaId }) {
  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden relative select-none">
      {!enPartida ? (
        <div className="absolute inset-[5%] flex gap-6"> 
          {/* BLOQUE IZQUIERDO */}
          <div className="w-[62%] h-full bg-[#1a1c1e] rounded-[2rem] relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-8 left-8">
              <span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">En Espera</span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pb-48">
              <img src={LogoBilliard} alt="Logo" className="w-[180px] object-contain opacity-90" />
            </div>

            {/* BARRA BLANCA - TIPOGRAFÍA AJUSTADA */}
            <div className="absolute bottom-0 left-0 w-full h-[180px] bg-white text-black flex items-center px-10 gap-8">
              <div className="w-[140px] h-[140px] bg-white flex-shrink-0 flex items-center justify-center p-2 border-2 border-black/5 rounded-lg">
                <QRCodeSVG value={qrUrl} size="100%" />
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                {/* Mesa Disponible en NEGRITA (BOLD) */}
                <p className="text-[12px] font-black tracking-[0.3em] uppercase mb-1 text-black">Mesa Disponible</p>
                {/* Texto: MAYÚSCULAS y un punto más pequeño */}
                <p className="text-[38px] font-light tracking-tighter leading-[0.85] break-words uppercase">
                  Escanea para<br/>comenzar a jugar
                </p>
              </div>
            </div>
          </div>

          {/* CUADRO DE PUBLICIDAD CON IMAGEN REAL */}
          <div className="w-[38%] h-full bg-[#111] rounded-[2rem] border border-white/5 relative overflow-hidden">
             <img src={KFCPubli} alt="Publicidad KFC" className="w-full h-full object-cover" />
             {/* Overlay sutil para indicar que es publicidad si la imagen no lo dice */}
             <span className="absolute top-6 right-6 text-[8px] tracking-[0.5em] text-white/30 uppercase font-bold">Publicidad</span>
          </div>
        </div>
      ) : (
        /* MARCADOR EN VIVO (INTACTO) */
        <div className="absolute inset-[4%] flex flex-col gap-6">
          <div className="h-[20%] bg-[#111] border border-white/10 rounded-[2rem] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[14vh] font-mono font-normal text-[#D4AF37] tracking-[0.1em] tabular-nums">{tiempoReal}</span>
            </div>
            <div className="absolute right-12 top-0 h-full flex flex-col justify-center text-right text-white/90">
              <p className="text-[1.5vh] uppercase opacity-30 tracking-[0.4em] leading-none">Mesa</p>
              <p className="text-[6vh] font-black leading-tight">{mesaId.replace("mesa", "")}</p>
            </div>
          </div>
          <div className="flex-1 flex gap-6">
            <div className="flex-1 bg-[#111] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden relative">
              <div className="bg-[#A2FF00] h-[15%] flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[3vh]">{data.jugador1}</div>
              <div className="flex-1 flex items-center justify-center text-white"><span className="text-[40vh] font-black leading-none">{data.puntos1}</span></div>
            </div>
            <div className="flex-1 bg-[#111] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden relative">
              <div className="bg-[#00A3FF] h-[15%] flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[3vh]">{data.jugador2}</div>
              <div className="flex-1 flex items-center justify-center text-white"><span className="text-[40vh] font-black leading-none">{data.puntos2}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// --- VISTA MÓVIL (PROTEGIDA) ---
// =========================================================
function MobileView({ data, enPartida, tiempoReal, mesaId, db }) {
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');

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
      await updateDoc(doc(db, "mesas", mesaId), { jugador1: "---", jugador2: "---", puntos1: 0, puntos2: 0, inicio: null });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col p-4 select-none">
      {!enPartida ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <img src={LogoBilliard} className="w-32 mb-10 opacity-80" alt="logo" />
          <div className="w-full max-w-xs space-y-4">
            <input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white text-center outline-none" placeholder="Equipo 1" value={nombre1} onChange={e => setNombre1(e.target.value)} />
            <input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white text-center outline-none" placeholder="Equipo 2" value={nombre2} onChange={e => setNombre2(e.target.value)} />
            <button onClick={iniciarPartida} className="w-full bg-white text-black font-black p-4 rounded-xl uppercase tracking-widest">Empezar</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center py-2">
            <button onClick={reiniciarPuntos} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase">Reiniciar</button>
            <div className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white/60">Mesa {mesaId.replace("mesa", "")}</div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div onClick={(e) => updateScore('puntos1', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative active:bg-[#151515]">
              <div className="bg-[#A2FF00] p-3 text-center text-black font-black uppercase text-xs">{data.jugador1}</div>
              <div className="flex-1 flex items-center justify-center text-[100px] font-black leading-none">{data.puntos1}</div>
              <div className="absolute left-0 bottom-0 w-24 h-24 flex items-center justify-center text-white/20 text-5xl" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
            </div>
            <div className="flex items-center justify-center py-1">
              <div className="bg-[#111] border border-white/5 px-8 py-2 rounded-xl text-3xl font-mono text-[#D4AF37]">{tiempoReal}</div>
            </div>
            <div onClick={(e) => updateScore('puntos2', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative active:bg-[#151515]">
              <div className="flex-1 flex items-center justify-center text-[100px] font-black leading-none">{data.puntos2}</div>
              <div className="bg-[#00A3FF] p-3 text-center text-black font-black uppercase text-xs">{data.jugador2}</div>
              <div className="absolute right-0 top-12 w-24 h-24 flex items-center justify-center text-white/20 text-5xl" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
            </div>
          </div>
          <button onClick={finalizarSesion} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase mt-2">Cerrar Mesa</button>
        </div>
      )}
    </div>
  );
}