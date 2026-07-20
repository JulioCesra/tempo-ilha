# Tempo Ilha

**Aplicação web para consulta climática em tempo real na Ilha do Maranhão.**

## Sobre o Projeto

O **Tempo Ilha** é um projeto desenvolvido para ajudar moradores e visitantes da Ilha do Maranhão (São Luís e municípios adjacentes) a acompanharem a situação climática da sua região de forma simples e visual.

O principal objetivo é fornecer informações claras sobre temperatura, sensação térmica, umidade, vento, precipitação e chuva, com **especial atenção para o risco de fortes chuvas**, ajudando as pessoas a se prepararem melhor para o clima local.

### Funcionalidades

- Detecção automática da localização do usuário
- Informações climáticas atuais (temperatura, umidade, vento, precipitação, etc.)
- Gráficos das próximas 24 horas
- Mapa térmico visual (estilo azulejo) das próximas horas
- Design inspirado nos tradicionais **azulejos de São Luís**
- Totalmente responsivo (funciona bem no celular)

## Tecnologias Utilizadas

- **Next.js** (React)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (para os gráficos)
- APIs públicas:
  - Open-Meteo (dados climáticos)
  - BigDataCloud (reverse geocoding)

## Objetivo

Facilitar o acesso à informação climática confiável para quem vive ou frequenta a Ilha do Maranhão, especialmente em períodos de chuva intensa.


## **Desenvolvido por [@JulioCesra](https://github.com/JulioCesra)**

Projeto pessoal com foco em utilidade local e design inspirado na cultura maranhense.

## Como Executar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
