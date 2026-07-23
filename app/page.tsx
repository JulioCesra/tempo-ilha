'use client';

// Importação dos hooks do React
import { useState, useEffect } from 'react';

// Importação dos componentes da interface
import Home from './components/Home';
import Aviso from './components/Aviso';
import SeletorAbas from './components/SeletorAbas';
import Rodape from './components/Rodape';
import ParaVoce from './components/ParaVoce';
import ParaPescadores from './components/ParaPescadores';

// Importação dos serviços e funções utilitárias
import { getHistoricoMaritimo } from '@/services/mar';
import { coordenadasUsuario, getMunicipioDoUsuario, getBairroDoUsuario } from '@/services/usuario';
import { getHistoricoClimatico, getMediaHistoricaTemperaturaEChuva, getInformacoesClimaticasAtuais } from '@/services/clima';
import { indiceHorarioAtual } from '@/utils/utilidades';
import { formatarHorarioPraia } from '@/services/praia';

/**
 * Avalia o vento atual e futuro para definir a segurança da pesca.
 */
function calcularCondicaoPesca(informacoesAtuais: any, ventoProximasHoras: number[]) {
    // Pega a velocidade atual do vento ou define como nulo
    const ventoAtual = informacoesAtuais?.["Velocidade do vento"] ?? null;
    if (ventoAtual === null) return { nivel: "Sem dados", mensagem: "Aguardando dados de vento." };

    // Identifica o vento mais forte nas próximas horas
    const ventoMaximo = ventoProximasHoras.length ? Math.max(...ventoProximasHoras) : ventoAtual;

    // Regras de decisão baseadas na velocidade do vento
    if (ventoMaximo >= 40) return { nivel: "Não recomendado", mensagem: "Ventos fortes previstos — evite sair pra pescar." };
    if (ventoMaximo >= 25) return { nivel: "Atenção", mensagem: "Vento moderado a forte — redobre o cuidado no mar." };
    return { nivel: "Condições seguras", mensagem: "Vento fraco a moderado — condições favoráveis." };
}

/**
 * Calcula a probabilidade de alagamento cruzando chuva acumulada e altura da maré.
 */
function calcularRiscoAlagamento(historicoClimatico: any, historicoMaritimo: any) {
    // Extrai dados climáticos e marítimos (variáveis traduzidas para o português)
    const listaChuva: number[] = historicoClimatico.hourly?.rain || [];
    const listaHorarios: string[] = historicoClimatico.hourly?.time || [];
    const alturasOnda: number[] = historicoMaritimo.hourly?.wave_height || [];
    const listaHorariosMar: string[] = historicoMaritimo.hourly?.time || [];

    if (!listaChuva.length) return { nivel: "Sem dados", pontuacao: 0 };

    // Relaciona cada horário com a sua respectiva altura de maré
    const marePorHorario: Record<string, number> = {};
    listaHorariosMar.forEach((horario, indice) => { 
        marePorHorario[horario] = alturasOnda[indice]; 
    });

    // Encontra a hora atual e calcula chuvas recente e acumulada
    const indiceAtual = indiceHorarioAtual(listaHorarios);
    const chuvaUltimaHora = listaChuva[indiceAtual] || 0;
    const inicioJanela = Math.max(0, indiceAtual - 6);
    const chuvaAcumulada6h = listaChuva.slice(inicioJanela, indiceAtual + 1).reduce((soma, valor) => soma + (valor || 0), 0);
    const mareAtual = marePorHorario[listaHorarios[indiceAtual]] ?? 0;

    // Fórmula do cálculo do risco (pesos para chuva recente, acumulada e maré)
    const pontuacao = chuvaUltimaHora * 2 + chuvaAcumulada6h * 1 + mareAtual * 3;

    // Categorização do risco
    let nivel = "Baixo";
    if (pontuacao > 15) nivel = "Alto";
    else if (pontuacao > 7) nivel = "Moderado";

    return { nivel, pontuacao: Math.round(pontuacao * 10) / 10 };
}

export default function TempoIlha() {
    // --- ESTADOS DO COMPONENTE ---
    const [carregando, setCarregando] = useState<boolean>(true);

    // Dados de localização do usuário
    const [latitudeUsuario, setLatitudeUsuario] = useState<number>(0.0);
    const [longitudeUsuario, setLongitudeUsuario] = useState<number>(0.0);
    const [municipioUsuario, setMunicipioUsuario] = useState<string>("");
    const [bairroUsuario, setBairroUsuario] = useState<string>("");

    // Dados meteorológicos e marítimos
    const [informacoesClimaticasAtuais, setInformacoesClimaticasAtuais] = useState<any>({});
    const [historicoClimatico, setHistoricoClimatico] = useState<any>({});
    const [historicoMaritimo, setHistoricoMaritimo] = useState<any>({});
    const [mediasHistoricas, setMediasHistoricas] = useState<{ temperaturaMedia: number | null; chuvaTotalMedia: number | null }>({ temperaturaMedia: null, chuvaTotalMedia: null });

    // Resultados calculados
    const [melhorHoraPraiaFormatada, setMelhorHoraPraiaFormatada] = useState<string>("");
    const [riscoAlagamento, setRiscoAlagamento] = useState<{ nivel: string; pontuacao: number }>({ nivel: "Sem dados", pontuacao: 0 });
    const [condicaoPesca, setCondicaoPesca] = useState<{ nivel: string; mensagem: string }>({ nivel: "Sem dados", mensagem: "" });

    // Estado para navegação por abas
    const [abaAtiva, setAbaAtiva] = useState<string>("geral");

    // 1. Obtém as coordenadas GPS do usuário logo ao carregar o componente
    useEffect(() => {
        coordenadasUsuario(setLatitudeUsuario, setLongitudeUsuario);
    }, []);

    // 2. Busca todas as informações das APIs assim que as coordenadas forem encontradas
    useEffect(() => {
        if (latitudeUsuario !== 0 && longitudeUsuario !== 0) {
            setCarregando(true);
            Promise.all([
                getMunicipioDoUsuario(latitudeUsuario, longitudeUsuario),
                getBairroDoUsuario(latitudeUsuario, longitudeUsuario),
                getInformacoesClimaticasAtuais(latitudeUsuario, longitudeUsuario),
                getHistoricoClimatico(latitudeUsuario, longitudeUsuario),
                getHistoricoMaritimo(),
                getMediaHistoricaTemperaturaEChuva(latitudeUsuario, longitudeUsuario),
            ]).then(([municipio, bairro, climaAtual, historicoClima, historicoMar, mediasHist]) => {
                setMunicipioUsuario(municipio);
                setBairroUsuario(bairro);
                setInformacoesClimaticasAtuais(climaAtual);
                setHistoricoClimatico(historicoClima);
                setHistoricoMaritimo(historicoMar);
                setMediasHistoricas(mediasHist);
                setCarregando(false);
            }).catch(erro => {
                console.error("Erro ao buscar dados", erro);
                setCarregando(false);
            });
        }
    }, [latitudeUsuario, longitudeUsuario]);

    // 3. Processa análises (melhor hora para praia, alagamento e pesca) quando os dados atualizam
    useEffect(() => {
        const alturasOnda = historicoMaritimo.hourly?.wave_height || [];
        const listaHorariosMare = historicoMaritimo.hourly?.time || [];
        const listaChuva: number[] = historicoClimatico.hourly?.rain || [];
        const listaHorariosChuva: string[] = historicoClimatico.hourly?.time || [];

        // Mapeia chuva por horário
        const chuvaPorHorario: Record<string, number> = {};
        listaHorariosChuva.forEach((horario, indice) => { 
            chuvaPorHorario[horario] = listaChuva[indice]; 
        });

        // Procura a menor maré em um momento que NÃO esteja chovendo
        const mareBaixa = alturasOnda.length ? Math.min(...alturasOnda) : null;
        for (let i = 0; i < alturasOnda.length; i++) {
            const alturaMare = alturasOnda[i];
            const horario = listaHorariosMare[i];
            const chuva = chuvaPorHorario[horario];
            
            if (alturaMare === mareBaixa && (chuva === 0 || chuva === undefined)) {
                setMelhorHoraPraiaFormatada(formatarHorarioPraia(horario));
                break;
            }
        }

        // Atualiza os estados de alagamento e pesca
        setRiscoAlagamento(calcularRiscoAlagamento(historicoClimatico, historicoMaritimo));

        const listaVento: number[] = historicoClimatico.hourly?.wind_speed_10m || [];
        setCondicaoPesca(calcularCondicaoPesca(informacoesClimaticasAtuais, listaVento.slice(0, 12)));
    }, [historicoMaritimo, historicoClimatico, informacoesClimaticasAtuais]);

    // Renderização visual da aplicação
    return (
        <>
            <Home />
            <Aviso />
            <SeletorAbas setAbaAtiva={setAbaAtiva} abaAtiva={abaAtiva} />

            {/* Renderiza a aba geral (Para Você) */}
            {abaAtiva === "geral" && (
                <ParaVoce
                    latitudeUsuario={latitudeUsuario}
                    longitudeUsuario={longitudeUsuario}
                    carregando={carregando}
                    municipioUsuario={municipioUsuario}
                    bairroUsuario={bairroUsuario}
                    informacoesClimaticasAtuais={informacoesClimaticasAtuais}
                    historicoClimatico={historicoClimatico}
                    mediasHistoricas={mediasHistoricas}
                    riscoAlagamento={riscoAlagamento}
                    melhorHoraPraia={melhorHoraPraiaFormatada}
                />
            )}

            {/* Renderiza a aba específica para pescadores */}
            {abaAtiva === "pescador" && (
                <ParaPescadores
                    carregando={carregando}
                    municipio={municipioUsuario}
                    bairro={bairroUsuario}
                    condicaoPesca={condicaoPesca}
                    velocidadeVento={informacoesClimaticasAtuais["Velocidade do vento"]}
                    riscoAlagamento={riscoAlagamento}
                />
            )}

            <Rodape />
        </>
    );
}