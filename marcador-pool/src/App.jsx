// --- VISTA TV: CORRECCIÓN DE ENCUADRE Y OVERSCAN ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white flex overflow-hidden font-sans p-12"> 
        {/* p-12 funciona como "Safe Area" para que la TV no corte el contenido */}
        
        {!enPartida ? (
          <div className="flex w-full h-full gap-8">
            
            <div className="w-[60%] flex flex-col h-full bg-[#24292E] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-12 pb-0">
                <span className="bg-[#4C5FD5] px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-[0.3em] text-white">
                  En Espera
                </span>
              </div>
              
              {/* Contenedor del Logo: Reducimos su área para que no empuje el QR hacia afuera */}
              <div className="flex-1 flex items-center justify-center p-16">
                <img src={LogoBilliard} alt="Logo" className="max-h-[60%] w-auto object-contain" />
              </div>
              
              {/* Bloque Blanco: Ahora con altura flexible y margen interno mayor */}
              <div className="bg-white text-black flex items-center p-12 gap-10 min-h-[30%]">
                <div className="h-40 w-40 bg-white rounded-2xl flex items-center justify-center p-4 shadow-lg border border-gray-100">
                  <QRCodeSVG value={qrUrl} size="100%" />
                </div>
                
                <div className="flex flex-col justify-center">
                  <p className="text-[14px] font-bold tracking-[0.2em] uppercase mb-2 text-black">
                    Mesa {mesaId.replace("mesa", "")} Disponible
                  </p>
                  <p className="text-[3.5vw] font-light tracking-tighter uppercase leading-[1.1] text-black">
                    Escanea para<br/>comenzar
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[40%] h-full">
               <div className="h-full rounded-[40px] bg-[#1A1A1A] border border-white/5 flex flex-col items-center justify-end p-16 relative overflow-hidden">
                  <span className="absolute top-12 text-[12px] tracking-[0.5em] text-white/20 uppercase font-bold">
                    Publicidad
                  </span>
                  {/* Reducimos el tamaño para asegurar que no se salga del cuadro */}
                  <p className="text-gray-600 text-[4vw] font-normal tracking-[0.1em] uppercase leading-none">
                    ESPACIO
                  </p>
                  <p className="text-gray-600 text-[4vw] font-normal tracking-[0.1em] uppercase mb-4">
                    LIBRE
                  </p>
               </div>
            </div>
          </div>
        ) : (
          /* Marcador en Vivo con márgenes de seguridad similares */
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
            
            <div className="flex-1 flex gap-10">
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-[40px] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#A2FF00] p-8 flex justify-center items-center">
                  <span className="text-black font-black uppercase tracking-[0.3em] text-3xl">{data.jugador1}</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[35vh] font-black text-white tabular-nums leading-none">{data.puntos1}</span>
                </div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-[40px] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#00A3FF] p-8 flex justify-center items-center">
                  <span className="text-black font-black uppercase tracking-[0.3em] text-3xl">{data.jugador2}</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[35vh] font-black text-white tabular-nums leading-none">{data.puntos2}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }