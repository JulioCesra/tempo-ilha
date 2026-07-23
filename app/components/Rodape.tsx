
export default function Rodape(){
    return (
        <footer className="bg-[#1e3a8a] text-white py-8 text-center">
                <div className="max-w-5xl mx-auto px-4">
                    <p className="text-sm opacity-90">
                        Tempo Ilha — Informações climáticas da Ilha do Maranhão
                    </p>
                    <p className="mt-2 text-sm">
                        Desenvolvido por{' '}
                        <a href="https://github.com/JulioCesra" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                            @JulioCesra
                        </a>
                    </p>
                    <p className="text-xs mt-4 opacity-70">
                        Utiliza APIs públicas • Dados meteorológicos via Open-Meteo
                    </p>
                </div>
        </footer>
    )
}