import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import LogoBilliard from './assets/billiardplay.png'; 
import KFCPubli from './assets/kfcpubli.jpg'; 

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

// --- VISTA TV (NUEVA JERARQUÍA: CONTADOR ARRIBA) ---
function TvView({ data, enPartida, tiempoReal, qrUrl, mesaId }) {
  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden relative select-none">
      {!enPartida ? (
        <div className="absolute inset-[5%] flex gap-6"> 
          <div className="w-[62%] h-full bg-[#1a1c1e] rounded-[2rem] relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-8 left-8"><span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">En Espera</span></div>
            <div className="absolute inset-0 flex items-center justify-center pb-48"><img src={LogoBilliard} alt="Logo" className="w-[180px] object-contain opacity-90" /></div>
            <div className="absolute bottom-0 left-0 w-full h-[180px] bg-white text-black flex items-center px-10 gap-8">
              <div className="w-[140px] h-[140px] bg-white flex-shrink-0 flex items-center justify-center p-2 border-2 border-black/5 rounded-lg"><QRCodeSVG value={qrUrl} size="100%" /></div>
              <div className="flex flex-col justify-center"><p className="text-[12px] font-bold tracking-[0.3em] uppercase mb-1 opacity-50">Mesa Disponible</p><p className="text-[38px] font-light tracking-tighter leading-[0.85] uppercase">Escanea para<br/>comenzar a jugar</p></div>
            </div>
          </div>
          <div className="w-[38%] h-full bg-[#111] rounded-[2rem] border border-white/5 relative overflow-hidden"><img src={KFCPubli} alt="Publicidad" className="w-full h-full object-cover" /></div>
        </div>
      ) : (
        <div className="absolute inset-[4%] flex flex-col gap-4">
          {/* CONTADOR ARRIBA (Rectángulo no protagonista) */}
          <div className="flex justify-center">
            <div className="bg-[#111] border border-white/10 px-8 py-2 rounded-2xl flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-[0.4em] opacity-30">Mesa {mesaId.replace("mesa", "")}</span>
                <span className="text-xl font-mono text-[#D4AF37] leading-none">{tiempoReal}</span>
              </div>
            </div>
          </div>

          {/* GRID DE MARCADORES (PROTAGONISTAS) */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
            <ScoreBox name={data.jugador1} score={data.puntos1} color="#9333ea" />
            <ScoreBox name={data.jugador2} score={data.puntos2} color="#00A3FF" />
            <ScoreBox name={data.jugador3} score={data.puntos3} color="#ec4899" />
            <ScoreBox name={data.jugador4} score={data.puntos4} color="#64748b" />
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBox({ name, score, color }) {
  return (
    <div className="bg-[#111] rounded-[2rem] border border-white/5 flex flex-col overflow-hidden relative">
      <div style={{ backgroundColor: color }} className="h-[18%] flex items-center justify-center text-white font-black uppercase tracking-[0.2em] text-[2.2vh] px-4 truncate">{name}</div>
      <div className="flex-1 flex items-center justify-center text-white"><span className="text-[25vh] font-black leading-none">{score || 0}</span></div>
    </div>
  );
}

// --- VISTA MÓVIL (MANTIENE EDICIÓN Y DISEÑO 2x2) ---
function MobileView({ data, enPartida, tiempoReal, mesaId, db }) {
  const [n1, setN1] = useState(''); const [n2, setN2] = useState('');
  const [n3, setN3] = useState(''); const [n4, setN4] = useState('');

  const iniciarPartida = async () => {
    if (!n1 || !n2 || !n3 || !n4) return alert("Introduce todos los nombres");
    await updateDoc(doc(db, "mesas", mesaId), {
      jugador1: n1, jugador2: n2, jugador3: n3, jugador4: n4,
      puntos1: 0, puntos2: 0, puntos3: 0, puntos4: 0, inicio: new Date().getTime()
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
    if(window.confirm("¿Finalizar sesión?")) {
      await updateDoc(doc(db, "mesas", mesaId), { 
        jugador1: "---", jugador2: "---", jugador3: "---", jugador4: "---", 
        puntos1: 0, puntos2: 0, puntos3: 0, puntos4: 0, inicio: null 
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col p-3 select-none overflow-hidden">
      {!enPartida ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <img src={LogoBilliard} className="w-24 mb-6 opacity-80" alt="logo" />
          <div className="w-full max-w-xs space-y-3">
            {[setN1, setN2, setN3, setN4].map((set, i) => (
              <input key={i} className="w-full bg-[#111] border border-white/10 p-3 rounded-xl text-center outline-none" 
              placeholder={`Jugador ${i+1}`} onChange={e => set(e.target.value)} />
            ))}
            <button onClick={iniciarPartida} className="w-full bg-white text-black font-black p-4 rounded-xl uppercase tracking-widest mt-4">Empezar</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-center py-1">
            <button onClick={() => updateDoc(doc(db, "mesas", mesaId), { puntos1:0, puntos2:0, puntos3:0, puntos4:0 })} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase">Reiniciar</button>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Mesa {mesaId.replace("mesa", "")}</div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
            <MobileScoreBox label={data.jugador1} score={data.puntos1} color="#9333ea" onPlus={() => updateScore('puntos1', 1)} onMinus={() => updateScore('puntos1', -1)} onNameChange={(val) => updateName('jugador1', val)} />
            <MobileScoreBox label={data.jugador2} score={data.puntos2} color="#00A3FF" onPlus={() => updateScore('puntos2', 1)} onMinus={() => updateScore('puntos2', -1)} onNameChange={(val) => updateName('jugador2', val)} />
            <MobileScoreBox label={data.jugador3} score={data.puntos3} color="#ec4899" onPlus={() => updateScore('puntos3', 1)} onMinus={() => updateScore('puntos3', -1)} onNameChange={(val) => updateName('jugador3', val)} />
            <MobileScoreBox label={data.jugador4} score={data.puntos4} color="#64748b" onPlus={() => updateScore('puntos4', 1)} onMinus={() => updateScore('puntos4', -1)} onNameChange={(val) => updateName('jugador4', val)} />
          </div>

          <div className="flex items-center justify-center py-2"><div className="bg-[#111] px-8 py-2 rounded-xl text-3xl font-mono text-[#D4AF37]">{tiempoReal}</div></div>
          <button onClick={finalizarSesion} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Cerrar Mesa</button>
        </div>
      )}
    </div>
  );
}

function MobileScoreBox({ label, score, color, onPlus, onMinus, onNameChange }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden relative">
      <input type="text" value={label} onChange={(e) => onNameChange(e.target.value)}
        className="py-2 text-center text-white font-black uppercase text-[10px] tracking-widest outline-none border-none w-full"
        style={{ backgroundColor: color }} />
      <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
        <button onClick={(e) => { e.stopPropagation(); onMinus(); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white text-xl z-10">-</button>
        <div onClick={onPlus} className="text-5xl font-black">{score || 0}</div>
        <button onClick={(e) => { e.stopPropagation(); onPlus(); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white text-xl z-10">+</button>
      </div>
    </div>
  );
}