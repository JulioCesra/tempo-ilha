
export interface ParaVoceProps {
    latitudeUsuario: number;
    longitudeUsuario: number;
    carregando: boolean;
    municipioUsuario: string;
    bairroUsuario: string;
    informacoesClimaticasAtuais: any;
    historicoClimatico: any;
    mediasHistoricas: { temperaturaMedia: number | null; chuvaTotalMedia: number | null };
    riscoAlagamento: { nivel: string; pontuacao: number };
    melhorHoraPraia: string;
}