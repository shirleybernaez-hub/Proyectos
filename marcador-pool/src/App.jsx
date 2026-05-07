// --- VISTA TV: MODO "TANQUE" (REJILLA RÍGIDA PARA 43") ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans p-6">
        {!enPartida ? (
          /* Pantalla de Espera con QR */
          <div className="grid grid-cols-10 h-full gap-6">
            <div className="col-span-6 bg-[#24292E] rounded-[2rem] flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="p-10"><span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-[0.3em]">En Espera</span></div>
              <div className="flex-1 flex items-center justify-center p-10"><img src={LogoBilliard} alt="Logo" className="w-[70%]" /></div>
              <div className="bg-white text-black flex items-center p-10 gap-10">
                <div className="bg-white p-2 rounded-xl shadow-xl"><QRCodeSVG value={qrUrl} size={150} /></div>
                <div>
                  <p className="text-5xl font-black uppercase leading-none mb-2">Mesa {mesaId.replace("mesa", "")}</p>
                  <p className="text-xl opacity-50 uppercase tracking-widest font-light">Escanea para jugar</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 bg-[#111] rounded-[2rem] border border-white/5 flex items-center justify-center relative">
               <span className="absolute top-10 text-[10px] tracking-[1em] text-white/20 uppercase">Publicidad</span>
               <p className="text-white/5 text-7xl font-black uppercase -rotate-90">ONSHIFT</p>
            </div>
          </div>
        ) : (
          /* Marcador en Vivo */
          <div className="flex flex-col h-full gap-4">
            {/* Header Superior */}
            <div className="h-[15vh] flex justify-between items-center px-4">
              <div className="flex items-center gap-4 bg-green-500/10 px-8 py-3 rounded-full border border-green-500/20">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xl tracking-[0.5em] text-green-500 uppercase font-black">En Vivo</span>
              </div>
              <div className="bg-[#111] border border-white/10 px-20 py-4 rounded-2xl shadow-2xl">
                <span className="text-7xl font-mono text-[#D4AF37] tracking-widest">{tiempoReal}</span>
              </div>
              <div className="text-right">
                <p className="text-white/20 text-xs uppercase tracking-[0.5em] mb-1">Mesa</p>
                <p className="text-4xl font-black uppercase tracking-tighter">{mesaId.replace("mesa", "")}</p>
              </div>
            </div>

            {/* Bloque de Marcadores (Esto es lo que debe verse GIGANTE) */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Equipo 1 */}
              <div className="bg-[#0a0a0a] border-2 border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#A2FF00] py-4 px-10"><span className="text-black font-black uppercase tracking-[0.4em] text-3xl">{data.jugador1}</span></div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-transparent to-white/5">
                  <span className="text-[55vh] font-black leading-none tabular-nums text-white antialiased">
                    {data.puntos1}
                  </span>
                </div>
              </div>

              {/* Equipo 2 */}
              <div className="bg-[#0a0a0a] border-2 border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#00A3FF] py-4 px-10"><span className="text-black font-black uppercase tracking-[0.4em] text-3xl">{data.jugador2}</span></div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-transparent to-white/5">
                  <span className="text-[55vh] font-black leading-none tabular-nums text-white antialiased">
                    {data.puntos2}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }