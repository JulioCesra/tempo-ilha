'use client';
import { useState, useEffect } from 'react';
import CardClimaticoAtual from './componentes/cardClimaticosAtuais';
import GraficoLinha from './componentes/graficoLinha';
import MapaTermico from './componentes/MapaTermico';

function localidadeUsuario(setLat: (v: number) => void, setLng: (v: number) => void) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
        });
    }
}

async function municipioUsuario(latitude: number, longitude: number): Promise<string> {
    if (!latitude || !longitude) return "Latitude ou Longitude não apresentam valores corretos";
    const URL = `https://api-bdc.io/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar município do usuário");
        const dados = await resposta.json();
        return dados.city || dados.locality || "sua região";
    } catch (erro) {
        console.log(erro);
        return "Erro na requisição do município";
    }
}

async function buscarHistorico(latitude: number, longitude: number): Promise<any> {
    if (!latitude || !longitude) return {};
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain,apparent_temperature,precipitation_probability&timezone=GMT`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar histórico dos dados climáticos");
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.log(erro);
        return {};
    }
}

interface InformacoesClimaticas {
    Temperatura?: number;
    Umidade?: number;
    Precipitação?: number;
    Chuva?: number;
    "Velocidade do vento"?: number;
    "Temperatura Aparente"?: number;
    Condição?: string;
}

async function buscarInformacoesClimaticasAtuais(latitude: number, longitude: number): Promise<InformacoesClimaticas> {
    if (!latitude || !longitude) return {};
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m&timezone=GMT`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar dados climáticos atuais");
        const dados = await resposta.json();
        return {
            Temperatura: dados.current.temperature_2m,
            Umidade: dados.current.relative_humidity_2m,
            Precipitação: dados.current.precipitation,
            Chuva: dados.current.rain,
            "Velocidade do vento": dados.current.wind_speed_10m,
            "Temperatura Aparente": dados.current.apparent_temperature
        };
    } catch (erro) {
        console.log(erro);
        return {};
    }
}

export default function TempoIlha() {
    const [latitudeUsuario, setLatitudeUsuario] = useState<number>(0);
    const [longitudeUsuario, setLongitudeUsuario] = useState<number>(0);
    const [municipio, setMunicipio] = useState<string>("");
    const [informacoesClimaticasAtuais, setInformacoesClimaticasAtuais] = useState<InformacoesClimaticas>({});
    const [historicoClimatico, setHistoricoClimatico] = useState<any>({});
    const [carregando, setCarregando] = useState<boolean>(true);

    useEffect(() => {
        localidadeUsuario(setLatitudeUsuario, setLongitudeUsuario);
    }, []);

    useEffect(() => {
        if (latitudeUsuario !== 0 && longitudeUsuario !== 0) {
            setCarregando(true);
            Promise.all([
                municipioUsuario(latitudeUsuario, longitudeUsuario),
                buscarInformacoesClimaticasAtuais(latitudeUsuario, longitudeUsuario),
                buscarHistorico(latitudeUsuario, longitudeUsuario)
            ]).then(([nomeMunicipio, climaAtual, historico]) => {
                setMunicipio(nomeMunicipio);
                setInformacoesClimaticasAtuais(climaAtual);
                setHistoricoClimatico(historico);
                setCarregando(false);
            }).catch(err => {
                console.error("Erro ao buscar dados climáticos", err);
                setCarregando(false);
            });
        }
    }, [latitudeUsuario, longitudeUsuario]);

    const {
        Temperatura,
        Umidade,
        Precipitação,
        Chuva,
        "Velocidade do vento": velocidadeVento,
        "Temperatura Aparente": tempAparente
    } = informacoesClimaticasAtuais;

    return (
        <>
            <section className="w-full min-h-screen bg-[radial-gradient(#1e3a8a_0.8px,transparent_1px)] bg-[length:20px_20px] flex justify-center items-center relative overflow-hidden px-4">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                
                <article className="p-8 md:p-12 bg-white/95 backdrop-blur-md border-4 border-[#1e40af] rounded-3xl shadow-2xl text-center max-w-xl relative z-10">
                    <div className="inline-block mb-6 px-6 py-2 bg-[#1e40af] text-white text-sm tracking-widest rounded-full border border-[#60a5fa]">
                        ILHA DO MARANHÃO
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1e3a8a] tracking-tight mb-4">
                        Tempo Ilha
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700">
                        Informações climáticas em tempo real de qualquer município da Ilha
                    </p>
                </article>
            </section>

            <section className="flex flex-col justify-center items-center py-12 md:py-16 bg-[#f8fafc]">
                <div className="max-w-5xl w-full px-4 md:px-6">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#1e3a8a] mb-3 px-2">
                        Como está o tempo em{" "}
                        <span className="text-[#1e40af]">
                            {carregando ? "localizando..." : (municipio || "sua região")}?
                        </span>
                    </h1>
                    <p className="text-center text-gray-600 mb-10 md:mb-12 text-sm md:text-base">
                        Dados climáticos em tempo real
                    </p>

                    <section className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
                        <CardClimaticoAtual
                            nome="Temperatura"
                            dado={Temperatura}
                            unidade="°C"
                            descricao={carregando ? "Carregando..." : "Buscando temperatura..."}
                        />
                        <CardClimaticoAtual
                            nome="Sensação Térmica"
                            dado={tempAparente}
                            unidade="°C"
                            descricao={carregando ? "Carregando..." : "Buscando sensação térmica..."}
                        />
                        <CardClimaticoAtual
                            nome="Umidade"
                            dado={Umidade}
                            unidade="%"
                            descricao={carregando ? "Carregando..." : "Buscando umidade..."}
                        />
                        <CardClimaticoAtual
                            nome="Velocidade do Vento"
                            dado={velocidadeVento}
                            unidade=" km/h"
                            descricao={carregando ? "Carregando..." : "Buscando velocidade do vento..."}
                        />
                        <CardClimaticoAtual
                            nome="Precipitação"
                            dado={Precipitação}
                            unidade=" mm"
                            descricao={carregando ? "Carregando..." : "Buscando precipitação..."}
                        />
                        <CardClimaticoAtual
                            nome="Chuva"
                            dado={Chuva}
                            unidade=" mm"
                            descricao={carregando ? "Carregando..." : "Buscando chuva..."}
                        />
                    </section>
                </div>
            </section>

            <section className="px-4 md:px-6 pb-20 space-y-8 md:space-y-12">
                <div className="max-w-5xl mx-auto bg-white border-4 border-[#1e40af] rounded-3xl shadow-xl p-6 md:p-8">
                    <h2 className="text-center font-serif text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-8 md:mb-10 tracking-wide">
                        Histórico Climatológico
                    </h2>
                    <div className="space-y-10 md:space-y-12">
                        <GraficoLinha dados={historicoClimatico} tipo="temperature_2m" descrisao="Temperatura" />
                        <GraficoLinha dados={historicoClimatico} tipo="relative_humidity_2m" descrisao="Umidade do Ar" />
                        <GraficoLinha dados={historicoClimatico} tipo="apparent_temperature" descrisao="Temperatura Aparente" />
                        <GraficoLinha dados={historicoClimatico} tipo="rain" descrisao="Chuva" />
                        <GraficoLinha dados={historicoClimatico} tipo="precipitation_probability" descrisao="Possibilidade de Precipitação" />
                    </div>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    <MapaTermico dados={historicoClimatico} />
                </div>
            </section>
        </>
    );
}