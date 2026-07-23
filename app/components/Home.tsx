
export default function Home(){
    return (
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
                    Informações climáticas em tempo real de qualquer bairro e município da Ilha
                </p>
            </article>
        </section>
    )
}