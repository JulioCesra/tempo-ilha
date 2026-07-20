'use client';
import { useMemo } from 'react';

interface HoraItem {
    hora: string;
    valor: number;
    intensidade: number;
    cor: string;
}

interface MapaTermicoProps {
    dados: any;
    tipo: string;
    descricao: string;
}

export default function MapaTermico({ dados, tipo, descricao }: MapaTermicoProps) {
    const horas = useMemo((): HoraItem[] => {
        if (!dados?.hourly?.time || !dados?.hourly?.[tipo]) return [];

        const valores = dados.hourly[tipo];
        const min = Math.min(...valores.slice(0, 24));
        const max = Math.max(...valores.slice(0, 24));

        return dados.hourly.time.slice(0, 24).map((hora: string, index: number) => {
            const valor = valores[index];
            const horaFormatada = new Date(hora).toLocaleTimeString('pt-BR', { hour: '2-digit' });
            const intensidade = max !== min ? (valor - min) / (max - min) : 0.5;

            return {
                hora: horaFormatada,
                valor: valor,
                intensidade,
                cor: `hsl(217, 80%, ${85 - intensidade * 45}%)`,
            };
        });
    }, [dados, tipo]);

    const valorMin = horas.length ? Math.min(...horas.map(h => h.valor)) : 0;
    const valorMax = horas.length ? Math.max(...horas.map(h => h.valor)) : 0;

    return (
        <div className="w-full bg-white border-4 border-[#1e40af] rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col items-center mb-8">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1e3a8a]">
                    {descricao} — Próximas 24h
                </h2>
                <div className="text-sm text-gray-500 mt-1">
                    Min: <span className="font-semibold text-[#1e40af]">{valorMin}</span> •
                    Máx: <span className="font-semibold text-[#1e40af]">{valorMax}</span>
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
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
                                {item.valor}
                            </span>
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
                    <span className="text-gray-600">Menor</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#1e40af]"></div>
                    <span className="text-gray-600">Maior</span>
                </div>
            </div>
        </div>
    );
}