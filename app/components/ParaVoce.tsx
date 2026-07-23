'use client';

// Importação dos hooks do React
import { useEffect, useState } from 'react';

// Importação dos componentes visuais
import CardClimatico from '@/app/components/CardClimatico';
import Grafico from '@/app/components/Grafico';
import MapaTermico from '@/app/components/MapaTermico';

// Importação de utilitários, serviços e interfaces
import { classificarUV } from '@/services/clima';
import { getClimaPraia, PRAIAS_ILHA, praiaMaisProxima } from '@/services/praia';
import { ParaVoceProps } from '@/interfaces/ParaVoce';
import { indiceHorarioAtual } from '@/utils/utilidades';

// Estilo padrão reutilizável para os cards da interface
const ESTILO_CARD_BASE = "bg-white border-4 border-[#1e40af] rounded-2xl shadow-xl p-6 text-center";

export default function ParaVoce({
    carregando,
    municipioUsuario,
    bairroUsuario,
    latitudeUsuario,
    longitudeUsuario,
    informacoesClimaticasAtuais,
    historicoClimatico,
    mediasHistoricas,
    riscoAlagamento,
    melhorHoraPraia
}: ParaVoceProps) {

    // Desestruturação dos dados climáticos atuais
    const {
        Temperatura,
        Umidade,
        Precipitação,
        Chuva,
        "Velocidade do vento": velocidadeVento,
        "Temperatura Aparente": temperaturaAparente,
        "Índice UV": indiceUV,
    } = informacoesClimaticasAtuais;

    // Obtém a classificação de risco com base no índice UV atual
    const uvClassificado = classificarUV(indiceUV ?? null);

    // --- ESTADOS LOCAIS ---
    // Guarda a praia selecionada pelo usuário (inicia com a primeira da lista)
    const [praiaSelecionada, setPraiaSelecionada] = useState(PRAIAS_ILHA[0]);
    // Armazena as informações de clima específicas da praia selecionada
    const [climaPraia, setClimaPraia] = useState<any>({});

    // Encontra o índice da hora atual para extrair dados em tempo real da praia
    const indiceAgoraPraia = indiceHorarioAtual(climaPraia.hourly?.time || []);

    // 1. Define a praia mais próxima com base na localização atual do usuário
    useEffect(() => {
        if (latitudeUsuario && longitudeUsuario) {
            setPraiaSelecionada(praiaMaisProxima(latitudeUsuario, longitudeUsuario));
        }
    }, [latitudeUsuario, longitudeUsuario]);

    // 2. Busca as condições de clima da praia sempre que a praia selecionada for alterada
    useEffect(() => {
        if (praiaSelecionada) {
            getClimaPraia(praiaSelecionada.latitude, praiaSelecionada.longitude).then(setClimaPraia);
        }
    }, [praiaSelecionada]);

    return (
        <div>
            {/* SEÇÃO 1: CONDIÇÕES ATUAIS DO MUNICÍPIO */}
            <section className="flex flex-col justify-center items-center py-12 md:py-16 bg-[#f8fafc]">
                <div className="max-w-5xl w-full px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#1e3a8a] mb-3 px-2">
                        Como está o tempo em{" "}
                        <span className="text-[#1e40af]">
                            {carregando ? "localizando..." : (municipioUsuario || "sua região")}?
                        </span>
                    </h2>
                    <p className="text-center text-gray-600 mb-10 md:mb-12 text-sm md:text-base">
                        Dados climáticos em tempo real
                    </p>

                    {/* Grid de cards com métricas do tempo */}
                    <section className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
                        <CardClimatico nome="Temperatura" dado={Temperatura} unidade="°C" descricao={carregando ? "Carregando..." : "Buscando temperatura..."} />
                        <CardClimatico nome="Sensação Térmica" dado={temperaturaAparente} unidade="°C" descricao={carregando ? "Carregando..." : "Buscando sensação térmica..."} />
                        <CardClimatico nome="Umidade" dado={Umidade} unidade="%" descricao={carregando ? "Carregando..." : "Buscando umidade..."} />
                        <CardClimatico nome="Velocidade do Vento" dado={velocidadeVento} unidade=" km/h" descricao={carregando ? "Carregando..." : "Buscando velocidade do vento..."} />
                        <CardClimatico nome="Precipitação" dado={Precipitação} unidade=" mm" descricao={carregando ? "Carregando..." : "Buscando precipitação..."} />
                        <CardClimatico nome="Chuva" dado={Chuva} unidade=" mm" descricao={carregando ? "Carregando..." : "Buscando chuva..."} />
                    </section>

                    {/* Card de alerta do Índice UV */}
                    {indiceUV !== undefined && (
                        <div className={`mt-8 max-w-sm mx-auto ${ESTILO_CARD_BASE}`}>
                            <p className="text-sm uppercase tracking-wide font-semibold text-[#1e3a8a] mb-2">Índice UV</p>
                            <p className="text-3xl font-serif font-bold text-[#1e3a8a]">{indiceUV} — {uvClassificado.nivel}</p>
                            <p className="text-xs mt-2 text-gray-600">
                                {["Alto", "Muito Alto", "Extremo"].includes(uvClassificado.nivel)
                                    ? "Use protetor solar e evite exposição prolongada."
                                    : "Exposição segura com proteção básica."}
                            </p>
                        </div>
                    )}

                    {/* Card de Médias Históricas */}
                    {mediasHistoricas.temperaturaMedia !== null && (
                        <div className={`mt-8 max-w-2xl mx-auto ${ESTILO_CARD_BASE}`}>
                            <p className="text-sm uppercase tracking-wide font-semibold text-[#1e3a8a] mb-2">
                                Como costuma ser em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
                            </p>
                            <p className="text-gray-700">
                                Média histórica de temperatura: <strong>{mediasHistoricas.temperaturaMedia}°C</strong>
                                {Temperatura !== undefined && <> (hoje: <strong>{Temperatura}°C</strong>)</>}
                            </p>
                            <p className="text-gray-700 mt-1">
                                Chuva acumulada média no mês (últimos anos): <strong>{mediasHistoricas.chuvaTotalMedia} mm</strong>
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* SEÇÃO 2: DADOS DO BAIRRO E RISCO DE ALAGAMENTO */}
            <section className="flex flex-col justify-center items-center py-12 md:py-16 bg-white">
                <div className="max-w-5xl w-full px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#1e3a8a] mb-3 px-2">
                        No seu bairro{" "}
                        <span className="text-[#1e40af]">
                            {carregando ? "localizando..." : (bairroUsuario || "não identificado")}
                        </span>
                    </h2>
                    <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
                        Informações locais específicas
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch flex-wrap">
                        <div className={`flex-1 max-w-sm mx-auto ${ESTILO_CARD_BASE}`}>
                            <p className="text-sm uppercase tracking-wide font-semibold text-[#1e3a8a] mb-2">Risco de Alagamento</p>
                            <p className="text-3xl font-serif font-bold text-[#1e3a8a]">{riscoAlagamento.nivel}</p>
                            <p className="text-xs mt-2 text-gray-600">Pontuação: {riscoAlagamento.pontuacao ?? riscoAlagamento.pontuacao}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 3: CLIMA E RECOMENDAÇÕES PARA PRAIAS */}
            <section className="flex flex-col justify-center items-center py-12 md:py-16 bg-[#f8fafc]">
                <div className="max-w-5xl w-full px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#1e3a8a] mb-6 px-2">
                        Clima nas Praias da Ilha
                    </h2>

                    {/* Botões para troca de praia */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {PRAIAS_ILHA.map((praia) => (
                            <button
                                key={praia.nome}
                                onClick={() => setPraiaSelecionada(praia)}
                                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                                    praiaSelecionada.nome === praia.nome
                                        ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                                        : "bg-white text-[#1e3a8a] border-[#1e3a8a]/40 hover:border-[#1e3a8a]"
                                }`}
                            >
                                {praia.nome}
                            </button>
                        ))}
                    </div>

                    {/* Recomendação da melhor hora para ir à praia */}
                    <div className='py-5'>
                        {melhorHoraPraia && (
                            <div className={`max-w-sm mx-auto ${ESTILO_CARD_BASE}`}>
                                <p className="text-sm uppercase tracking-wide font-semibold text-[#1e3a8a] mb-2">Melhor Hora para Praia</p>
                                <p className="text-2xl font-serif font-bold text-[#1e3a8a]">{melhorHoraPraia}</p>
                            </div>
                        )}
                    </div>

                    {/* Dados atuais da praia selecionada */}
                    <div className={`max-w-xl mx-auto ${ESTILO_CARD_BASE}`}>
                        <p className="text-sm uppercase tracking-wide font-semibold text-[#1e3a8a] mb-2">
                            {praiaSelecionada.nome}
                        </p>
                        <p className="text-gray-700">
                            Chuva agora: <strong>{climaPraia.hourly?.rain?.[indiceAgoraPraia] ?? "—"} mm</strong>
                        </p>
                        <p className="text-gray-700 mt-1">
                            Vento agora: <strong>{climaPraia.hourly?.wind_speed_10m?.[indiceAgoraPraia] ?? "—"} km/h</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 4: GRÁFICOS DO HISTÓRICO CLIMÁTICO E MAPA TÉRMICO */}
            <section className="px-4 md:px-6 pb-20 space-y-8 md:space-y-12">
                <div className="max-w-5xl mx-auto bg-white border-4 border-[#1e40af] rounded-3xl shadow-xl p-6 md:p-8">
                    <h2 className="text-center font-serif text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-8 md:mb-10 tracking-wide">
                        Histórico Climatológico
                    </h2>
                    <div className="space-y-10 md:space-y-12">
                        {/* Correção de digitação na prop 'descricao' dos gráficos */}
                        <Grafico dados={historicoClimatico} tipo="temperature_2m" descricao="Temperatura" />
                        <Grafico dados={historicoClimatico} tipo="relative_humidity_2m" descricao="Umidade do Ar" />
                        <Grafico dados={historicoClimatico} tipo="apparent_temperature" descricao="Temperatura Aparente" />
                        <Grafico dados={historicoClimatico} tipo="rain" descricao="Chuva" />
                        <Grafico dados={historicoClimatico} tipo="precipitation_probability" descricao="Possibilidade de Precipitação" />
                        <Grafico dados={historicoClimatico} tipo="uv_index" descricao="Índice UV" />
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <MapaTermico dados={historicoClimatico} tipo="temperature_2m" descricao="Mapa Térmico" />
                </div>
            </section>
        </div>
    );
}