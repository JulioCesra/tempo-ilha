// Importação da interface de tipos das props do componente
import { ParaPescadoresProps } from "@/interfaces/ParaPescadores";

// Estilo padrão reutilizável para os cards visuais da interface
const ESTILO_CARD_BASE = "bg-white border-4 border-[#1e40af] rounded-2xl shadow-xl p-6 text-center";

export default function ParaPescadores({ 
    carregando, 
    municipio, 
    bairro, 
    condicaoPesca, 
    velocidadeVento, 
    riscoAlagamento 
}: ParaPescadoresProps) {
    return (
        /* Container principal com padrão visual de fundo (grid de pontos) */
        <div className="w-full py-16 md:py-20 bg-[radial-gradient(#1e3a8a_0.8px,transparent_1px)] bg-[length:20px_20px] relative">
            
            {/* Camada de linhas finas decorativas no fundo */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            
            {/* Conteúdo centralizado */}
            <div className="max-w-2xl mx-auto px-4 md:px-6 relative z-10">
                
                {/* CABEÇALHO */}
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#1e3a8a] mb-2">
                    Condições para Pesca
                </h2>
                <p className="text-center text-gray-600 mb-10 text-sm md:text-base">
                    {carregando ? "localizando..." : (bairro || municipio || "sua região")}
                </p>

                {/* CARD 1: CONDIÇÃO GERAL DE PESCA */}
                <div className={`${ESTILO_CARD_BASE} mb-6`}>
                    <p className="text-sm uppercase tracking-wide font-semibold text-[#1e3a8a] mb-2">
                        Condição Atual
                    </p>
                    <p className="text-4xl font-serif font-bold text-[#1e3a8a] mb-2">
                        {condicaoPesca.nivel}
                    </p>
                    <p className="text-sm text-gray-600">
                        {condicaoPesca.mensagem}
                    </p>
                </div>

                {/* CARD 2 E 3: VENTO E RISCO DE ALAGAMENTO (Lado a Lado) */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Velocidade do Vento */}
                    <div className={ESTILO_CARD_BASE}>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                            Vento Agora
                        </p>
                        <p className="text-2xl font-serif font-bold text-[#1e3a8a]">
                            {velocidadeVento ?? "—"} km/h
                        </p>
                    </div>

                    {/* Risco de Alagamento */}
                    <div className={ESTILO_CARD_BASE}>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                            Risco de Alagamento
                        </p>
                        <p className="text-2xl font-serif font-bold text-[#1e3a8a]">
                            {riscoAlagamento.nivel}
                        </p>
                    </div>
                </div>

                {/* CARD 4: AVISO E ISENÇÃO DE RESPONSABILIDADE */}
                <div className={`${ESTILO_CARD_BASE} text-left`}>
                    <p className="font-serif font-semibold text-[#1e3a8a] mb-2">
                        Aviso
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Os limiares usados aqui são uma estimativa inicial baseada em velocidade do vento.
                        Sempre confirme as condições reais no mar antes de sair e priorize sua segurança
                        acima de qualquer indicação deste aplicativo.
                    </p>
                </div>

            </div>
        </div>
    );
}