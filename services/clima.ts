
export async function getHistoricoClimatico(latitude: number, longitude: number): Promise<any> {
    if (!latitude || !longitude) return {};
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain,apparent_temperature,precipitation_probability,wind_speed_10m,uv_index&timezone=GMT`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar histórico dos dados climáticos");
        return await resposta.json();
    } catch (erro) {
        console.log(erro);
        return {};
    }
}

export function classificarUV(uv: number | null) {
    if (uv === null || uv === undefined) return { nivel: "Sem dados" };
    if (uv < 3) return { nivel: "Baixo" };
    if (uv < 6) return { nivel: "Moderado" };
    if (uv < 8) return { nivel: "Alto" };
    if (uv < 11) return { nivel: "Muito Alto" };
    return { nivel: "Extremo" };
}

export async function getMediaHistoricaTemperaturaEChuva(latitude: number, longitude: number): Promise<{ temperaturaMedia: number | null; chuvaTotalMedia: number | null }> {
    if (!latitude || !longitude) return { temperaturaMedia: null, chuvaTotalMedia: null };
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const diaFim = new Date(anoAtual, hoje.getMonth() + 1, 0).getDate();
    const anos = [1, 2, 3, 4, 5].map(n => anoAtual - n);

    try {
        const resultados = await Promise.all(anos.map(async (ano) => {
            const URL = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${ano}-${mes}-01&end_date=${ano}-${mes}-${diaFim}&daily=temperature_2m_mean,rain_sum&timezone=GMT`;
            const resposta = await fetch(URL);
            if (!resposta.ok) return null;
            return await resposta.json();
        }));

        const validos = resultados.filter(Boolean);
        if (!validos.length) return { temperaturaMedia: null, chuvaTotalMedia: null };

        const temperaturas: number[] = [];
        const chuvasTotais: number[] = [];
        validos.forEach((dados: any) => {
            const temperaturasDoAno = (dados.daily?.temperature_2m_mean || []).filter((v: number) => v !== null);
            const chuvasDoAno = (dados.daily?.rain_sum || []).filter((v: number) => v !== null);
            if (temperaturasDoAno.length) temperaturas.push(temperaturasDoAno.reduce((a: number, b: number) => a + b, 0) / temperaturasDoAno.length);
            if (chuvasDoAno.length) chuvasTotais.push(chuvasDoAno.reduce((a: number, b: number) => a + b, 0));
        });

        const temperaturaMedia = temperaturas.length ? temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length : null;
        const chuvaTotalMedia = chuvasTotais.length ? chuvasTotais.reduce((a, b) => a + b, 0) / chuvasTotais.length : null;

        return {
            temperaturaMedia: temperaturaMedia !== null ? Math.round(temperaturaMedia * 10) / 10 : null,
            chuvaTotalMedia: chuvaTotalMedia !== null ? Math.round(chuvaTotalMedia * 10) / 10 : null,
        };
    } catch (erro) {
        console.log(erro);
        return { temperaturaMedia: null, chuvaTotalMedia: null };
    }
}

export async function getInformacoesClimaticasAtuais(latitude: number, longitude: number): Promise<InformacoesClimaticas> {
    if (!latitude || !longitude) return {};
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,uv_index&timezone=GMT`;
    try {
        const resposta = await fetch(URL);
        if (!resposta.ok) throw new Error("Falha ao buscar dados climáticos atuais");
        const dados = await resposta.json();
        return {
            Temperatura: dados.current.temperature_2m,
            Umidade: dados.current.relative_humidity_2m,
            Precipitação: dados.current.precipitation,
            Chuva: dados.current.rain,
            "Velocidade do vento": dados.current.wind_speed_10m,
            "Temperatura Aparente": dados.current.apparent_temperature,
            "Índice UV": dados.current.uv_index,
        };
    } catch (erro) {
        console.log(erro);
        return {};
    }
}