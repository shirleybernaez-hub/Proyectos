// ... (Todo el inicio del código se mantiene igual hasta llegar a la sección de VISTA TV)

  // --- VISTA TV OPTIMIZADA PARA GRANDES FORMATOS (43"+) ---
  if (isTV) {
    return (
      <div className="h-screen w-screen bg-[#050505] text-white flex flex-col overflow-hidden font-sans p-[2vw]">
        {!enPartida ? (
          <div className="flex w-full h-full gap-[2vw]">
            <div className="flex-[1.5] flex flex-col h-full bg-[#24292E] rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="p-[3vw] pb-0">
                <span className="bg-[#4C5FD5] px-[2vw] py-[0.8vw] rounded-full text-[1vw] font-bold uppercase tracking-[0.3em] shadow-lg text-white">
                  En Espera
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center p-[4vw]">
                <img src={LogoBilliard} alt="Logo" className="w-[80%] max-w-4xl" />
              </div>
              <div className="h-[25vh] bg-white text-black flex items-center px-[4vw] gap-[3vw]">
                <div className="p-[1vw] bg-white rounded-2xl shadow-2xl">
                  <QRCodeSVG value={qrUrl} size={180} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[4vw] font-light tracking-tighter uppercase leading-none">
                    Mesa {mesaId.replace("mesa", "")} Disponible
                  </p>
                  <p className="text-[1.5vw] font-light opacity-50 italic">Escanea para comenzar a jugar</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 h-full bg-[#1A1A1A] rounded-[2rem] border border-white/5 flex flex-col items-center justify-center p-[4vw] relative overflow-hidden">
               <span className="absolute top-[3vw] text-[0.8vw] tracking-[0.8em] text-white/20 uppercase font-bold">Espacio Publicitario</span>
               <div className="text-center">
                 <p className="text-white/5 text-[6vw] font-black uppercase leading-tight italic">Tu Marca<br/>Aquí</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-[2vh] relative text-white">
            {/* Header con Tiempo */}
            <div className="flex justify-between items-center px-[1vw] h-[12vh]">
              <div className="flex items-center gap-[1vw] bg-green-500/10 px-[2vw] py-[1vh] rounded-full border border-green-500/20">
                <div className="w-[1vw] h-[1vw] bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_green]"></div>
                <span className="text-[1.2vw] tracking-[0.4em] text-green-500 uppercase font-black">En Vivo</span>
              </div>
              
              <div className="bg-[#111] border border-white/10 px-[4vw] py-[1.5vh] rounded-2xl shadow-2xl flex items-center justify-center">
                <span className="text-[6vh] font-mono font-light text-[#D4AF37] tracking-[0.1em] leading-none">
                  {tiempoReal}
                </span>
              </div>
              
              <div className="flex items-center gap-[1.5vw] bg-[#111] border border-white/10 px-[2vw] py-[1vh] rounded-2xl shadow-2xl">
                <span className="text-[1.5vw] font-black text-white uppercase tracking-[0.2em]">Mesa {mesaId.replace("mesa", "")}</span>
                <div className="flex items-center gap-[0.5vw] bg-green-500/10 px-[1vw] py-[0.5vh] rounded-full border border-green-500/20">
                  <div className="w-[0.5vw] h-[0.5vw] bg-green-500 rounded-full"></div>
                  <span className="text-[0.8vw] font-black text-green-500 uppercase">Activa</span>
                </div>
              </div>
            </div>

            {/* Marcadores Gigantes */}
            <div className="flex-1 flex gap-[2vw] h-[75vh]">
              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#A2FF00] py-[2vh] px-[3vw] flex justify-between items-center">
                  <span className="text-black font-black uppercase tracking-[0.3em] text-[2vw]">{data.jugador1}</span>
                  <div className="w-[4vw] h-[0.6vh] bg-black/20 rounded-full"></div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[40vh] font-black leading-none text-white tabular-nums drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {data.puntos1}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-[#00A3FF] py-[2vh] px-[3vw] flex justify-between items-center">
                  <span className="text-black font-black uppercase tracking-[0.3em] text-[2vw]">{data.jugador2}</span>
                  <div className="w-[4vw] h-[0.6vh] bg-black/20 rounded-full"></div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[40vh] font-black leading-none text-white tabular-nums drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
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

// ... (El resto del código de la VISTA MÓVIL se mantiene igual)