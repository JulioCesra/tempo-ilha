'use client';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';  

interface OpenMeteoData {
    hourly?: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m?: number[];
        [key: string]: any;
    };
}

interface GraficoProps {    
    dados: OpenMeteoData;
    tipo: 'temperature_2m' | 'relative_humidity_2m' | 'rain' | 'apparent_temperature' | 'precipitation_probability' | string;
    descricao: string;
}  

export default function Grafico({ dados, tipo, descricao }: GraficoProps) {    
    if (!dados || !dados.hourly || !dados.hourly.time || !dados.hourly[tipo]) {
        return (
            <div className="flex h-64 md:h-80 w-full items-center justify-center p-4 text-[#64748b] bg-white border border-[#e2e8f0] rounded-3xl">
                Carregando dados de {descricao.toLowerCase()}...
            </div>
        );
    }

    const proximas24Horas = dados.hourly.time.slice(0, 24);
    const dadosFormatados = proximas24Horas.map((hora, index) => {
        const horaFormatada = new Date(hora).toLocaleTimeString('pt-BR', {
            hour: '2-digit'
        });
        return {
            tempo: horaFormatada,
            valor: dados.hourly?.[tipo]?.[index] ?? 0
        };
    });

    const obterUnidade = (tipoDado: string) => {
        if (tipoDado.includes('temperature')) return '°C';
        if (tipoDado.includes('rain') || tipoDado.includes('precipitation')) return ' mm';
        if (tipoDado.includes('humidity') || tipoDado.includes('probability')) return '%';
        return '';
    };

    const unidade = obterUnidade(tipo);

    return (        
        <div className="w-full bg-white border-2 border-[#1e40af] rounded-3xl p-5 md:p-8 shadow-md">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1e3a8a] mb-6 text-center font-serif tracking-wide">
                {descricao}
            </h3>
            
            <div className="h-72 sm:h-80 md:h-96"> {/* Altura responsiva */}
                <ResponsiveContainer width="100%" height="100%">        
                    <LineChart            
                        data={dadosFormatados}            
                        margin={{ 
                            top: 10, 
                            right: 10, 
                            left: 0, 
                            bottom: 20   
                        }}        
                    >            
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />            
                        <XAxis
                            dataKey="tempo"
                            stroke="#475569"
                            fontSize={11}           
                            tickLine={false}
                            axisLine={{ stroke: '#94a3b8' }}
                            angle={-45}             
                            textAnchor="end"
                            height={50}
                            interval={3}            
                        />            
                        <YAxis
                            stroke="#475569"
                            unit={unidade}
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: '#94a3b8' }}
                            width={45}
                        />            
                        <Tooltip            
                            cursor={{ stroke: '#60a5fa', strokeWidth: 2, strokeOpacity: 0.6 }}            
                            contentStyle={{                
                                backgroundColor: '#ffffff',                
                                borderColor: '#1e40af',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgb(30 58 138 / 0.1)',
                                fontSize: '14px'
                            }}
                            formatter={(value: any) => [`${value}${unidade}`, descricao]}
                            labelFormatter={(label) => `Horário: ${label}`}
                        />            
                        <Legend 
                            wrapperStyle={{ 
                                fontSize: '13px', 
                                paddingTop: '10px', 
                                color: '#1e40af' 
                            }} 
                        />            
                        <Line            
                            name={descricao}
                            type="natural"            
                            dataKey="valor"
                            stroke="#1e40af"              
                            strokeWidth={3}              
                            dot={{ fill: '#3b82f6', r: 3 }}
                            activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 3 }}            
                        />        
                    </LineChart>        
                </ResponsiveContainer>    
            </div>
        </div>
    );
}