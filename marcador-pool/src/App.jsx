import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 
import KFCPubli from './assets/kfcpubli.jpg'; 

// --- ICONOS SVG ---
const IconPencil = () => <svg className="w-3 h-3 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IconPlay = () => <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const IconPause = () => <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const IconReset = () => <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const IconChevron = () => <svg className="w-3 h-3 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>;

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

// --- SHOT CLOCK (SINCRONIZADO CON FIREBASE) ---
function ShotClock({ data, mesaId }) {
  const maxTime = data.maxShot || 30;
  const timeLeft = data.tiempoShot !== undefined ? data.tiempoShot : maxTime;
  const isActive = data.shotActive || false;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(async () => {
        await updateDoc(doc(db, "mesas", mesaId), {
          tiempoShot: timeLeft - 1
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      updateDoc(doc(db, "mesas", mesaId), { shotActive: false });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mesaId]);

  const togglePlay = () => updateDoc(doc(db, "mesas", mesaId), { shotActive: !isActive });
  const resetClock = () => updateDoc(doc(db, "mesas", mesaId), { shotActive: false, tiempoShot: maxTime });
  
  const handleMaxTimeChange = (e) => {
    const val = parseInt(e.target.value);
    updateDoc(doc(db, "mesas", mesaId), { maxShot: val, tiempoShot: val, shotActive: false });
  };

  const getBarColor = () => {
    const elapsed = maxTime - timeLeft;
    if (elapsed >= 20) return '#ef4444';
    if (elapsed >= 10) return '#facc15';
    return '#f97316';
  };

  const progress = ((maxTime - timeLeft) / maxTime) * 100;

  return (
    <div className="w-full flex flex-col items-start">
      <button onClick={resetClock} className="mb-2 ml-1 flex items-center text-[10px] font-black uppercase tracking-widest text-white/40">
        <IconReset /> Reiniciar Tiempo
      </button>
      <div className="w-full bg-[#111] p-4 rounded-2xl border border-white/5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <button onClick={togglePlay} className="flex items-center text-white font-black uppercase text-[12px] tracking-widest">
            {isActive ? <IconPause /> : <IconPlay />} {isActive ? 'Pausa' : 'Play'}
          </button>
          <div className="relative flex items-center">
            <select value={maxTime} onChange={handleMaxTimeChange}
              className="appearance-none bg-transparent text-white font-bold text-[12px] pr-4 outline-none">
              <option value={30} className="bg-black">30 SEG</option>
              <option value={40} className="bg-black">40 SEG</option>
              <option value={60} className="bg-black">60 SEG</option>
            </select>
            <div className="pointer-events-none absolute right-0"><IconChevron /></div>
          </div>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%`, backgroundColor: getBarColor() }} />
        </div>
      </div>
    </div>
  );
}

// --- VISTA TV (AHORA MUESTRA LA BARRA) ---
function TvView({ data, enPartida, tiempoReal, qrUrl, mesaId }) {
  const maxTime = data.maxShot || 30;
  const timeLeft = data.tiempoShot !== undefined ? data.tiempoShot : maxTime;
  const progress = ((maxTime - timeLeft) / maxTime) * 100;
  
  const getBarColor = () => {
    const elapsed = maxTime - timeLeft;
    if (elapsed >= 20) return '#ef4444';
    if (elapsed >= 10) return '#facc15';
    return '#f97316';
  };

  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden relative select-none">
      {!enPartida ? (
        <div className="absolute inset-[5%] flex gap-6"> 
          <div className="w-[62%] h-full bg-[#1a1c1e] rounded-[2rem] relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-8 left-8"><span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">En Espera</span></div>
            <div className="absolute inset-0 flex items-center justify-center pb-48"><img src={LogoBilliard} alt="Logo" className="w-[180px] object-contain opacity-90" /></div>
            <div className="absolute bottom-0 left-0 w-full h-[180px] bg-white text-black flex items-center px-10 gap-8">
              <div className="w-[140px] h-[140px] bg-white flex-shrink-0 flex items-center justify-center p-2 border-2 border-black/5 rounded-lg"><QRCodeSVG value={qrUrl} size="100%" /></div>
              <div className="flex flex-col justify-center overflow-hidden"><p className="text-[12px] font-black tracking-[0.3em] uppercase mb-1 text-black opacity-40">Mesa Disponible</p><p className="text-[38px] font-light tracking-tighter leading-[0.85] uppercase">Escanea para<br/>comenzar a jugar</p></div>
            </div>
          </div>
          <div className="w-[38%] h-full bg-[#111] rounded-[2rem] border border-white/5 relative overflow-hidden"><img src={KFCPubli} alt="Publicidad" className="w-full h-full object-cover" /></div>
        </div>
      ) : (
        <div className="absolute inset-[4%] flex flex-col gap-4">
          <div className="flex justify-between items-center px-4">
            <span className="text-3xl font-black text-white tracking-[0.2em] uppercase">MESA {mesaId.replace("mesa", "")}</span>
            <div className="bg-[#111] border border-white px-6 py-2 rounded-xl"><span className="text-lg font-mono font-bold text-white tabular-nums leading-none tracking-widest">{tiempoReal}</span></div>
          </div>
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
            <ScoreBox name={data.jugador1} score={data.puntos1} color="#9333ea" />
            <ScoreBox name={data.jugador2} score={data.puntos2} color="#00A3FF" />
            <ScoreBox name={data.jugador3} score={data.puntos3} color="#ec4899" />
            <ScoreBox name={data.jugador4} score={data.puntos4} color="#64748b" />
          </div>
          {/* BARRA DE TIEMPO EN TV */}
          <div className="h-6 bg-[#111] rounded-full border border-white/5 overflow-hidden mt-2 shadow-2xl">
            <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%`, backgroundColor: getBarColor() }} />
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBox({ name, score, color }) {
  return (
    <div className="bg-[#111] rounded-[2rem] border border-white/5 flex flex-col overflow-hidden relative shadow-lg">
      <div style={{ backgroundColor: color }} className="h-[18%] flex items-center justify-center text-white font-black uppercase tracking-[0.3em] text-[2vh] px-4 truncate">{name}</div>
      <div className="flex-1 flex items-center justify-center text-white"><span className="text-[25vh] font-black leading-none">{score || 0}</span></div>
    </div>
  );
}

// --- VISTA MÓVIL ---
function MobileView({ data, enPartida, tiempoReal, mesaId, db }) {
  const [n1, setN1] = useState(''); const [n2, setN2] = useState('');
  const [n3, setN3] = useState(''); const [n4, setN4] = useState('');

  const iniciarPartida = async () => {
    if (!n1 || !n2 || !n3 || !n4) return alert("Introduce todos los nombres");
    await updateDoc(doc(db, "mesas", mesaId), {
      jugador1: n1, jugador2: n2, jugador3: n3, jugador4: n4,
      puntos1: 0, puntos2: 0, puntos3: 0, puntos4: 0, 
      inicio: new Date().getTime(),
      tiempoShot: 30, maxShot: 30, shotActive: false
    });
  };

  const updateScore = async (campo, valor) => {
    const valorActual = Number(data[campo]) || 0;
    await updateDoc(doc(db, "mesas", mesaId), { [campo]: Math.max(0, valorActual + valor) });
  };

  const updateName = async (campo, nuevoNombre) => {
    await updateDoc(doc(db, "mesas", mesaId), { [campo]: nuevoNombre });
  };

  const finalizarSesion = async () => {
    if(window.confirm("¿Cerrar mesa definitivamente?")) {
      await updateDoc(doc(db, "mesas", mesaId), { 
        jugador1: "---", jugador2: "---", jugador3: "---", jugador4: "---", 
        puntos1: 0, puntos2: 0, puntos3: 0, puntos4: 0, inicio: null 
      });
    }
  };

  const reiniciarPuntos = async () => {
    if(window.confirm("¿Reiniciar marcadores?")) {
      await updateDoc(doc(db, "mesas", mesaId), { puntos1: 0, puntos2: 0, puntos3: 0, puntos4: 0 });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col p-5 select-none overflow-hidden">
      {!enPartida ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <img src={LogoBilliard} className="w-24 mb-10 opacity-70" alt="logo" />
          <div className="w-full max-w-xs space-y-4">
            {[setN1, setN2, setN3, setN4].map((set, i) => (
              <input key={i} style={{ fontSize: '16px' }} className="w-full bg-[#0a0a0a] border border-white/5 p-4 rounded-xl text-center outline-none text-white font-black tracking-widest" placeholder={`JUGADOR ${i+1}`} onChange={e => set(e.target.value)} />
            ))}
            <button onClick={iniciarPartida} className="w-full bg-white text-black font-bold text-sm p-4 rounded-xl uppercase tracking-[0.3em] mt-8">Empezar</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-start py-2 px-1">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-black text-white tracking-[0.3em] uppercase leading-none">MESA {mesaId.replace("mesa", "")}</span>
              <button onClick={reiniciarPuntos} className="flex items-center text-[10px] font-black uppercase text-white/40">
                <IconReset /> Reiniciar Todo
              </button>
            </div>
            <div className="bg-[#0a0a0a] border border-white px-4 py-1.5 rounded-lg">
               <span className="text-sm font-mono font-bold text-white tabular-nums leading-none tracking-widest">{tiempoReal}</span>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
            <MobileScoreBox label={data.jugador1} score={data.puntos1} color="#9333ea" onPlus={() => updateScore('puntos1', 1)} onMinus={() => updateScore('puntos1', -1)} onNameChange={(val) => updateName('jugador1', val)} />
            <MobileScoreBox label={data.jugador2} score={data.puntos2} color="#00A3FF" onPlus={() => updateScore('puntos2', 1)} onMinus={() => updateScore('puntos2', -1)} onNameChange={(val) => updateName('jugador2', val)} />
            <MobileScoreBox label={data.jugador3} score={data.puntos3} color="#ec4899" onPlus={() => updateScore('puntos3', 1)} onMinus={() => updateScore('puntos3', -1)} onNameChange={(val) => updateName('jugador3', val)} />
            <MobileScoreBox label={data.jugador4} score={data.puntos4} color="#64748b" onPlus={() => updateScore('puntos4', 1)} onMinus={() => updateScore('puntos4', -1)} onNameChange={(val) => updateName('jugador4', val)} />
          </div>

          <ShotClock data={data} mesaId={mesaId} />

          <div className="pt-2 flex justify-center">
            <button onClick={finalizarSesion} className="w-full py-4 bg-red-950/10 border border-red-500/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">Cerrar Mesa</button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileScoreBox({ label, score, color, onPlus, onMinus, onNameChange }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative shadow-inner">
      <div className="relative flex items-center justify-center" style={{ backgroundColor: color }}>
        <input type="text" value={label} onChange={(e) => onNameChange(e.target.value)}
          style={{ fontSize: '16px' }} className="py-2.5 text-center text-white font-bold uppercase tracking-[0.3em] outline-none border-none w-full bg-transparent" />
        <div className="absolute right-2 pointer-events-none"><IconPencil /></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
        <button onClick={(e) => { e.stopPropagation(); onMinus(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-lg z-10">-</button>
        <div onClick={onPlus} className="text-6xl font-black tabular-nums tracking-tighter active:scale-95 transition-transform">{score || 0}</div>
        <button onClick={(e) => { e.stopPropagation(); onPlus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-lg z-10">+</button>
      </div>
    </div>
  );
}