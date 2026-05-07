import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 

// =========================================================
// --- COMPONENTE PRINCIPAL ---
// =========================================================
export default function App() {
  const [data, setData] = useState(null);
  const [tiempoReal, setTiempoReal] = useState("00:00:00");

  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv'; 

  const baseUrl = window.location.origin; 
  const qrUrl = `${baseUrl}/?mesa=${mesaId}`;

  // Lógica del Cronómetro
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

  // Suscripción a Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "mesas", mesaId), (docSnap) => {
      if (docSnap.exists()) setData(docSnap.data());
    });
    return () => unsub();
  }, [mesaId]);

  if (!data) return null;
  const enPartida = data.jugador1 && data.jugador1 !== "---";

  // =========================================================
  // --- RENDERIZADO CONDICIONAL FÍSICO ---
  // =========================================================
  if (isTV) {
    // Si es TV, renderiza el código blindado (Este NO toca el móvil)
    return <TvView data={data} enPartida={enPartida} tiempoReal={tiempoReal} qrUrl={qrUrl} mesaId={mesaId} />;
  } else {
    // Si es Móvil, renderiza el código limpio (Este recupera los clics)
    return <MobileView data={data} enPartida={enPartida} tiempoReal={tiempoReal} mesaId={mesaId} db={db} />;
  }
}

// =========================================================
// --- VISTA TV (Blindada) ---
// =========================================================
function TvView({ data, enPartida, tiempoReal, qrUrl, mesaId }) {
  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden relative select-none">
      {!enPartida ? (
        <div className="absolute inset-[4%] flex gap-6"> 
          <div className="w-[60%] h-full bg-[#1a1c1e] rounded-[2rem] relative overflow-hidden border border-white/5">
            <div className="absolute top-10 left-10"><span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg text-white">En Espera</span></div>
            <div className="absolute inset-0 flex items-center justify-center pb-64"><img src={LogoBilliard} alt="Logo" className="w-[180px] object-contain opacity-80" /></div>
            <div className="absolute bottom-0 left-0 w-full h-[240px] bg-white text-black flex items-center px-12 gap-10">
              <div className="min-w-[160px] min-h-[160px] bg-white rounded-xl flex items-center justify-center p-4 border border-black/5 shadow-xl"><QRCodeSVG value={qrUrl} size="100%" /></div>
              <div className="flex flex-col justify-center text-black">
                <p className="text-[1.2vw] font-bold tracking-[0.3em] uppercase mb-1 opacity-60">Mesa Disponible</p>
                <p className="text-[4.5vw] font-light tracking-tighter uppercase leading-[0.9]">Escanea para<br/>comenzar</p>
              </div>
            </div>
          </div>
          <div className="w-[40%] h-full bg-[#111] rounded-[2rem] border border-white/5 flex items-center justify-center text-white/5 text-7xl font-normal tracking-[0.1em] uppercase">PUBLICIDAD</div>
        </div>
      ) : (
        <div className="absolute inset-[4%] flex flex-col gap-6">
          <div className="h-[20%] bg-[#111] border border-white/10 rounded-[2rem] relative">
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-[14vh] font-mono font-normal text-[#D4AF37] tracking-[0.1em] tabular-nums">{tiempoReal}</span></div>
            <div className="absolute right-12 top-0 h-full flex flex-col justify-center text-right text-white/90">
              <p className="text-[1.5vh] uppercase opacity-30 tracking-[0.4em] leading-none">Mesa</p>
              <p className="text-[6vh] font-black leading-tight">{mesaId.replace("mesa", "")}</p>
            </div>
          </div>
          <div className="flex-1 flex gap-6">
            <div className="flex-1 bg-[#111] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden relative text-white">
              <div className="bg-[#A2FF00] h-[15%] flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[3vh]">{data.jugador1}</div>
              <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none">{data.puntos1}</span></div>
            </div>
            <div className="flex-1 bg-[#111] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden relative text-white">
              <div className="bg-[#00A3FF] h-[15%] flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[3vh]">{data.jugador2}</div>
              <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none">{data.puntos2}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// --- VISTA MÓVIL (Limpia y Vertical) ---
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
      await updateDoc(doc(db, "mesas", mesaId), { 
        jugador1: "---", 
        jugador2: "---", 
        puntos1: 0, 
        puntos2: 0, 
        inicio: null 
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col p-4 select-none overflow-y-auto">
      {!enPartida ? (
        // Pantalla Login Móvil
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <img src={LogoBilliard} className="w-32 mb-10 opacity-80 object-contain" alt="logo" />
          <div className="w-full max-w-xs space-y-4">
            <input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none text-white text-center" placeholder="Equipo 1" value={nombre1} onChange={e => setNombre1(e.target.value)} />
            <input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl outline-none text-white text-center" placeholder="Equipo 2" value={nombre2} onChange={e => setNombre2(e.target.value)} />
            <button onClick={iniciarPartida} className="w-full bg-white text-black font-black p-4 rounded-xl uppercase tracking-widest active:bg-gray-200 transition-colors">Empezar</button>
          </div>
        </div>
      ) : (
        // Marcador Móvil (Vertical por defecto)
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center py-2">
            <button onClick={reiniciarPuntos} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-wider text-white active:bg-white/10">Reiniciar</button>
            <div className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-white/60">Mesa {mesaId.replace("mesa", "")}</div>
          </div>
          
          {/* Contenedor Vertical (flex-col) */}
          <div className="flex-1 flex flex-col gap-4">
            
            {/* Jugador 1 - Ocupa espacio disponible */}
            <div onClick={(e) => updateScore('puntos1', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative active:bg-[#151515] touch-manipulation">
              <div className="bg-[#A2FF00] p-3 text-center text-black font-black uppercase text-xs tracking-widest">{data.jugador1}</div>
              <div className="flex-1 flex items-center justify-center text-[120px] font-black tabular-nums text-white leading-none">{data.puntos1}</div>
              {/* Botón de resta grande en la esquina */}
              <div className="absolute left-0 bottom-0 w-24 h-24 flex items-center justify-center text-white/20 text-5xl active:text-white/50" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
            </div>

            {/* Tiempo central */}
            <div className="flex items-center justify-center py-1">
              <div className="bg-[#111] border border-white/5 px-8 py-2 rounded-xl text-3xl font-mono text-[#D4AF37]">{tiempoReal}</div>
            </div>

            {/* Jugador 2 - Ocupa espacio disponible */}
            <div onClick={(e) => updateScore('puntos2', 1, e)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative active:bg-[#151515] touch-manipulation">
              <div className="flex-1 flex items-center justify-center text-[120px] font-black tabular-nums text-white leading-none">{data.puntos2}</div>
              <div className="bg-[#00A3FF] p-3 text-center text-black font-black uppercase text-xs tracking-widest">{data.jugador2}</div>
              {/* Botón de resta grande en la esquina */}
              <div className="absolute right-0 top-12 w-24 h-24 flex items-center justify-center text-white/20 text-5xl active:text-white/50" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
            </div>
          </div>

          <button onClick={finalizarSesion} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest mt-2 active:bg-red-500/20 text-white">Cerrar Mesa</button>
        </div>
      )}
    </div>
  );
}