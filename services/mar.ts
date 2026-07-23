
export async function getHistoricoMaritimo(): Promise<any> {
    // A latitude e longitude já estão predefinidas para a localização da ilha de São Luís (upaon açu)
    const URL = `https://marine-api.open-meteo.com/v1/marine?latitude=-2.5866&longitude=-44.2189&hourly=wave_height&timezone=GMT`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar histórico marítimo");
        return await resposta.json();
    } catch (erro) {
        console.log(erro);
        return {};
    }
}