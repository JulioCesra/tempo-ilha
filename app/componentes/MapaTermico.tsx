'use client';
import { useMemo } from 'react';

interface MapaTermicoProps {
    dados: any; 
}

export default function MapaTermico({ dados }: MapaTermicoProps) {
    const horas = useMemo(() => {
        if (!dados?.hourly?.time || !dados?.hourly?.temperature_2m) return [];

        return dados.hourly.time.slice(0, 24).map((hora: string, index: number) => {
            const temperatura = dados.hourly.temperature_2m[index];
            const horaFormatada = new Date(hora).toLocaleTimeString('pt-BR', { hour: '2-digit' });

            const intensidade = Math.min(Math.max((temperatura - 15) / 25, 0), 1); 

            return {
                hora: horaFormatada,
                temperatura,
                intensidade,
                cor: `hsl(217, 80%, ${85 - intensidade * 45}%)`, 
            };
        });
    }, [dados]);

    const tempMin = Math.min(...horas.map(h => h.temperatura));
    const tempMax = Math.max(...horas.map(h => h.temperatura));

    return (
        <div className="w-full bg-white border-4 border-[#1e40af] rounded-3xl p-8 shadow-xl">
            <div className="flex flex-col items-center mb-8">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1e3a8a]">
                    Mapa Térmico — Próximas 24h
                </h2>
                <div className="text-sm text-gray-500">
                    Min: <span className="font-semibold text-[#1e40af]">{tempMin}°C</span> • 
                    Máx: <span className="font-semibold text-[#1e40af]">{tempMax}°C</span>
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-12 gap-3">
                {horas.map((item, index) => (
                    <div key={index} className="flex flex-col items-center group">
                        
                        <div 
                            className="w-full aspect-square rounded-2xl border-2 border-[#1e40af] flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md relative overflow-hidden"
                            style={{ 
                                backgroundColor: item.cor,
                                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.4)'
                            }}
                        >
                            <div className="absolute inset-0 border border-white/30 rounded-2xl"></div>
                            
                            <span className="text-2xl font-bold text-[#1e3a8a] drop-shadow-sm">
                                {item.temperatura}
                            </span>
                            <span className="text-xs font-medium text-[#1e40af]/90">°C</span>
                        </div>

                        
                        <span className="text-xs font-medium text-gray-600 mt-2 tracking-wider">
                            {item.hora}h
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#bfdbfe]"></div>
                    <span className="text-gray-600">Mais fresco</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#1e40af]"></div>
                    <span className="text-gray-600">Mais quente</span>
                </div>
            </div>
        </div>
    );
}