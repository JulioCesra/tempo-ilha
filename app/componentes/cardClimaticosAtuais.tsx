interface CardClimaticoAtualProps {
    nome: string;
    dado?: number;
    descricao: string;
    unidade?: string;
}

export default function CardClimaticoAtual({ nome, dado, descricao, unidade }: CardClimaticoAtualProps) {
    return (
        <article className="group flex flex-col justify-center items-center bg-white border-2 border-[#1e40af] hover:border-[#3b82f6] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full h-full min-h-[180px] relative overflow-hidden">
            
            <div className="absolute top-0 w-full h-2 bg-[#1e40af]"></div>

            <h1 className="text-sm font-medium tracking-widest text-[#1e40af] uppercase mb-4">
                {nome}
            </h1>

            {dado !== undefined && dado !== null ? (
                <div className="text-center">
                    <p className="text-5xl font-bold text-[#1e3a8a] font-serif">
                        {dado}
                        <span className="text-2xl font-normal text-[#3b82f6] ml-1 align-super">{unidade}</span>
                    </p>
                </div>
            ) : (
                <p className="text-center text-gray-500 text-sm max-w-[140px]">
                    {descricao}
                </p>
            )}

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#93c5fd]/30 rounded-3xl transition-colors pointer-events-none"></div>
        </article>
    );
}