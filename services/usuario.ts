
export function coordenadasUsuario(setLatitude: (latitude: number) => void, setLongitude: (longitude: number) => void) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }
}

export async function getMunicipioDoUsuario(latitude: number, longitude: number): Promise<string> {
    if (!latitude || !longitude) return "Latitude ou Longitude não apresentam valores corretos";
    const URL = `https://api-bdc.io/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar município do usuário");
        return (await resposta.json()).locality;
    } catch (erro) {
        console.log(erro);
        return "Erro na requisição do município";
    }
}

export async function getBairroDoUsuario(latitude: number, longitude: number): Promise<string> {
    if (!latitude || !longitude) return "";
    const URL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    try {
        const agendamentoCabecalho = process.env.NEXT_PUBLIC_USER_AGENT || "TempoIlha/1.0";
        const resposta = await fetch(URL, { headers: { "User-Agent": agendamentoCabecalho } });
        if (!resposta.ok) throw new Error("Falha ao buscar bairro do usuário");
        const dados = await resposta.json();
        return dados.address?.suburb || dados.address?.neighbourhood || dados.address?.quarter || "Bairro não identificado";
    } catch (erro) {
        console.log(erro);
        return "Erro na requisição do bairro";
    }
}
