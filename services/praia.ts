import { distancia } from "@/utils/utilidades";

export async function getClimaPraia(latitude: number, longitude: number): Promise<any> {
    if (!latitude || !longitude) return {};
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=rain,wind_speed_10m&timezone=GMT`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar clima da praia");
        return await resposta.json();
    } catch (erro) {
        console.log(erro);
        return {};
    }
}

export function formatarHorarioPraia(isoString: string | undefined): string {
    if (!isoString) return "";
    const data = new Date(isoString);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    const mesmoDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'GMT' });

    if (mesmoDay(data, hoje)) return `Hoje, às ${hora}`;
    if (mesmoDay(data, amanha)) return `Amanhã, às ${hora}`;

    const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'GMT' });
    return `${dataFormatada}, às ${hora}`;
}

export const PRAIAS_ILHA = [
  { "nome": "Ponta d'Areia", "latitude": -2.4828, "longitude": -44.3013 },
  { "nome": "Calhau", "latitude": -2.4982, "longitude": -44.2568 },
  { "nome": "São Marcos", "latitude": -2.4912, "longitude": -44.2774 },
  { "nome": "Araçagi", "latitude": -2.4743, "longitude": -44.1954 },
  { "nome": "Raposa", "latitude": -2.4408, "longitude": -44.0961 },
  { "nome": "Olho de Porco", "latitude": -2.4581, "longitude": -44.1738 },
  { "nome": "Panaquatira", "latitude": -2.4725, "longitude": -44.0438 }
]

export function praiaMaisProxima(latitude: number, longitude: number) {
    if (!latitude || !longitude) return PRAIAS_ILHA[0];
    return PRAIAS_ILHA.reduce((maisProxima, praia) => {
        const distAtual = distancia(latitude, longitude, praia.latitude, praia.longitude);
        const distMaisProxima = distancia(latitude, longitude, maisProxima.latitude, maisProxima.longitude);
        return distAtual < distMaisProxima ? praia : maisProxima;
    });
}