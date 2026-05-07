// --- VISTA TV: VERSIÓN CORREGIDA SIN "EN VIVO" ---
if (isTV) {
  return (
    <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans p-10 select-none">
      {!enPartida ? (
        <div className="grid grid-cols-10 h-full gap-5">
          {/* COLUMNA IZQUIERDA (CONTENIDO) */}
          <div className="col-span-6 grid grid-rows-10 h-full bg-[#1a1c1e] rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative">
            <div className="row-span-2 p-8 flex justify-between items-start">
              <span className="bg-[#4C5FD5] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">En Espera</span>
              <div className="text-right">
                <p className="text-[10px] uppercase opacity-40 tracking-[0.4em]">Mesa</p>
                <p className="text-3xl font-black">{mesaId.replace("mesa", "")}</p>
              </div>
            </div>
            <div className="row-span-5 flex items-center justify-center p-10">
              <img src={LogoBilliard} alt="Logo" className="max-h-full w-auto object-contain opacity-80" />
            </div>
            <div className="row-span-3 bg-white text-black flex items-center px-10 gap-8 min-h-[220px]">
              <div className="w-36 h-36 bg-white rounded-xl flex items-center justify-center p-4 shadow-xl border border-black/5">
                <QRCodeSVG value={qrUrl} size="100%" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[12px] font-bold tracking-[0.3em] uppercase mb-1 text-black opacity-60">Mesa Disponible</p>
                <p className="text-4xl font-light tracking-tighter uppercase leading-tight text-black">Escanea para comenzar</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (PUBLICIDAD) */}
          <div className="col-span-4 h-full bg-[#111] rounded-3xl border border-white/5 flex flex-col justify-center items-center p-12 text-center text-white relative overflow-hidden">
             <span className="absolute top-10 text-[10px] tracking-[0.6em] text-white/20 uppercase font-bold w-full text-center">Espacio Disponible</span>
             <p className="text-white/10 text-6xl font-normal tracking-[0.1em] uppercase leading-none text-center">PUBLICIDAD</p>
          </div>
        </div>
      ) : (
        /* MARCADOR EN VIVO: EL BADGE VERDE HA SIDO ELIMINADO DEFINITIVAMENTE */
        <div className="grid grid-rows-10 h-full gap-5">
          {/* Header: Tiempo centrado y Mesa (Editable y sin fondo) a la derecha */}
          <div className="row-span-2 bg-[#111] border border-white/10 rounded-3xl px-12 flex justify-between items-center shadow-2xl relative">
            
            {/* Espacio vacío a la izquierda para equilibrar el diseño con el texto de la mesa */}
            <div className="w-32"></div> 
            
            {/* Reloj central (Único protagonista visual) */}
            <span className="text-9xl font-mono font-normal text-[#D4AF37] tracking-[0.2em] tabular-nums">
              {tiempoReal}
            </span>

            {/* Texto de Mesa a la derecha (Sin fondo negro, solo texto blanco plano) */}
            <div className="text-right">
              <p className="text-[10px] uppercase opacity-30 tracking-[0.4em]">Mesa</p>
              <p className="text-4xl font-black text-white/80">{mesaId.replace("mesa", "")}</p>
            </div>
          </div>
          
          {/* Scores */}
          <div className="row-span-8 grid grid-cols-2 gap-5">
            <div className="bg-[#111] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
              <div className="bg-[#A2FF00] p-6 text-center">
                <span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador1}</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-10">
                <span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos1}</span>
              </div>
            </div>
            <div className="bg-[#111] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
              <div className="bg-[#00A3FF] p-6 text-center">
                <span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador2}</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-10">
                <span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos2}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}