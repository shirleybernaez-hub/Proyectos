// --- VISTA TV REFEINADA ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white flex overflow-hidden font-sans">
        {!enPartida ? (
          <div className="flex w-full h-full">
            <div className="w-[60%] flex flex-col h-full bg-[#24292E]">
              <div className="p-10 pb-0">
                <span className="bg-[#4C5FD5] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg text-white">
                  En Espera
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center p-20 pt-0">
                <img src={LogoBilliard} alt="Logo" className="w-full max-w-lg object-contain" />
              </div>
              <div className="h-64 bg-white text-black flex items-center px-16 gap-12">
                {/* QR Centrado en su contenedor */}
                <div className="w-48 h-48 bg-white rounded-xl shadow-2xl border border-black/5 flex items-center justify-center">
                  <QRCodeSVG value={qrUrl} size={160} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-4xl font-light tracking-tighter uppercase mb-2">
                    Mesa {mesaId.replace("mesa", "")} Disponible
                  </p>
                  <p className="text-2xl font-normal tracking-tight opacity-60 uppercase">
                    Escanea para comenzar
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[40%] h-full bg-[#1A1A1A] flex flex-col p-12 text-center text-white">
               <div className="w-full h-full rounded-2xl bg-[#222] border border-white/5 flex flex-col items-center justify-end p-20 relative">
                  <span className="absolute top-10 text-[10px] tracking-[0.5em] text-white/20 uppercase font-bold">
                    Espacio Disponible
                  </span>
                  {/* Publicidad abajo, gris y font normal */}
                  <p className="text-gray-500 text-6xl font-normal tracking-[0.1em] uppercase mb-10">
                    PUBLICIDAD
                  </p>
               </div>
            </div>
          </div>
        ) : (
          /* ... resto del código del marcador (sin cambios) ... */
          <div className="flex-1 flex flex-col p-8 gap-8 relative text-white">
            <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-4 bg-green-500/10 px-6 py-2 rounded-full border border-green-500/20">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_green]"></div>
                <span className="text-sm tracking-[0.5em] text-green-500 uppercase font-black">En Vivo</span>
              </div>
              <div className="bg-[#111] border border-white/10 px-16 py-4 rounded-xl shadow-2xl">
                <span className="text-6xl font-mono font-light text-[#D4AF37] tracking-[0.2em]">{tiempoReal}</span>
              </div>
              <div className="w-[120px]"></div>
            </div>
            <div className="flex-1 flex gap-8">
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#A2FF00] p-6 flex justify-between items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador1}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[480px] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#00A3FF] p-6 flex justify-between items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador2}</span></div>
                <div className="flex-1 flex items-center justify-center"><span className="text-[480px] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
              </div>
            </div>
            <div className="flex justify-end pr-4">
              <div className="bg-[#111] border border-white/10 px-8 py-4 rounded-xl flex items-center gap-6 shadow-2xl">
                <span className="text-xl font-black text-white uppercase tracking-[0.3em]">Mesa {mesaId.replace("mesa", "")}</span>
                <div className="flex items-center gap-3 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Activa</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }