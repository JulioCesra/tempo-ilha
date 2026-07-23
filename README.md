# Tempo Ilha

**Aplicação web para consulta climática, marítima e análises de risco na Ilha do Maranhão.**

## Sobre o Projeto

O **Tempo Ilha** é uma plataforma desenvolvida para moradores, visitantes e profissionais (como pescadores) da Ilha do Maranhão (São Luís e municípios vizinhos). O sistema oferece dados meteorológicos e marítimos em tempo real, combinando-os para calcular riscos locais e recomendações práticas para o dia a dia.

A aplicação vai além da previsão tradicional ao cruzar informações como acumulado de chuva e altura da maré para estimar o risco de alagamentos por bairro, além de avaliar condições de vento para a navegação e pesca artesanal.

### Funcionalidades

- **Localização Automática:** Geolocalização para identificação precisa do município e bairro do usuário.
- **Painel Geral (Para Você):**
  - Métricas climáticas atuais: temperatura, sensação térmica, umidade, velocidade do vento, precipitação e chuva.
  - Alertas do Índice UV com recomendações de exposição solar.
  - Comparativo com médias históricas mensais de temperatura e precipitação acumulada.
  - Indicador de risco de alagamento no bairro baseado em dados históricos e tempo real.
  - Monitoramento específico para as praias da ilha, incluindo identificação da praia mais próxima e cálculo do melhor horário para visitação (cruzando maré baixa e ausência de chuva).
- **Painel de Pesca (Para Pescadores):**
  - Avaliação automatizada de segurança para pesca com base na velocidade e previsão de rajadas de vento.
  - Alertas de prevenção e checagem de condições no mar.
- **Visualização de Dados:**
  - Gráficos interativos para acompanhamento de tendências das variáveis climáticas.
  - Mapa térmico visual do histórico e previsão recente.
- **Design:** Interface temática com referências visuais à cultura e arquitetura maranhense.
- **Responsividade:** Interface adaptada para dispositivos móveis e desktops.

## Tecnologias Utilizadas

- **Next.js** (React)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (visualização gráfica de dados)
- APIs e Serviços:
  - **Open-Meteo API** (dados meteorológicos e marítimos em tempo real e históricos)
  - **BigDataCloud API** (geocodificação reversa para identificação de bairros e municípios)

## Estrutura do Cálculo de Riscos

1. **Risco de Alagamento:** Calculado a partir da combinação ponderada entre a chuva registrada na última hora, a chuva acumulada nas últimas 6 horas e a altura atual da maré.
2. **Condição de Pesca:** Calculado avaliando a velocidade atual do vento e o pico máximo previsto para as próximas 12 horas.

## Objetivo

Fornecer dados climáticos e marítimos integrados em uma única plataforma simples, auxiliando na prevenção de incidentes em áreas sujeitas a alagamento e promovendo maior segurança para atividades de lazer e trabalho no litoral da ilha.

## Desenvolvido por [@JulioCesra](https://github.com/JulioCesra)

Projeto pessoal com foco em utilidade pública local, análise de dados e design inspirado na cultura maranhense.

## Como Executar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev