
export interface ParaPescadoresProps {
    carregando: boolean;
    municipio: string;
    bairro: string;
    condicaoPesca: { nivel: string; mensagem: string };
    velocidadeVento?: number;
    riscoAlagamento: { nivel: string; pontuacao: number };
}