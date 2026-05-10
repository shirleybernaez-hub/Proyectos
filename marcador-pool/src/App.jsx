import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 
import KFCPubli from './assets/kfcpubli.jpg'; 

// --- REGLA 1: AUTO-RECUPERACIÓN (11 MESAS) ---
const checkAndCreateMesas = async () => {
  for (let i = 1; i <= 11; i++) {
    const id = `mesa${i}`;
    const docRef = doc(db, "mesas", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        jugador1: "---", jugador2: "---", jugador3: "---", jugador4: "---",
        puntos1: 0, puntos2: 0, puntos3: 0, puntos4: 0,
        inicio: null, shotActive: false, tiempoShot: 30, maxShot: 30
      });
    }
  }
};

const getColorBySeconds = (seconds) => {
  if (seconds > 50) return '#9333ea';
  if (seconds > 40) return '#a855f7';
  if (seconds > 30) return '#22c55e';
  if (seconds > 20) return '#facc15';
  if (seconds > 10) return '#f97316';
  return '#ef4444';
};

const IconPencil = () => <svg className="w-3 h-3 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>;
const IconReset = () => <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const IconChevron = () => <svg className="w-3 h-3 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>;

export default function App() {
  const [data, setData] = useState(null);
  const [tiempoReal, setTiempoReal] = useState("00:00:00");
  const params = new URLSearchParams(window.location.search);
  const mesaId = params.get('mesa') || 'mesa1'; 
  const isTV = params.get('view') === 'tv'; 
  const qrUrl = `${window.location.origin}?mesa=${mesaId}`;

  useEffect(() => {
    checkAndCreateMesas();
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
        <MobileView data={data} mesaId={mesaId} tiempoReal={tiempoReal} db={db} enPartida={enPartida} />
      }
    </div>
  );
}

// --- VISTA TV (SIN SETS) ---
function TvView({ data, mesaId, tiempoReal, qrUrl, enPartida }) {
  const players = [1,2,3,4].filter(i => data[`jugador${i}`] && data[`jugador${i}`] !== "---");
  const timeLeft = data.tiempoShot !== undefined ? data.tiempoShot : (data.maxShot || 30);
  const maxT = data.maxShot || 30;
  const progress = ((maxT - timeLeft) / maxT) * 100;

  if (!enPartida) {
    return (
      <div className="h-screen w-screen bg-black flex p-12 gap-12 overflow-hidden select-none">
        <div className="flex-1 flex flex-col justify-between items-center">
          <div className="flex-1 flex items-center justify-center">
            <img src={LogoBilliard} className="w-[32rem] object-contain" alt="Logo" />
          </div>
          <div className="flex items-center gap-10 bg-white p-10 rounded-[3rem] shadow-2xl w-full">
            <QRCodeSVG value={qrUrl} size={160} />
            <div className="flex flex-col text-black">
              <p className="text-[#999] font-bold text-sm tracking-[0.2em] uppercase">Mesa Disponible</p>
              <p className="text-5xl font-light leading-none tracking-tighter uppercase">ESCANEA PARA<br/><span className="font-black">JUGAR</span></p>
            </div>
          </div>
        </div>
        <div className="flex-1 h-full p-4">
          <div className="w-full h-full rounded-[3.5rem] overflow-hidden border-4 border-[#1a1a1a] bg-[#0a0a0a]">
            <img src={KFCPubli} className="w-full h-full object-cover" alt="Publicidad" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen p-8 flex flex-col gap-6 bg-black select-none overflow-hidden">
      <div className="flex justify-between items-center px-4">
        <span className="text-4xl font-black text-white/40 uppercase tracking-widest">MESA {mesaId.replace("mesa", "")}</span>
        <div className="bg-[#111] border border-white px-10 py-4 rounded-2xl shadow-xl">
          <span className="text-3xl font-mono font-bold text-white tabular-nums">{tiempoReal}</span>
        </div>
      </div>
      <div className={`flex-1 grid gap-6 ${players.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'}`}>
        {players.map(i => (
          <div key={i} className="bg-[#111] rounded-[3rem] border border-white/5 flex flex-col overflow-hidden relative shadow-2xl">
            <div style={{ backgroundColor: ['#9333ea','#00A3FF','#ec4899','#64748b'][i-1] }} className="h-[18%] flex items-center justify-center text-white font-black uppercase text-[2.5vh] tracking-widest">{data[`jugador${i}`]}</div>
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

// --- VISTA MÓVIL (PUNTOS HORIZONTALES SIN REPETICIÓN) ---
function MobileView({ data, mesaId, tiempoReal, db, enPartida }) {
  const [names, setNames] = useState(['','','','']);

  const iniciar = async () => {
    const valid = names.filter(n => n.trim() !== "");
    if (valid.length < 2) return alert("Mínimo 2 jugadores");
    const update = { 
      inicio: new Date().getTime(), shotActive: false, tiempoShot: 30, maxShot: 30,
      jugador1: names[0].trim() || "---", jugador2: names[1].trim() || "---", 
      jugador3: names[2].trim() || "---", jugador4: names[3].trim() || "---",
      puntos1: 0, puntos2: 0, puntos3: 0, puntos4: 0
    };
    await updateDoc(doc(db, "mesas", mesaId), update);
  };

  if (!enPartida) {
    return (
      <div className="p-6 flex flex-col min-h-screen items-center justify-center gap-4 bg-black">
        <img src={LogoBilliard} className="w-32 mb-8 opacity-70" alt="logo" />
        {names.map((n, i) => (
          <input key={i} style={{fontSize:'16px'}} className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-center font-black uppercase text-white outline-none" 
          placeholder={`JUGADOR ${i+1}`} onChange={e => {const next = [...names]; next[i]=e.target.value; setNames(next);}} />
        ))}
        <button onClick={iniciar} className="w-full bg-white text-black font-black p-5 rounded-2xl uppercase mt-6 active:scale-95 transition-transform">EMPEZAR PARTIDA</button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col min-h-screen gap-5 bg-black select-none">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">MESA {mesaId.replace("mesa", "")}</span>
          <button onClick={() => window.confirm("¿Reiniciar?") && updateDoc(doc(db,"mesas",mesaId), {puntos1:0,puntos2:0,puntos3:0,puntos4:0})} className="flex items-center text-[10px] font-black text-white/40"><IconReset /> REINICIAR</button>
        </div>
        <div className="bg-[#111] border border-white px-5 py-2 rounded-xl text-white font-bold tabular-nums shadow-lg">{tiempoReal}</div>
      </div>

      <div className={`grid gap-3 flex-1 ${[1,2,3,4].filter(num => data[`jugador${num}`] !== "---").length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {[1,2,3,4].filter(num => data[`jugador${num}`] !== "---").map(i => (
          <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col relative shadow-inner">
             <div style={{ backgroundColor: ['#9333ea','#00A3FF','#ec4899','#64748b'][i-1] }} className="py-4 px-4 flex items-center justify-center">
                <input value={data[`jugador${i}`]} onChange={(e) => updateDoc(doc(db,"mesas",mesaId),{[`jugador${i}`]:e.target.value || "---"})} style={{fontSize:'16px'}} className="bg-transparent text-center font-black uppercase text-sm outline-none w-full text-white" />
                <IconPencil />
             </div>
             <div className="flex-1 flex items-center justify-between px-8 py-4">
                <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{[`puntos${i}`]:Math.max(0, (data[`puntos${i}`]||0)-1)})} className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold active:bg-white/30">-</button>
                <span className="text-7xl font-black tabular-nums">{data[`puntos${i}`] || 0}</span>
                <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{[`puntos${i}`]:(data[`puntos${i}`]||0)+1})} className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold active:bg-white/30">+</button>
             </div>
          </div>
        ))}
      </div>

      <ShotClockMobile data={data} mesaId={mesaId} />
      <button onClick={() => window.confirm("¿Cerrar mesa?") && updateDoc(doc(db,"mesas",mesaId),{jugador1:"---",jugador2:"---",jugador3:"---",jugador4:"---", inicio: null})} className="w-full py-5 bg-red-950/20 border border-red-500/20 rounded-2xl text-[11px] font-black text-red-500 uppercase tracking-widest">CERRAR MESA</button>
    </div>
  );
}

// --- SHOTCLOCK (REINICIO FIJO) ---
function ShotClockMobile({ data, mesaId }) {
  const maxTime = data.maxShot || 30;
  const timeLeft = data.tiempoShot !== undefined ? data.tiempoShot : maxTime;
  const isActive = data.shotActive || false;
  const progress = ((maxTime - timeLeft) / maxTime) * 100;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => updateDoc(doc(db, "mesas", mesaId), { tiempoShot: timeLeft - 1 }), 1000);
    } else if (timeLeft <= 0 && isActive) {
      updateDoc(doc(db, "mesas", mesaId), { shotActive: false, tiempoShot: 0 });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mesaId]);

  return (
    <div className="w-full flex flex-col gap-2">
      <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{shotActive:false, tiempoShot:maxTime})} className="flex items-center text-[10px] font-black text-white/40 uppercase ml-1">
        <IconReset /> REINICIAR TIEMPO
      </button>
      <div className="w-full bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => updateDoc(doc(db,"mesas",mesaId),{shotActive:!isActive})} className="font-black uppercase text-xs tracking-widest">{isActive ? 'PAUSAR' : 'INICIAR'}</button>
          <span className="text-2xl font-black tabular-nums" style={{ color: getColorBySeconds(timeLeft) }}>{timeLeft}s</span>
          <div className="relative flex items-center">
            <select value={maxTime} onChange={(e) => updateDoc(doc(db,"mesas",mesaId),{maxShot:parseInt(e.target.value), tiempoShot:parseInt(e.target.value), shotActive:false})} 
              className="appearance-none bg-transparent text-white font-bold text-[12px] pr-4 outline-none border-none">
              <option value={30} className="bg-black">30 SEG</option>
              <option value={40} className="bg-black">40 SEG</option>
              <option value={60} className="bg-black">60 SEG</option>
            </select>
            <div className="pointer-events-none absolute right-0"><IconChevron /></div>
          </div>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-1000 ease-linear" style={{ width: `${progress}%`, backgroundColor: getColorBySeconds(timeLeft) }} />
        </div>
      </div>
    </div>
  );
}