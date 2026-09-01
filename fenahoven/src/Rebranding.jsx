import React from 'react';

export default function Rebranding() {
  return (
    <div className="bg-[#FDFDFD] text-[#1E293B] font-nexa antialiased selection:bg-[#0062B2]/10">
      
      {/* SECCIÓN INTRODUCCIÓN - AJUSTADA */}
      <section className="min-h-[60vh] w-full bg-[#0062B2] text-white flex flex-col justify-center items-center p-8 md:p-16 border-b border-white/10">
        <span className="text-sm uppercase tracking-[0.4em] text-white/80 mb-6 font-nexa font-bold">Estudio de Identidad</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center leading-tight font-nexa uppercase">
          PROPUESTA DE<br />REBRANDING
        </h1>
        <p className="text-xl md:text-2xl font-light tracking-wide text-white/90 mt-6 text-center font-nexa uppercase">
          PARA LA MARCA FENAHOVEN
        </p>
      </section>

      {/* SECCIÓN ESTRATEGIA */}
      <section className="py-24 md:py-36 px-8 md:px-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0062B2] uppercase tracking-tight leading-none">
              ¿Por qué un<br className="hidden md:block" /> rebranding?
            </h2>
          </div>
          <div className="md:col-span-7 pt-2 md:pt-6">
            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-light text-justify">
              Actualmente, una identidad visual saturada de ornamentos no solo resta elegancia, sino que anula la legibilidad en los soportes digitales e impresos. Hemos optado por una solución basada exclusivamente en la tipografía porque el nombre de la institución es su activo más valioso. Al eliminar elementos gráficos y accesorios, la marca gana una personalidad atemporal e institucional, permitiendo que la legibilidad sea absoluta en cualquier formato y escala.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN LOGO ACTUAL */}
      <section className="py-24 md:py-36 px-8 md:px-16 max-w-5xl mx-auto border-t border-slate-100">
        <div className="flex flex-col items-center">
          <h3 className="text-lg uppercase tracking-[0.3em] text-slate-400 font-bold mb-8">LOGO ACTUAL</h3>
          <div className="w-full flex justify-center">
            <div className="bg-slate-50/50 rounded-3xl p-12">
              <img src="/logofenahoven.jpg" alt="Logo Actual FENAHOVEN" className="h-96 md:h-[32rem] w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN ANATOMÍA DE MARCA */}
      <section className="min-h-screen w-full bg-[#0062B2] text-white p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="w-full text-center mb-16">
          <h2 className="text-lg uppercase tracking-[0.3em] text-white font-bold opacity-90">NUEVA PROPUESTA</h2>
        </div>
        <div className="w-full max-w-6xl mx-auto space-y-8 md:space-y-24">
          <div className="flex flex-col md:grid md:grid-cols-5 gap-6 md:gap-8 items-center text-center">
            <div className="space-y-3">
              <h4 className="text-sm uppercase tracking-wider text-white font-bold">Eliminación de Ornamentos</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">Se elimina el mapa de Venezuela y el fondo policromado con gradientes que saturaban la marca, logrando una limpieza visual total.</p>
            </div>
            <div className="text-white/20 text-4xl font-bold">+</div>
            <div className="space-y-3">
              <h4 className="text-sm uppercase tracking-wider text-white font-bold">Depuración Geométrica</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">Desarmamos la estructura rígida anterior para liberar la carga visual, enfocándonos exclusivamente en el valor de la palabra.</p>
            </div>
            <div className="text-white/20 text-4xl font-bold">+</div>
            <div className="space-y-3">
              <h4 className="text-sm uppercase tracking-wider text-white font-bold">Respeto a la Identidad Histórica</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">No borramos el pasado. Mantuvimos exactamente la tipografía existente que los ha identificado por años, conservando su esencia original.</p>
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-center pt-8 space-x-6">
            <div className="text-white/20 text-4xl font-bold">=</div>
            <div className="flex flex-col items-center">
              <img src="/logofenahovenblanco.png" alt="Resultado Final" className="h-24 md:h-44 w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN LOGO COLOR ÚNICO */}
      <section className="py-24 px-8 md:px-16 flex flex-col items-center bg-white">
        <div className="w-full text-center mb-16">
          <h2 className="text-lg uppercase tracking-[0.3em] text-slate-400 font-bold font-nexa">LOGO EN COLOR ÚNICO</h2>
        </div>
        <div className="w-full flex flex-col items-center justify-center p-12 bg-white">
          <img src="/logofenahoven_azul.png" alt="Logo Azul FENAHOVEN" className="h-20 md:h-28 w-auto object-contain" />
        </div>
      </section>

      {/* SECCIÓN VARIACIÓN DE LOGO */}
      <section className="w-full flex flex-col border-t border-slate-100">
        <div className="px-8 md:px-16 py-12 max-w-6xl mx-auto w-full text-center">
          <h2 className="text-lg uppercase tracking-[0.3em] text-slate-400 font-bold font-nexa">VARIACIÓN DE LOGO</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          <div className="aspect-square flex items-center justify-center bg-white border-b md:border-b-0 md:border-r border-black/5">
            <img src="/logofenahoven_azul.png" alt="Logo Azul" className="w-48 h-auto object-contain" />
          </div>
          <div className="aspect-square flex items-center justify-center bg-[#0468BF] border-b md:border-b-0 md:border-r border-white/10">
            <img src="/logofenahovenblanco.png" alt="Logo Blanco" className="w-48 h-auto object-contain" />
          </div>
          <div className="aspect-square flex items-center justify-center bg-[#0367A6]">
            <img src="/logofenahovenblanco.png" alt="Logo Blanco" className="w-48 h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* SECCIÓN PALETA DE COLORES */}
      <section className="py-24 w-full bg-[#FDFDFD] border-t border-slate-100">
        <div className="w-full px-8 md:px-16 max-w-6xl mx-auto mb-12 text-center">
          <h2 className="text-lg uppercase tracking-[0.3em] text-slate-400 font-bold">Paleta de colores</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-8 md:px-16 max-w-6xl mx-auto">
          {[
            { hex: "#0468BF" },
            { hex: "#0367A6" },
            { hex: "#36A6BF" },
            { hex: "#F2D785" },
            { hex: "#F2E1C2" }
          ].map((color, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-40 md:h-64 w-full rounded-2xl shadow-sm mb-4" style={{ backgroundColor: color.hex }}></div>
              <span className="text-[10px] font-mono font-bold text-[#1E293B] uppercase">{color.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN TIPOGRAFÍA */}
      <section className="min-h-screen w-full bg-[#0367A6] text-white p-8 md:p-24 flex flex-col justify-center">
        <div className="w-full text-center mb-16">
          <h2 className="text-lg uppercase tracking-[0.3em] text-white/60 font-bold">Tipografía</h2>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-12">
          <div className="text-center">
            <h3 className="text-4xl font-bold tracking-tight">Times Sans Serif</h3>
            <p className="text-xl opacity-90 mt-2">Light / Regular / Bold</p>
          </div>
          <div className="text-center font-light leading-relaxed tracking-wide text-2xl md:text-3xl">
            AaBbCcDdEeFfGg<br />HhJjKkLlMmNnOoPp<br />QqRrSsTtUuVvWw<br />XxYyZz - 123456789<br />!@#$%^&*?
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center mt-12">
          <span className="text-[150px] md:text-[600px] font-bold leading-none opacity-20 select-none">Aa</span>
        </div>
      </section>

      {/* SECCIÓN APLICACIÓN MÓVIL */}
      <section className="py-24 w-full bg-[#F1F5F9]">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <h2 className="text-lg uppercase tracking-[0.3em] text-slate-400 font-bold mb-16 text-center">
            Aplicación móvil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[200px] md:max-w-[280px] aspect-[9/19] bg-[#0468BF] rounded-[3rem] border-[8px] border-white overflow-hidden flex items-center justify-center shadow-2xl">
                <img src="/logofenahovenblanco.png" alt="Logo FENAHOVEN" className="w-3/5 h-auto object-contain" />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[200px] md:max-w-[280px] aspect-[9/19] bg-[#FFFFFF] rounded-[3rem] border-[8px] border-slate-200 overflow-hidden flex items-center justify-center shadow-2xl">
                <img src="/logofenahoven_azul.png" alt="Logo FENAHOVEN" className="w-3/5 h-auto object-contain" />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-[200px] md:max-w-[280px] aspect-[9/19] bg-[#0367A6] rounded-[3rem] border-[8px] border-white overflow-hidden flex items-center justify-center shadow-2xl">
                <img src="/logofenahovenblanco.png" alt="Logo FENAHOVEN" className="w-3/5 h-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN APLICACIÓN WEB */}
      <section className="py-24 w-full bg-white flex flex-col items-center">
        <h2 className="text-lg uppercase tracking-[0.3em] text-slate-400 font-bold mb-16 text-center">
          Aplicación web
        </h2>
        <div className="relative w-full max-w-4xl px-8">
          <div className="aspect-[16/10] bg-slate-900 rounded-t-3xl border-[12px] border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden">
             <div className="text-white/20 font-bold text-xl uppercase tracking-widest">Mockup Web FENAHOVEN</div>
          </div>
          <div className="h-6 w-full bg-slate-800 rounded-b-xl"></div>
        </div>
        <div className="mt-16">
          <a 
            href="https://fenahoven.vercel.app/web" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#0062B2] text-white font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#004a85] transition-all"
          >
            FENAHOVENWEB
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 w-full bg-[#000000] text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-light">
          onshift 2026
        </p>
      </footer>
    </div>
  );
}