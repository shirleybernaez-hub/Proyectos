import { BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CartesianGrid, ComposedChart, Bar, ReferenceLine, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import React, { useState, useEffect } from 'react';

// Componente interno para animar los números de forma interactiva (cuenta progresiva dinámica)
function Counter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const totalMilisecondsByStep = Math.max(Math.floor(duration / end), 1);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, totalMilisecondsByStep);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

const reportData = [
  { estado: 'La Guaira', ocupacion: 38.24 },
  { estado: 'Carabobo', ocupacion: 32.10 },
  { estado: 'Táchira', ocupacion: 28.50 },
  { estado: 'Aragua', ocupacion: 13.75 },
  { estado: 'Lara', ocupacion: 13.32 },
];

const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isAlert = data.ocupacion < 21.99;
    return (
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3.5 shadow-xl min-w-[150px] text-xs">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">{data.estado}</div>
        <div className="flex items-center justify-between gap-4">
          <div className="text-base font-black text-slate-900">{data.ocupacion}%</div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isAlert ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isAlert ? 'Bajo el promedio' : 'Óptimo'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Web() {
  // Estado para controlar cuál hito está seleccionado/activo. Inicia en 0 (1958) por defecto.
  const [activeHito, setActiveHito] = useState(0);

  // Arreglo con clases de tamaño personalizadas para equilibrar visualmente cada logo de la red
  const partners = [
    { src: '/conseturismo.png', alt: 'Conseturismo', className: 'max-h-12 w-auto' },
    { src: '/avavit.jpg', alt: 'AVAVIT', className: 'max-h-12 w-auto' },
    { src: '/avencintel.jpg', alt: 'AVENCINTEL', className: 'max-h-20 md:max-h-24 w-auto scale-110' },
    { src: '/asociaciondelienas.png', alt: 'ALAV', className: 'max-h-12 w-auto' },
    { src: '/camyticom.png', alt: 'Camyticom', className: 'max-h-12 w-auto' },
    { src: '/cvtt.jpg', alt: 'CVTT', className: 'max-h-16 md:max-h-20 w-auto scale-110' },
    { src: '/cavespa.png', alt: 'CAVESPA', className: 'max-h-14 w-auto' }
  ];

  // Hitos Cronológicos de la Historia de FENAHOVEN
  const timelineEvents = [
    {
      year: '1958',
      title: 'Fundación de ANAHOVEN',
      description: 'Nace la Asociación Nacional de Hoteles de Venezuela, sentando las bases de la unión gremial en una época de pleno desarrollo de infraestructuras icónicas en el país.'
    },
    {
      year: '1993',
      title: 'Transformación en FENAHOVEN',
      description: 'Evolución estructural hacia Federación Nacional de Hoteles de Venezuela, expandiendo su alcance para agrupar cámaras regionales y elevar la representatividad del sector.'
    },
    {
      year: '2000 - 2020',
      title: 'Expansión Gremial',
      description: 'Dos décadas de consolidación institucional, tejiendo alianzas estratégicas e impulsando la profesionalización de la hotelería en cada rincón del territorio nacional.'
    },
    {
      year: '2021 - 2026',
      title: 'Modernización y Recuperación',
      description: 'Enfoque total en la digitalización, optimización de datos de la industria turística y la reactivación estratégica de la red hotelera venezolana.'
    },
    {
      year: 'Futuro',
      title: 'Turismo Sostenible e Inversión',
      description: 'Hacia un modelo de hotelería verde, sustentable, con estándares internacionales de servicio y la apertura de nuevas ventanas para la inversión global.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 antialiased">
      
      {/* 1. TOP BAR */}
      <div className="bg-[#2F92B9] py-2 px-6 md:px-12 text-white text-[11px] font-medium tracking-wide relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="opacity-80">✉</span> contacto@fenahoven.org.ve
            </span>
            <span className="flex items-center gap-2">
              <span className="opacity-80">📞</span> +58 (212) 993-4444
            </span>
          </div>
          <div className="flex items-center gap-4 opacity-90">
            <span className="cursor-pointer hover:text-slate-200">𝕏</span>
            <span className="cursor-pointer hover:text-slate-200 font-bold">in</span>
            <span className="cursor-pointer hover:text-slate-200">ƒ</span>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR PRINCIPAL */}
      <nav className="bg-white border-b border-gray-200 relative px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between min-h-[100px] relative py-4 md:py-0">
          
          <div className="flex items-center justify-center md:justify-start relative md:absolute top-0 left-0 z-20 mb-4 md:mb-0">
            <img 
              src="/logowebfenahoven.png" 
              alt="Escudo Oficial FENAHOVEN" 
              className="h-36 md:h-44 w-auto object-contain select-none" 
            />
          </div>

          <div className="flex-1 flex flex-wrap gap-x-8 gap-y-3 items-center justify-center text-xs md:text-[15px] font-medium text-slate-900 tracking-wide md:min-h-[100px]">
            <a href="/quienes-somos" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#2F92B9] transition-colors py-1">
              Quiénes somos?
            </a>
            <span className="cursor-pointer hover:text-[#2F92B9] transition-colors py-1">Directorio</span>
            <span className="cursor-pointer hover:text-[#2F92B9] transition-colors py-1">Noticias</span>
            <span className="cursor-pointer hover:text-[#2F92B9] transition-colors py-1">Eventos</span>
            <span className="cursor-pointer hover:text-[#2F92B9] transition-colors py-1">Capacitación</span>
            <span className="cursor-pointer hover:text-[#2F92B9] transition-colors py-1">Contacto</span>
          </div>

          <div className="hidden md:block w-40 pointer-events-none" />
        </div>
      </nav>

      {/* 3. HERO INSTITUTIONAL CON MÁSCARA PARALLAX ROUNDED DE 35PX */}
      <section 
        className="relative min-h-[95vh] flex flex-col justify-center items-center px-8 bg-cover bg-center bg-no-repeat bg-fixed py-20 rounded-b-[35px] overflow-hidden shadow-md"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(16, 23, 42, 0.85), rgba(16, 23, 42, 0.50)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')` 
        }}
      >
        <div className="text-center max-w-5xl mb-16 z-10">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.15] mb-8 uppercase tracking-tight">
            67 AÑOS <br />
            IMPULSANDO EL TURISMO <br />
            EN VENEZUELA
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-light tracking-wide max-w-2xl mx-auto">
            La voz oficial de la hotelería venezolana desde 1958.
          </p>
        </div>

        {/* Cards de Indicadores */}
        <div className="w-full max-w-6xl z-10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100 flex flex-col justify-center items-center transform hover:scale-102 transition-transform duration-300">
              <span className="block text-4xl md:text-5xl font-black text-[#2F92B9] tracking-tight mb-3">
                <Counter value="300" />+
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold text-center">Hoteles Representados</span>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100 flex flex-col justify-center items-center transform hover:scale-102 transition-transform duration-300">
              <span className="block text-4xl md:text-5xl font-black text-[#2F92B9] tracking-tight mb-3">
                <Counter value="24" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold text-center">Estados Afiliados</span>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100 flex flex-col justify-center items-center transform hover:scale-102 transition-transform duration-300">
              <span className="block text-4xl md:text-5xl font-black text-[#2F92B9] tracking-tight mb-3">
                <Counter value="67" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold text-center">Años de Trayectoria</span>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100 flex flex-col justify-center items-center transform hover:scale-102 transition-transform duration-300">
              <span className="block text-4xl md:text-5xl font-black text-[#2F92B9] tracking-tight mb-3">
                <Counter value="12" />+
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold text-center">Eventos Anuales</span>
            </div>
          </div>
          <div className="text-center pt-2">
            <span className="text-[9px] font-mono tracking-wider text-slate-300 uppercase bg-slate-900/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
              Fuente: Registro Histórico FENAHOVEN
            </span>
          </div>
        </div>
      </section>

      {/* 3.5. INTRODUCCIÓN INSTITUCIONAL */}
      <section className="py-28 bg-[#F1F5F9] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            
            <div className="md:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block">Identidad Institucional</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase leading-tight">
                La Voz Oficial <br />
                de la Hotelería <br />
                en Venezuela
              </h2>
              <div className="w-12 h-1 bg-[#2F92B9] rounded-full mt-2" />
            </div>

            <div className="md:col-span-7 space-y-10">
              <p className="text-slate-700 text-base md:text-lg font-light leading-relaxed">
                La <strong className="font-semibold text-slate-900">Federación Nacional de Hoteles de Venezuela (FENAHOVEN)</strong> es la organización gremial matriz que agrupa, representa y potencia a las cámaras y establecimientos de hospedaje en todo el territorio nacional. Actuamos como el puente estratégico fundamental entre el sector privado, los organismos públicos y las corrientes turísticas globales.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-inner flex items-center justify-center text-[#2F92B9]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900">Representación</h4>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">Defensa activa de los intereses de la red hotelera nacional ante entes reguladores.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-inner flex items-center justify-center text-[#2F92B9]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-11a2 2 0 00-2-2h-2a2 2 0 00-2 2v11a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900">Desarrollo</h4>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">Capacitación técnica continua y optimización de datos reales de la industria.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 shadow-inner flex items-center justify-center text-[#2F92B9]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-900">Proyección</h4>
                    <p className="text-[11px] text-slate-500 font-light leading-relaxed">Impulso estratégico del destino Venezuela bajo estándares globales.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN INFOGRAFÍA: TIMELINE INTERACTIVO */}
      <section className="py-32 bg-[#FFFFFF] border-b border-slate-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-24">
            <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block mb-3">Trayectoria Histórica</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">Nuestra Línea del Tiempo</h2>
            <p className="text-slate-500 mt-3 font-light text-sm leading-relaxed">
              Trabajamos de la mano con las principales organizaciones turísticas y comerciales del país, construyendo un legado de hospitalidad y desarrollo desde nuestros orígenes.
            </p>
            <div className="w-16 h-1 bg-[#2F92B9] mx-auto mt-5 rounded-full" />
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-slate-300 rounded-full z-20" />
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-[#D1D5DB] z-0" />
            <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-slate-300 rounded-full z-20" />

            <div className="space-y-16 md:space-y-24 py-8 relative z-10">
              {timelineEvents.map((event, index) => {
                const isLeftYear = index % 2 === 0;
                const isItemActive = activeHito === index;
                const isNextHitoToClick = activeHito === null ? index === 0 : index === activeHito + 1;

                return (
                  <div 
                    key={index} 
                    className="flex flex-col md:grid md:grid-cols-11 items-center w-full relative cursor-pointer"
                    onClick={() => setActiveHito(index)}
                  >
                    
                    <div className="w-full md:col-span-5 flex justify-center md:justify-end md:px-8 z-10">
                      {isLeftYear ? (
                        <div className="text-4xl lg:text-5xl font-black tracking-tight select-none pr-4 text-[#2F92B9]">
                          {event.year}
                        </div>
                      ) : (
                        <div className={`w-full max-w-sm bg-white rounded-2xl p-6 md:p-8 border transition-all duration-500 ease-out transform ${
                          isItemActive 
                            ? 'scale-105 border-[#2F92B9]/40 shadow-xl bg-slate-50/10' 
                            : 'scale-100 border-slate-100 shadow-sm hover:scale-[1.02]'
                        }`}>
                          <div className="block md:hidden text-2xl font-black text-[#2F92B9] mb-2">{event.year}</div>
                          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${isItemActive ? 'text-[#2F92B9]' : 'text-slate-950'}`}>{event.title}</h3>
                          <p className="text-sm text-slate-500 font-light leading-relaxed">{event.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="hidden md:flex md:col-span-1 justify-center items-center z-20">
                      <div className="relative flex items-center justify-center">
                        {isNextHitoToClick && (
                          <div className="absolute w-8 h-8 rounded-full bg-[#2F92B9]/30 animate-ping z-0 pointer-events-none" />
                        )}
                        <div className={`rounded-full bg-white flex items-center justify-center shadow-sm border border-[#2F92B9] transition-all duration-300 ${
                          isItemActive ? 'w-7 h-7 scale-110' : 'w-6 h-6'
                        }`}>
                          <div className={`rounded-full bg-[#2F92B9] transition-all duration-300 ${
                            isItemActive ? 'w-3 h-3' : 'w-2.5 h-2.5'
                          }`} />
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:col-span-5 flex justify-center md:justify-start md:px-8 z-10 mt-4 md:mt-0">
                      {isLeftYear ? (
                        <div className={`w-full max-w-sm bg-white rounded-2xl p-6 md:p-8 border transition-all duration-500 ease-out transform ${
                          isItemActive 
                            ? 'scale-105 border-[#2F92B9]/40 shadow-xl bg-slate-50/10' 
                            : 'scale-100 border-slate-100 shadow-sm hover:scale-[1.02]'
                        }`}>
                          <div className="block md:hidden text-2xl font-black text-[#2F92B9] mb-2">{event.year}</div>
                          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${isItemActive ? 'text-[#2F92B9]' : 'text-slate-950'}`}>{event.title}</h3>
                          <p className="text-sm text-slate-500 font-light leading-relaxed">{event.description}</p>
                        </div>
                      ) : (
                        <div className="text-4xl lg:text-5xl font-black tracking-tight select-none pl-4 text-[#2F92B9]">
                          {event.year}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 4.5. SECCIÓN ESTRATÉGICA: FUNCIONES EN TODO EL ANCHO */}
      <section className="py-28 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div>
            <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block mb-2">Acción Institucional</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
              Funciones de FENAHOVEN en Venezuela
            </h2>
            <div className="w-16 h-1 bg-[#2F92B9] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Función 1 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#2F92B9]/10 flex items-center justify-center text-[#2F92B9] mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-950">Representación Gremial</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  Defiende los intereses de hoteles y posadas ante organismos públicos y privados.
                </p>
              </div>
            </div>

            {/* Función 2 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#2F92B9]/10 flex items-center justify-center text-[#2F92B9] mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm12 0v-11a2 2 0 00-2-2h-2a2 2 0 00-2 2v11a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-950">Estadísticas Sectoriales</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  Produce y divulga indicadores de ocupación hotelera, comportamiento de temporadas turísticas y tendencias del mercado.
                </p>
              </div>
            </div>

            {/* Función 3 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#2F92B9]/10 flex items-center justify-center text-[#2F92B9] mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2v0a2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2v4a2 2 0 002 2h2.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-950">Promoción del Turismo</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  Participa en iniciativas para fortalecer destinos turísticos y atraer visitantes nacionales e internacionales.
                </p>
              </div>
            </div>

            {/* Función 4 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#2F92B9]/10 flex items-center justify-center text-[#2F92B9] mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-950">Formación y Refuerzo</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  Promueve encuentros gremiales, intercambio de experiencias y actualización del sector hotelero.
                </p>
              </div>
            </div>

            {/* Función 5 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#2F92B9]/10 flex items-center justify-center text-[#2F92B9] mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536M10.5 11.5a1 1 0 11-2 0 1 1 0 012 0zm5.656 5.656a1 1 0 11-2 0 1 1 0 012 0zm0-11.314a1 1 0 11-2 0 1 1 0 012 0zm-11.314 0a1 1 0 11-2 0 1 1 0 012 0zm0 11.314a1 1 0 11-2 0 1 1 0 012 0zM12 21a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-950">Atención de Emergencias</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  Coordina apoyo a establecimientos afiliados afectados por desastres naturales o situaciones extraordinarias.
                </p>
              </div>
            </div>

            {/* Función 6 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#2F92B9]/10 flex items-center justify-center text-[#2F92B9] mb-5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-950">Atracción de Inversiones</h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  Promueve oportunidades para marcas hoteleras, franquicias, reconversión de activos y nuevos proyectos turísticos.
                </p>
              </div>
            </div>

            {/* Función 7 */}
            <div className="md:col-span-2 lg:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:scale-[1.01] transition-all duration-300">
              <h3 className="text-lg font-bold mb-3 text-slate-950">Defensa de Condiciones para la Actividad Hotelera</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Plantea activamente propuestas y soluciones estratégicas sobre los siguientes ejes críticos del sector:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
                
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 font-medium flex flex-col items-center justify-center gap-2.5 border border-slate-100 text-center hover:bg-slate-100/50 transition-colors">
                  <svg className="w-5 h-5 text-[#2F92B9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Conectividad aérea</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 font-medium flex flex-col items-center justify-center gap-2.5 border border-slate-100 text-center hover:bg-slate-100/50 transition-colors">
                  <svg className="w-5 h-5 text-[#2F92B9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V11m0 0H9m3 0h3m-3-3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M15 14h.01M15 17h.01M12 20h.01" />
                  </svg>
                  <span>Infraestructura</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 font-medium flex flex-col items-center justify-center gap-2.5 border border-slate-100 text-center hover:bg-slate-100/50 transition-colors">
                  <svg className="w-5 h-5 text-[#2F92B9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Servicios públicos</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 font-medium flex flex-col items-center justify-center gap-2.5 border border-slate-100 text-center hover:bg-slate-100/50 transition-colors">
                  <svg className="w-5 h-5 text-[#2F92B9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Regulación turística</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 font-medium flex flex-col items-center justify-center gap-2.5 border border-slate-100 text-center hover:bg-slate-100/50 transition-colors col-span-2 sm:col-span-1">
                  <svg className="w-5 h-5 text-[#2F92B9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Alojamientos informales</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECCIÓN INTERACTIVA: DATOS DE LA INDUSTRIA */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 w-full">
            <div className="relative aspect-[4/5] w-full bg-slate-100 rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop" 
                alt="Industria Hotelera Venezuela" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-8 left-8 z-20 text-white">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">Reporte Nacional</span>
                <p className="text-lg font-medium mt-1">Cifras Auditadas</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div>
              {/* AJUSTE 3: Modificado a Azul Institucional #2F92B9 */}
              <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block mb-3">Estadísticas en Tiempo Real</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1E293B] uppercase">Datos de la Industria</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-10 border-t border-slate-100 pt-8">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-5xl font-bold text-[#2F92B9] tracking-tight mb-2">
                    <Counter value="32" />%
                  </div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-800 mb-1">Ocupación Hotelera</h4>
                  <p className="text-xs text-slate-400 font-light mb-3">Promedio base consolidado a nivel nacional.</p>
                </div>
                <span className="text-[9px] font-mono tracking-wider text-slate-300 uppercase block">Fuente: FENAHOVEN / CONSETURISMO</span>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-5xl font-bold text-[#1E293B] tracking-tight mb-2">
                    $<Counter value="80" />
                  </div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-800 mb-1">Tarifa Promedio Premium</h4>
                  <p className="text-xs text-slate-400 font-light mb-3">Eje de comercialización del segmento de alta gama.</p>
                </div>
                <span className="text-[9px] font-mono tracking-wider text-slate-300 uppercase block">Fuente: Monitoreo de Mercado Estimado</span>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-5xl font-bold text-amber-600 tracking-tight mb-2">
                    <Counter value="24" />
                  </div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-800 mb-1">Estados Monitoreados</h4>
                  <p className="text-xs text-slate-400 font-light mb-3">Inteligencia turística de cobertura absoluta.</p>
                </div>
                <span className="text-[9px] font-mono tracking-wider text-slate-300 uppercase block">Fuente: División de Estadística FENAHOVEN</span>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-5xl font-bold text-emerald-600 tracking-tight mb-2">
                    +<Counter value="15" />%
                  </div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-800 mb-1">Crecimiento en Eventos</h4>
                  <p className="text-xs text-slate-400 font-light mb-3">Dinamización por turismo de espectáculos.</p>
                </div>
                <span className="text-[9px] font-mono tracking-wider text-slate-300 uppercase block">Fuente: Reporte de Afiliados Trimestral</span>
              </div>
            </div>

            <div className="pt-6">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#1E293B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full overflow-hidden hover:bg-[#2F92B9] transition-colors duration-300 shadow-sm">
                <span>Datos y Cifras</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* 5.5 PANEL DE RENDIMIENTO REGIONAL */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Resumen Editorial Izquierdo */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* AJUSTE 1: Aplicado Ocupación hotelera 2026 estilo ACTUALIDAD */}
                <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block mb-2">
                  Ocupación hotelera 2026
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  Análisis del <br />Reporte Trienal
                </h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  El monitoreo actual evidencia un núcleo de ocupación estable en regiones piloto, facilitando la planificación técnica y la escalabilidad de la oferta sectorial.
                </p>
              </div>

              {/* Badges de Análisis Rápido */}
              <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600"><strong className="text-slate-900 font-semibold">Liderazgo:</strong> La Guaira encabeza la matriz con 38.24%, seguido por Carabobo y Táchira.</p>
                </div>
                <div className="flex items-start gap-3 border-t border-slate-100 pt-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600"><strong className="text-slate-900 font-semibold">En Observación:</strong> Lara (13.32%) and Aragua (13.75%) registran niveles críticos.</p>
                </div>
              </div>
            </div>

            {/* Contenedor del Gráfico de Barras */}
            <div className="lg:col-span-8 bg-white border border-slate-200/70 rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10 text-xs">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#2F92B9]" />
                  {/* AJUSTE 2: Tipografía unificada a tracking corporativo */}
                  <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block">
                    Matriz por Entidad Federal (%)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md">Enero 2026</span>
              </div>

              <div className="w-full h-80 relative z-10 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={reportData} margin={{ top: 10, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="estado" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 45]} />
                    <Tooltip content={<CustomChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                    
                    {/* Línea de Referencia del Promedio Nacional */}
                    <ReferenceLine 
                      y={21.99} 
                      stroke="#F43F5E" 
                      strokeDasharray="5 5" 
                      strokeWidth={1.5}
                      label={{ value: 'Promedio Nacional: 21.99%', fill: '#F43F5E', position: 'top', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }} 
                    />
                    
                    <Bar dataKey="ocupacion" fill="#2F92B9" radius={[8, 8, 0, 0]} barSize={45} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BANNER OCUPACIÓN HOTELERA */}
      <section className="pt-12 px-6 md:px-12 max-w-7xl mx-auto">
        <div 
          className="relative rounded-3xl overflow-hidden bg-cover bg-center py-20 px-8 md:px-16 text-center shadow-xl border border-slate-100"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(16, 23, 42, 0.85), rgba(16, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000&auto=format&fit=crop')` 
          }}
        >
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Ocupación Hotelera Nacional
            </h3>
            <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
              Resultados del Sistema Nacional de Estadísticas correspondientes al mes de enero.
            </p>
            <div className="pt-4">
              <a 
                href="/reporte-ocupacion.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block border border-white text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded-md hover:bg-white hover:text-[#10172A] transition-all duration-300"
              >
                descargar el reporte
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5. SECCIÓN ESTRATÉGICA: NOTICIAS DEL SECTOR */}
      <section className="py-28 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-100 pb-6 gap-4">
            <div>
              <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block mb-2">Actualidad</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
                Noticias del Sector
              </h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#2F92B9] cursor-pointer transition-colors">
              Ver todas las noticias →
            </span>
          </div>

          {/* Grid Editorial de Noticias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Noticia 1 */}
            <div className="group cursor-pointer space-y-4">
              <div className="overflow-hidden rounded-2xl aspect-[16/10] bg-slate-100 border border-slate-100/50 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=600&auto=format&fit=crop" 
                  alt="Mesa de trabajo gremial"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 select-none"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] font-mono tracking-wider text-slate-400">
                  <span className="text-[#2F92B9] uppercase font-bold">Gremial</span>
                  <span>•</span>
                  <span>10 Jun 2026</span>
                </div>
                <h3 className="text-base font-bold text-slate-950 group-hover:text-[#2F92B9] transition-colors leading-snug">
                  FENAHOVEN estrecha lazos con cámaras regionales para impulsar el turismo sostenible
                </h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-3">
                  Mesas de trabajo conjuntas definen la hoja de ruta estratégica para la implementación de certificaciones y estándares sustentables en la hotelería nacional.
                </p>
              </div>
            </div>

            {/* Noticia 2 */}
            <div className="group cursor-pointer space-y-4">
              <div className="overflow-hidden rounded-2xl aspect-[16/10] bg-slate-100 border border-slate-100/50 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop" 
                  alt="Inversión hotelera"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 select-none"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] font-mono tracking-wider text-slate-400">
                  <span className="text-[#2F92B9] uppercase font-bold">Inversión</span>
                  <span>•</span>
                  <span>05 Jun 2026</span>
                </div>
                <h3 className="text-base font-bold text-slate-950 group-hover:text-[#2F92B9] transition-colors leading-snug">
                  Cadenas internacionales evalúan nuevas aperturas en el eje norte-costero
                </h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-3">
                  Representantes del sector privado confirman el renovado interés de capital extranjero en proyectos de infraestructura turística de alta gama en el país.
                </p>
              </div>
            </div>

            {/* Noticia 3 */}
            <div className="group cursor-pointer space-y-4">
              <div className="overflow-hidden rounded-2xl aspect-[16/10] bg-slate-100 border border-slate-100/50 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop" 
                  alt="Capacitación técnica"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 select-none"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] font-mono tracking-wider text-slate-400">
                  <span className="text-[#2F92B9] uppercase font-bold">Capacitación</span>
                  <span>•</span>
                  <span>28 May 2026</span>
                </div>
                <h3 className="text-base font-bold text-slate-950 group-hover:text-[#2F92B9] transition-colors leading-snug">
                  Culmina con éxito el primer ciclo formativo de actualización técnica del año
                </h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed line-clamp-3">
                  Más de 150 profesionales del alojamiento completaron la capacitación enfocada en optimización operativa, revenue management y atención al cliente.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. RED DE GREMIOS Y ALIANZAS */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            {/* AJUSTE 4: Modificado Ecosistema Institutional a Azul Institucional #2F92B9 */}
            <span className="text-xs font-bold text-[#2F92B9] uppercase tracking-[0.3em] block mb-3">Ecosistema Institutional</span>
            <h2 className="text-3xl font-bold tracking-tight text-[#10172A] uppercase">Red de Gremios y Alianzas</h2>
            <p className="text-slate-500 mt-2 font-light text-sm">Trabajamos de la mano con las principales organizaciones turísticas y comerciales del país.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-12 md:gap-8 items-center justify-center">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center p-2 group transition-all duration-300"
              >
                <img 
                  src={partner.src} 
                  alt={partner.alt} 
                  title={partner.alt}
                  className={`${partner.className} object-contain transform group-hover:scale-105 transition-all duration-300 select-none`} 
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FOOTER INSTITUCIONAL COMPLETO */}
      <footer className="bg-[#2F92B9] text-white pt-20 pb-10">
        
        {/* Contenedor Maestro */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 pb-12">
          
          {/* Bloque Izquierdo: Logo PNG */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center justify-start">
              <img 
                src="/logowebfenahoven.png" 
                alt="FENAHOVEN" 
                className="h-48 md:h-54 w-auto object-contain select-none"
              />
            </div>
            <p className="text-xs text-slate-100 font-light leading-relaxed max-w-xs">
              Federación Nacional de Hoteles de Venezuela. Potenciando la hospitalidad, infraestructura e inversión turística estratégica desde 1958.
            </p>
          </div>

          {/* Bloque Centro-Izquierda: Navegación */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white">Secciones</h4>
            <ul className="space-y-2.5 text-xs text-slate-100 font-light">
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Quiénes somos?</li>
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Directorio Nacional</li>
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Noticias del Sector</li>
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Eventos & Congresos</li>
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Capacitación Técnica</li>
            </ul>
          </div>

          {/* Bloque Centro-Derecha: Institucional */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white">Afiliados</h4>
            <ul className="space-y-2.5 text-xs text-slate-100 font-light">
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Cámaras Regionales</li>
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Inscripción Gremial</li>
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Estatutos Oficiales</li>
              <li className="hover:text-slate-200 pointer-events-none transition-colors">Bolsa de Trabajo</li>
            </ul>
          </div>

          {/* Bloque Derecho: Ubicación e Información de Registro */}
          <div className="md:col-span-3 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-white">Sede Central</h4>
              <p className="text-xs text-slate-100 font-light leading-relaxed">
                Av. Principal de Las Mercedes, Edificio Centro Las Mercedes, Piso 4, Oficina 41. Caracas, Distrito Capital, Venezuela.
              </p>
              <div className="text-xs text-slate-200 font-mono">
                <span className="block">Rif: J-00248834-0</span>
              </div>
            </div>

            {/* Enlaces de Legal */}
            <div className="flex gap-6 text-xs text-slate-100 pt-4 md:pt-0">
              <span className="hover:text-white cursor-pointer transition-colors font-medium">Términos de Uso</span>
              <span className="hover:text-white cursor-pointer transition-colors font-medium">Políticas de Privacidad</span>
            </div>
          </div>

        </div>

        {/* Línea Divisoria Blanca */}
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="w-full h-[1px] bg-white/20" />
        </div>

        {/* Cierre Inferior */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-200 font-light gap-4">
          
          <div className="text-center sm:text-left select-none tracking-wide text-slate-100">
            © 2026 FENAHOVEN. Todos los derechos reservados.
          </div>
          
          <div className="text-center sm:text-right">
            <a 
              href="https://onshift.com.ve" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Diseñado por</span>
              <span className="font-bold tracking-tight text-white hover:underline uppercase text-[10px]">onshift</span>
            </a>
          </div>

        </div>

      </footer>

    </div>
  );
}