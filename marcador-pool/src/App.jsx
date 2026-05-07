// --- VISTA TV REESTABLECIDA Y AJUSTADA (SIN DISEÑO DE CARDS) ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white flex overflow-hidden font-sans p-10"> 
        {/* p-10 es el MARGEN DE SEGURIDAD contra recortes de la TV */}
        
        {!enPartida ? (
          <div className="flex w-full h-full">
            {/* BLOQUE IZQUIERDO */}
            <div className="w-[60%] flex flex-col h-full bg-[#24292E]">
              <div className="p-10 pb-0"><span className="bg-[#4C5FD5] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg text-white">En Espera</span></div>
              <div className="flex-1 flex items-center justify-center p-20 pt-0">
                <img src={LogoBilliard} alt="Logo" className="w-full max-w-lg object-contain" />
              </div>
              
              {/* BLOQUE BLANCO INFERIOR (Restaurado y ajustado) */}
              <div className="h-[28%] bg-white text-black flex items-center px-16 gap-12 min-h-[200px]">
                {/* min-h asegura que el bloque blanco tenga un alto decente y flexible */}
                <div className="w-44 h-44 bg-white rounded-lg flex items-center justify-center p-6 border border-black/5 shadow-2xl">
                  <QRCodeSVG value={qrUrl} size="100%" />
                </div>
                <div className="flex flex-col justify-center text-black">
                  <p className="text-[12px] font-bold tracking-[0.3em] uppercase mb-1">Mesa {mesaId.replace("mesa", "")} Disponible</p>
                  <p className="text-5xl font-light tracking-tighter uppercase leading-tight">Escanea para comenzar</p>
                </div>
              </div>
            </div>

            {/* BLOQUE DERECHO (PUBLICIDAD) */}
            <div className="w-[40%] h-full bg-[#1A1A1A] flex flex-col justify-center items-center p-12 text-center text-white relative">
               <span className="absolute top-10 text-[10px] tracking-[0.5em] text-white/20 uppercase font-bold">Espacio Disponible</span>
               <p className="text-gray-500 text-6xl font-normal tracking-[0.1em] uppercase">PUBLICIDAD</p>
            </div>
          </div>
        ) : (
          /* Marcador en vivo (se mantiene igual con Safe Area) */
          <div className="flex-1 flex flex-col gap-10">
            <div className="flex justify-between items-center px-6">
              <div className="flex items-center gap-6 bg-green-500/10 px-8 py-3 rounded-full border border-green-500/20">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_green]"></div>
                <span className="text-lg tracking-[0.4em] text-green-500 uppercase font-black">En Vivo</span>
              </div>
              <div className="bg-[#111] border border-white/10 px-20 py-6 rounded-2xl shadow-2xl">
                <span className="text-7xl font-mono text-[#D4AF37] tracking-[0.2em]">{tiempoReal}</span>
              </div>
              <div className="w-[150px]"></div>
            </div>
            
            <div className="flex-1 flex gap-10 h-[70vh]">
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                <div className="bg-[#A2FF00] p-8 flex justify-center items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-3xl">{data.jugador1}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
                <div className="absolute left-6 bottom-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos1', -1, e)}>-</div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                <div className="bg-[#00A3FF] p-8 flex justify-center items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-3xl">{data.jugador2}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
                <div className="absolute right-6 top-6 w-20 h-20 flex items-center justify-center text-white/5 text-5xl active:text-white/20 transition-colors" onClick={(e) => updateScore('puntos2', -1, e)}>-</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }