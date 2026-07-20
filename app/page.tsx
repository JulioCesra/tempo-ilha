'use client'; 

import { useState, useEffect } from 'react';

function localidadeUsuario(setLat: (v: number) => void, setLng: (v: number) => void) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    });
  }
}

async function buscarTemperatura(latitude: number, longitude: number): Promise<number> {
  if (!latitude || !longitude) return 0;
  
  const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
  
  try {
    const resposta = await fetch(URL);
    if (!resposta.ok) throw new Error('Falha ao buscar dados climáticos');
    
    const dados = await resposta.json();
    return dados.current.temperature_2m; 
  } catch (erro) {
    console.error(erro);
    return 0;
  }
}

export default function TempoIlha() {
  const [latitudeUsuario, setLatitudeUsuario] = useState(0);
  const [longitudeUsuario, setLongitudeUsuario] = useState(0);
  const [temperatura, setTemperatura] = useState<number | null>(null);

  useEffect(() => {
    localidadeUsuario(setLatitudeUsuario, setLongitudeUsuario);
  }, []);

  useEffect(() => {
    if (latitudeUsuario !== 0 && longitudeUsuario !== 0) {
      buscarTemperatura(latitudeUsuario, longitudeUsuario).then((temp) => {
        setTemperatura(temp);
      });
    }
  }, [latitudeUsuario, longitudeUsuario]);

  return (
    <section className='w-full h-screen bg-gray-100'>
      <section className='flex w-full justify-center p-10'>
        <div className="grid grid-cols-2 gap-10">
          <article className='flex justify-center flex-col items-center gap-2 bg-sky-700 p-3 rounded-2xl text-white'>
            <h1 className="text-3xl font-bold">Temperatura</h1>
            {
              temperatura !== null ? (
                <p className='text-xl font-semibold'>
                  {temperatura} °C
                </p>
              ) : (
                <p>Buscando a temperatura da sua região...</p>
              )
            }
          </article>
          <article>
            <h1 className='text-3xl'>Umidade</h1>
          </article>
        </div>
      </section>
    </section>
  );
}
