// --- VISTA TV: ARQUITECTURA HORIZONTAL RÍGIDA ---
if (isTV) {
  return (
    <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans p-16">
      {/* Contenedor Principal con márgenes de seguridad para evitar recortes */}
      <div className="flex h-full w-full gap-4 border border-white/5 rounded-[40px] overflow-hidden">
        
        {/* COLUMNA IZQUIERDA (CONTENIDO) */}
        {!enPartida ? (
          <div className="w-[65%] h-full flex flex-col bg-[#1a1c1e] relative">
            <div className="p-10 flex justify-between items-start">
              <span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-widest">En Espera</span>
              <div className="text-right">
                 <p className="text-[10px] uppercase tracking-[0.5em] opacity-30">Mesa</p>
                 <p className="text-2xl font-black">{mesaId.replace("mesa", "")}</p>
              </div>
            </div>

            {/* LOGO: Tamaño contenido para que no empuje el resto */}
            <div className="flex-1 flex items-center justify-center p-10">
              <img src={LogoBilliard} alt="Logo" className="max-h-[180px] w-auto object-contain opacity-80" />
            </div>

            {/* BLOQUE BLANCO: Franja inferior fija */}
            <div className="h-[200px] bg-white text-black flex items-center px-12 gap-10">
              <div className="h-32 w-32 bg-white rounded-xl flex items-center justify-center p-4 shadow-xl border border-black/5">
                <QRCodeSVG value={qrUrl} size="100%" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[12px] font-bold tracking-[0.3em] uppercase mb-1 opacity-60">Mesa Disponible</p>
                <p className="text-4xl font-light tracking-tighter uppercase leading-none">Escanea para comenzar</p>
              </div>
            </div>
          </div>
        ) : (
          /* MARCADOR VIVO: Ajustado para TV */
          <div className="w-[65%] h-full flex flex-col p-10 gap-6 bg-[#0a0a0a]">
            <div className="flex justify-between items-center bg-[#111] p-6 rounded-3xl border border-white/5">
               <div className="flex items-center gap-4 bg-green-500/10 px-6 py-2 rounded-full border border-green-500/20">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm tracking-[0.3em] text-green-500 uppercase font-black">En Vivo</span>
               </div>
               <span className="text-6xl font-mono text-[#D4AF37] tabular-nums">{tiempoReal}</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
              <div className="bg-[#111] rounded-3xl flex flex-col overflow-hidden border border-white/5">
                <div className="bg-[#A2FF00] p-4 text-center"><span className="text-black font-black uppercase tracking-widest text-xl">{data.jugador1}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[25vh] font-black">{data.puntos1}</span></div>
              </div>
              <div className="bg-[#111] rounded-3xl flex flex-col overflow-hidden border border-white/5">
                <div className="bg-[#00A3FF] p-4 text-center"><span className="text-black font-black uppercase tracking-widest text-xl">{data.jugador2}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[25vh] font-black">{data.puntos2}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* COLUMNA DERECHA (PUBLICIDAD) */}
        <div className="w-[35%] h-full bg-[#111] flex flex-col items-center justify-center p-12 relative border-l border-white/5">
           <span className="absolute top-10 text-[10px] tracking-[0.5em] text-white/10 uppercase font-bold text-center w-full">Espacio Disponible</span>
           <p className="text-white/10 text-6xl font-normal tracking-[0.1em] uppercase leading-none text-center">PUBLICIDAD</p>
        </div>

      </div>
    </div>
  );
}