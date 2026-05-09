import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 

// --- ICONOS ---
const IconPencil = () => <svg className="w-3 h-3 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IconPlay = () => <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const IconPause = () => <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const IconResetGeneral = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const IconResetSmall = () => <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
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
  const audioRef = useRef(new Audio('/alert.mp3'));

  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv'; 

  const unlockAudio = () => {
    audioRef.current.play().then(() => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }).catch(() => {});
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  useEffect(() => {
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
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

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {isTV ? 
        <TvView data={data} mesaId={mesaId} tiempoReal={tiempoReal} /> : 
        <MobileView data={data} mesaId={mesaId} tiempoReal={tiempoReal} db={db} audioRef={audioRef} />
      }
    </div>
  );
}

function ShotClock({ data, mesaId, audioRef }) {
  const maxTime = data.maxShot || 30;
  const timeLeft = data.tiempoShot !== undefined ? data.tiempoShot : maxTime;
  const isActive = data.shotActive || false;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }

    let interval = null;
    if (isActive && timeLeft > 0) {
      if (timeLeft <= 10 && timeLeft > 0) {
        audioRef.current.currentTime = 0; 
        audioRef.current.play().catch(() => {});
      }
      interval = setInterval(() => {
        updateDoc(doc(db, "mesas", mesaId), { tiempoShot: timeLeft - 1 });
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      updateDoc(doc(db, "mesas", mesaId), { shotActive: false, tiempoShot: 0 });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mesaId, audioRef]);

  const progress = ((maxTime - timeLeft) / maxTime) * 100;

  return (
    <div className="w-full flex flex-col items-start px-1">
      <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{shotActive:false, tiempoShot:maxTime})} className="mb-2 flex items-center text-[10px] font-black uppercase text-white/40">
        <IconResetSmall /> REINICIAR TIEMPO
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

function TvView({ data, mesaId, tiempoReal }) {
  const players = [1,2,3,4].filter(i => data[`jugador${i}`] && data[`jugador${i}`] !== "---");
  const timeLeft = data.tiempoShot || 0;
  const maxT = data.maxShot || 30;
  const progress = ((maxT - timeLeft) / maxT) * 100;

  return (
    <div className="h-screen w-screen p-8 flex flex-col gap-6 select-none overflow-hidden bg-black">
      <div className="flex justify-between items-center px-4 relative h-12">
        <span className="absolute left-1/2 -translate-x-1/2 text-3xl font-black text-white/60 tracking-widest uppercase">MESA {mesaId.replace("mesa", "")}</span>
        <div className="bg-[#111] border border-white px-8 py-3 rounded-2xl shadow-xl ml-auto"><span className="text-2xl font-mono font-bold text-white tabular-nums">{tiempoReal}</span></div>
      </div>
      <div className={`flex-1 grid gap-6 ${players.length <= 2 ? 'grid-cols-2 grid-rows-1' : 'grid-cols-2 grid-rows-2'}`}>
        {players.map(i => (
          <div key={i} className="bg-[#111] rounded-[2.5rem] border border-white flex flex-col overflow-hidden shadow-2xl">
            <div style={{ backgroundColor: ['#9333ea','#00A3FF','#ec4899','#64748b'][i-1] }} className="h-[20%] flex items-center justify-center text-white font-black uppercase tracking-[0.3em] text-[2.5vh] border-b border-white">{data[`jugador${i}`]}</div>
            <div className="flex-1 flex items-center justify-center text-[25vh] font-black tabular-nums text-white">{data[`puntos${i}`] || 0}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#111] border border-white p-5 rounded-[2rem] flex flex-col items-center gap-2">
        <span className="text-5xl font-mono font-black tabular-nums" style={{ color: getColorBySeconds(timeLeft) }}>{timeLeft}</span>
        <div className="w-full h-8 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%`, backgroundColor: getColorBySeconds(timeLeft) }} />
        </div>
      </div>
    </div>
  );
}

function MobileView({ data, mesaId, tiempoReal, db, audioRef }) {
  const [names, setNames] = useState(['','','','']);
  const players = [1,2,3,4].filter(i => data[`jugador${i}`] && data[`jugador${i}`] !== "---");

  const iniciar = async () => {
    const valid = names.filter(n => n.trim() !== "");
    if (valid.length < 2) return alert("Mínimo 2 jugadores");
    const update = { inicio: new Date().getTime(), shotActive: false, tiempoShot: 30, maxShot: 30 };
    names.forEach((n, i) => { update[`jugador${i+1}`] = n.trim() || "---"; update[`puntos${i+1}`] = 0; });
    await updateDoc(doc(db, "mesas", mesaId), update);
  };

  const handleEditName = async (i, value) => {
    const cleanValue = value.trim() === "" ? "JUGADOR " + i : value;
    await updateDoc(doc(db, "mesas", mesaId), { [`jugador${i}`]: cleanValue });
  };

  return (
    <div className="p-6 flex flex-col min-h-screen gap-5 bg-black">
      {data.jugador1 === "---" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 relative">
          <img src={LogoBilliard} className="w-44 mb-6 opacity-60" alt="logo" /> {/* Logo aumentado a w-44 */}
          <div className="w-full space-y-4">
            {names.map((n, i) => (
                <input key={i} style={{fontSize:'16px'}} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-center font-black uppercase text-white outline-none" placeholder={`JUGADOR ${i+1}`} onChange={e => {const next = [...names]; next[i]=e.target.value; setNames(next);}} />
            ))}
          </div>
          <button onClick={iniciar} className="w-full bg-white text-black font-black p-4 rounded-xl uppercase mt-4">EMPEZAR PARTIDA</button>
          
          {/* VERSIÓN DEL SOFTWARE */}
          <div className="absolute bottom-4 w-full text-center">
            <span className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">V 1.0</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-1 relative h-10">
            <button onClick={() => window.confirm("¿Reiniciar todo?") && updateDoc(doc(db,"mesas",mesaId), {puntos1:0,puntos2:0,puntos3:0,puntos4:0})} className="text-white/40 active:text-white/80 z-10">
              <IconResetGeneral />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-lg font-black tracking-widest uppercase text-white whitespace-nowrap">MESA {mesaId.replace("mesa", "")}</span>
            <div className="bg-[#111] border border-white px-2 py-1 rounded-lg text-white font-bold tabular-nums text-[10px] z-10 ml-auto h-fit">{tiempoReal}</div>
          </div>

          <div className={`grid gap-3 flex-1 ${players.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {players.map(i => (
              <div key={i} className="bg-[#0a0a0a] border border-white rounded-2xl overflow-hidden flex flex-col shadow-inner">
                <div style={{ backgroundColor: ['#9333ea','#00A3FF','#ec4899','#64748b'][i-1] }} className="py-3 px-3 flex items-center justify-center border-b border-white">
                  <input 
                    defaultValue={data[`jugador${i}`]} 
                    onBlur={(e) => handleEditName(i, e.target.value)}
                    style={{fontSize:'18px'}} 
                    className="bg-transparent text-center font-black uppercase outline-none w-full text-white" 
                  />
                  <IconPencil />
                </div>
                <div className="flex-1 flex items-center justify-between px-4 py-2">
                  <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{[`puntos${i}`]:Math.max(0, (data[`puntos${i}`]||0)-1)})} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl active:bg-white/20 transition-colors">-</button>
                  <span className="text-6xl font-black tabular-nums text-white">{data[`puntos${i}`] || 0}</span>
                  <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{[`puntos${i}`]:(data[`puntos${i}`]||0)+1})} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl active:bg-white/20 transition-colors">+</button>
                </div>
              </div>
            ))}
          </div>
          <ShotClock data={data} mesaId={mesaId} audioRef={audioRef} />
          <button onClick={() => window.confirm("¿Cerrar mesa?") && updateDoc(doc(db,"mesas",mesaId),{jugador1:"---",jugador2:"---",jugador3:"---",jugador4:"---"})} className="w-full py-4 bg-red-950/20 border border-red-500/20 rounded-xl text-[10px] font-black text-red-500 active:bg-red-900/30 transition-colors uppercase">CERRAR MESA</button>
        </>
      )}
    </div>
  );
}