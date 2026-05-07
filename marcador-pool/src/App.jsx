// --- VISTA TV: AJUSTADA PARA NO SOBRESALIR EN PANTALLAS REALES ---
if (isTV) {
  return (
    <div className="h-screen w-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      {!enPartida ? (
        <div className="flex w-full h-full p-6 gap-6"> {/* Añadido padding de seguridad perimetral */}
          
          <div className="w-[60%] flex flex-col h-full bg-[#24292E] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 pb-0">
              <span className="bg-[#4C5FD5] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                En Espera
              </span>
            </div>
            
            {/* Logo con más aire para empujar el bloque blanco hacia arriba */}
            <div className="flex-1 flex items-center justify-center p-12">
              <img src={LogoBilliard} alt="Logo" className="max-h-[80%] w-auto object-contain" />
            </div>
            
            {/* Bloque Blanco: Reducido de h-64 a h-[25%] para asegurar visibilidad */}
            <div className="h-[28%] bg-white text-black flex items-center px-10 gap-8">
              <div className="h-[80%] aspect-square bg-white rounded-xl shadow-xl flex items-center justify-center p-4 border border-black/5">
                <QRCodeSVG value={qrUrl} size={"100%"} />
              </div>
              
              <div className="flex flex-col justify-center">
                <p className="text-[12px] font-bold tracking-[0.2em] uppercase mb-1 text-black">
                  Mesa {mesaId.replace("mesa", "")} Disponible
                </p>
                <p className="text-[3.5vw] font-light tracking-tighter uppercase leading-tight text-black">
                  Escanea para comenzar
                </p>
              </div>
            </div>
          </div>

          <div className="w-[40%] h-full flex flex-col">
             <div className="flex-1 rounded-3xl bg-[#1A1A1A] border border-white/5 flex flex-col items-center justify-end p-12 relative overflow-hidden">
                <span className="absolute top-8 text-[10px] tracking-[0.5em] text-white/20 uppercase font-bold">
                  Espacio Disponible
                </span>
                
                {/* Publicidad: Tamaño reducido de 6xl a 4vw para que no desborde */}
                <p className="text-gray-500 text-[4vw] font-normal tracking-[0.1em] uppercase mb-4">
                  PUBLICIDAD
                </p>
             </div>
          </div>
        </div>
      ) : (
        /* ... el resto del código del marcador vivo se mantiene igual ... */
        <div className="flex-1 flex flex-col p-8 gap-8 relative text-white">
          <div className="flex justify-between items-center px-4 text-white">
            <div className="flex items-center gap-4 bg-green-500/10 px-6 py-2 rounded-full border border-green-500/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm tracking-[0.5em] text-green-500 uppercase font-black">En Vivo</span>
            </div>
            <div className="bg-[#111] border border-white/10 px-16 py-4 rounded-xl">
              <span className="text-6xl font-mono font-normal text-[#D4AF37] tracking-[0.2em]">{tiempoReal}</span>
            </div>
            <div className="w-[120px]"></div>
          </div>
          <div className="flex-1 flex gap-8">
            <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
              <div className="bg-[#A2FF00] p-6 flex justify-between items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador1}</span></div>
              <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos1}</span></div>
            </div>
            <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
              <div className="bg-[#00A3FF] p-6 flex justify-between items-center"><span className="text-black font-black uppercase tracking-[0.3em] text-2xl">{data.jugador2}</span></div>
              <div className="flex-1 flex items-center justify-center"><span className="text-[40vh] font-black leading-none text-white tabular-nums">{data.puntos2}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}