interface SeletorAbasProps {
    abaAtiva: string;
    setAbaAtiva: (aba: string) => void;
}

export default function SeletorAbas({ abaAtiva, setAbaAtiva }: SeletorAbasProps) {
    return (
        <div className="sticky top-0 z-20 bg-white border-b-2 border-[#1e3a8a]/20 shadow-sm">
            <div className="max-w-md mx-auto flex gap-2 p-3">
                <button
                    onClick={() => setAbaAtiva("geral")}
                    className={`flex-1 py-2.5 rounded-full text-sm font-semibold font-serif transition-all border-2 ${
                        abaAtiva === "geral"
                            ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                            : "bg-white text-[#1e3a8a] border-[#1e3a8a]/30 hover:border-[#1e3a8a]"
                    }`}
                >
                    Para Você
                </button>
                <button
                    onClick={() => setAbaAtiva("pescador")}
                    className={`flex-1 py-2.5 rounded-full text-sm font-semibold font-serif transition-all border-2 ${
                        abaAtiva === "pescador"
                            ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                            : "bg-white text-[#1e3a8a] border-[#1e3a8a]/30 hover:border-[#1e3a8a]"
                    }`}
                >
                    Para Pescadores
                </button>
            </div>
        </div>
    );
}
