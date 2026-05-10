import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 
import KFCPubli from './assets/kfcpubli.jpg'; 

// --- ICONOS ---
const IconPencil = () => <svg className="w-3 h-3 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IconPlay = () => <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const IconPause = () => <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const IconReset = () => <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const IconChevron = () => <svg className="w-3 h-3 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>;

const getColorBySeconds = (seconds) => {
  if (seconds > 50) return '#9333ea';
  if (seconds > 40) return '#a855f7';
  if (seconds > 30) return '#22c55e';
  if (seconds > 20) return '#facc15';
  if (seconds > 10) return '#f97316';
  return '#ef4444';
};

export default function App() {
  const [data, setData] = useState(null);
  const [tiempoReal, setTiempoReal] = useState("00:00:00");

  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv'; 
  const qrUrl = `${window.location.origin}?mesa=${mesaId}`;

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "mesas", mesaId), (docSnap) => {
      if (docSnap.exists()) setData(docSnap.data());
    });
    return () => unsub();
  }, [mesaId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (data?.inicio) {
        const diff = Math.floor((new Date().getTime() - data.inicio) / 1000);
        if (diff < 0) return;
        setTiempoReal(`${Math.floor(diff/3600).toString().padStart(2,'0')}:${Math.floor((diff%3600)/60).toString().padStart(2,'0')}:${(diff%60).toString().padStart(2,'0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [data]);

  if (!data) return null;
  const enPartida = data.jugador1 && data.jugador1 !== "---";

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {isTV ? 
        <TvView data={data} mesaId={mesaId} tiempoReal={tiempoReal} qrUrl={qrUrl} enPartida={enPartida} /> : 
        <MobileView data={data} mesaId={mesaId} tiempoReal={tiempoReal} db={db} />
      }
    </div>
  );
}

// --- VISTA TV ---
function TvView({ data, mesaId, tiempoReal, qrUrl, enPartida }) {
  const players = [1,2,3,4].filter(i => data[`jugador${i}`] && data[`jugador${i}`] !== "---");
  const timeLeft = data.tiempoShot || 0;
  const maxT = data.maxShot || 30;
  const progress = ((maxT - timeLeft) / maxT) * 100;

  if (!enPartida) {
    return (
      <div className="h-screen w-screen bg-black flex p-12 gap-12 overflow-hidden select-none">
        {/* Lado Izquierdo: Info y QR */}
        <div className="flex-1 flex flex-col justify-between bg-black relative items-center">
          {/* Logo Central */}
          <div className="flex-1 flex items-center justify-center">
            <img src={LogoBilliard} className="w-[32rem] opacity-100 object-contain" alt="Logo" />
          </div>
          
          {/* Rectángulo blanco - Ahora alineado con el padding general */}
          <div className="flex items-center gap-10 bg-white p-10 rounded-[3rem] shadow-2xl w-full">
            <div className="bg-white p-1 rounded-lg">
              <QRCodeSVG value={qrUrl} size={160} />
            </div>
            <div className="flex flex-col">
              <p className="text-[#999] font-bold text-sm tracking-[0.2em] uppercase mb-1">MESA DISPONIBLE</p>
              <p className="text-black text-5xl font-light uppercase leading-none tracking-tighter">
                ESCANEA PARA<br/><span className="font-black">JUGAR</span>
              </p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Publicidad - Alineado simétricamente */}
        <div className="flex-1 h-full flex flex-col">
          <div className="w-full h-full rounded-[3.5rem] overflow-hidden border-4 border-[#1a1a1a] shadow-2xl relative bg-[#0a0a0a]">
            <img src={KFCPubli} className="w-full h-full object-cover" alt="Publicidad" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen p-8 flex flex-col gap-6 bg-black select-none overflow-hidden">
      <div className="flex justify-between items-center px-4">
        <span className="text-4xl font-black text-white/40 tracking-widest uppercase">MESA {mesaId.replace("mesa", "")}</span>
        <div className="bg-[#111] border border-white px-10 py-4 rounded-2xl shadow-xl">
          <span className="text-3xl font-mono font-bold text-white tabular-nums">{tiempoReal}</span>
        </div>
      </div>
      <div className={`flex-1 grid gap-6 ${players.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'}`}>
        {players.map(i => (
          <div key={i} className="bg-[#111] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl relative">
            <div style={{ backgroundColor: ['#9333ea','#00A3FF','#ec4899','#64748b'][i-1] }} className="h-[18%] flex items-center justify-center text-white font-black uppercase tracking-[0.3em] text-[2.5vh]">
              {data[`jugador${i}`]}
            </div>
            <div className="absolute top-[20%] right-8 bg-white/10 px-5 py-1.5 rounded-full border border-white/10">
              <span className="text-[1.8vh] font-black text-white/40 uppercase mr-3">SETS</span>
              <span className="text-[3vh] font-black text-white">{data[`sets${i}`] || 0}</span>
            </div>
            <div className="flex-1 flex items-center justify-center text-[28vh] font-black tabular-nums leading-none">
              {data[`puntos${i}`] || 0}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#111] border border-white p-6 rounded-[2.5rem] flex flex-col items-center gap-2 shadow-2xl">
        <span className="text-6xl font-mono font-black tabular-nums transition-colors duration-500" style={{ color: getColorBySeconds(timeLeft) }}>{timeLeft}</span>
        <div className="w-full h-8 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%`, backgroundColor: getColorBySeconds(timeLeft) }} />
        </div>
      </div>
    </div>
  );
}

// --- SHOT CLOCK (SIN AUDIO) ---
function ShotClock({ data, mesaId }) {
  const maxTime = data.maxShot || 30;
  const timeLeft = data.tiempoShot !== undefined ? data.tiempoShot : maxTime;
  const isActive = data.shotActive || false;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        updateDoc(doc(db, "mesas", mesaId), { tiempoShot: timeLeft - 1 });
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      updateDoc(doc(db, "mesas", mesaId), { shotActive: false, tiempoShot: 0 });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mesaId]);

  const progress = ((maxTime - timeLeft) / maxTime) * 100;

  return (
    <div className="w-full flex flex-col items-start px-1">
      <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{shotActive:false, tiempoShot:maxTime})} className="mb-2 flex items-center text-[10px] font-black uppercase text-white/40">
        <IconReset /> REINICIAR TIEMPO
      </button>
      <div className="w-full bg-[#111] p-5 rounded-2xl border border-white/5 flex flex-col gap-2 relative shadow-xl">
        <div className="flex justify-between items-center relative z-10">
          <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{shotActive:!isActive})} className="flex items-center text-white font-black uppercase text-[12px] tracking-widest">
            {isActive ? <IconPause /> : <IconPlay />} {isActive ? 'PAUSAR' : 'INICIAR'}
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 -top-1">
            <span className="text-xl font-black tabular-nums transition-colors" style={{ color: getColorBySeconds(timeLeft) }}>{timeLeft}s</span>
          </div>
          <div className="relative flex items-center">
            <select value={maxTime} onChange={(e) => updateDoc(doc(db,"mesas",mesaId),{maxShot:parseInt(e.target.value), tiempoShot:parseInt(e.target.value), shotActive:false})} 
              className="appearance-none bg-transparent text-white font-bold text-[12px] pr-4 outline-none">
              <option value={30} className="bg-black text-white">30 SEG</option>
              <option value={40} className="bg-black text-white">40 SEG</option>
              <option value={60} className="bg-black text-white">60 SEG</option>
            </select>
            <div className="pointer-events-none absolute right-0"><IconChevron /></div>
          </div>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mt-2">
          <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%`, backgroundColor: getColorBySeconds(timeLeft) }} />
        </div>
      </div>
    </div>
  );
}

// --- VISTA MÓVIL ---
function MobileView({ data, mesaId, tiempoReal, db }) {
  const [names, setNames] = useState(['','','','']);
  const players = [1,2,3,4].filter(i => data[`jugador${i}`] && data[`jugador${i}`] !== "---");

  const iniciar = async () => {
    const valid = names.filter(n => n.trim() !== "");
    if (valid.length < 2) return alert("Mínimo 2 jugadores");
    const update = { inicio: new Date().getTime(), shotActive: false, tiempoShot: 30, maxShot: 30 };
    names.forEach((n, i) => { 
      update[`jugador${i+1}`] = n.trim() || "---"; 
      update[`puntos${i+1}`] = 0; 
      update[`sets${i+1}`] = 0;
    });
    await updateDoc(doc(db, "mesas", mesaId), update);
  };

  const updateSet = async (i, val) => {
    const current = data[`sets${i}`] || 0;
    await updateDoc(doc(db, "mesas", mesaId), { [`sets${i}`]: Math.max(0, current + val) });
  };

  const handleEditName = async (i, value) => {
    const cleanValue = value.trim() === "" ? "JUGADOR " + i : value;
    await updateDoc(doc(db, "mesas", mesaId), { [`jugador${i}`]: cleanValue });
  };

  return (
    <div className="p-6 flex flex-col min-h-screen gap-5 bg-black select-none">
      {data.jugador1 === "---" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <img src={LogoBilliard} className="w-32 mb-8 opacity-70" alt="logo" />
          {names.map((n, i) => (
            <input key={i} style={{fontSize:'16px'}} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-center font-black uppercase text-white outline-none" placeholder={`JUGADOR ${i+1}`} onChange={e => {const next = [...names]; next[i]=e.target.value; setNames(next);}} />
          ))}
          <button onClick={iniciar} className="w-full bg-white text-black font-black p-5 rounded-2xl uppercase mt-6 active:scale-95 transition-transform">EMPEZAR PARTIDA</button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-4">
              <span className="text-sm font-black tracking-widest uppercase text-white/50">MESA {mesaId.replace("mesa", "")}</span>
              <button onClick={() => window.confirm("¿Reiniciar todo?") && updateDoc(doc(db,"mesas",mesaId), {puntos1:0,puntos2:0,puntos3:0,puntos4:0, sets1:0, sets2:0, sets3:0, sets4:0})} className="flex items-center text-[10px] font-black text-white/40 active:text-white/70"><IconReset /> REINICIAR TODO</button>
            </div>
            <div className="bg-[#111] border border-white px-5 py-2 rounded-xl text-white font-bold tabular-nums">{tiempoReal}</div>
          </div>

          <div className={`grid gap-3 flex-1 ${players.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {players.map(i => (
              <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-inner relative">
                <div className="absolute top-12 right-2 flex flex-col items-center bg-black/50 backdrop-blur-sm rounded-xl p-1 border border-white/5 z-10">
                  <button onClick={() => updateSet(i, 1)} className="text-[12px] text-white/60 font-bold px-3 py-1">+</button>
                  <span className="text-[14px] font-black text-white py-0.5">{data[`sets${i}`] || 0}</span>
                  <button onClick={() => updateSet(i, -1)} className="text-[12px] text-white/60 font-bold px-3 py-1">-</button>
                </div>
                <div style={{ backgroundColor: ['#9333ea','#00A3FF','#ec4899','#64748b'][i-1] }} className="py-2.5 px-4 flex items-center justify-center">
                  <input defaultValue={data[`jugador${i}`]} onBlur={(e) => handleEditName(i, e.target.value)} style={{fontSize:'16px'}} className="bg-transparent text-center font-black uppercase text-[11px] outline-none w-full text-white" />
                  <IconPencil />
                </div>
                <div className="flex-1 flex items-center justify-between px-6 py-2 pr-14">
                  <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{[`puntos${i}`]:Math.max(0, (data[`puntos${i}`]||0)-1)})} className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-2xl active:bg-white/30">-</button>
                  <span className="text-6xl font-black tabular-nums">{data[`puntos${i}`] || 0}</span>
                  <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{[`puntos${i}`]:(data[`puntos${i}`]||0)+1})} className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-2xl active:bg-white/30">+</button>
                </div>
              </div>
            ))}
          </div>
          <ShotClock data={data} mesaId={mesaId} />
          <button onClick={() => window.confirm("¿Cerrar mesa?") && updateDoc(doc(db,"mesas",mesaId),{jugador1:"---",jugador2:"---",jugador3:"---",jugador4:"---", inicio: null})} className="w-full py-5 bg-red-950/20 border border-red-500/20 rounded-2xl text-[11px] font-black text-red-500 active:bg-red-900/30 uppercase tracking-[0.2em]">CERRAR MESA</button>
        </>
      )}
    </div>
  );
}