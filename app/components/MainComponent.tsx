
export default function MainComponent() {
  return (
     <div 
      className="
      flex
      h-screen
      w-full 
      items-center 
      justify-center 
      bg-center 
      bg-no-repeat 
      bg-cover 
      bg-transparent
      opacity-80 "
      style={{ backgroundImage: "url('/foto.jpg')" }}
    >
      <div className="
      flex
      flex-col
      items-center
      gap-4
      p-8
    bg-white
      rounded-xl
      ">
        <h1 className="text-4xl font-bold text-blue-800">
          Bem Vindo(a) ao Tempo Ilha!
        </h1>
        <p className="text-lg text-gray-900">
          Aqui você pode verificar a previsão do tempo para a ilha ludovicense.
        </p>
      </div>
    </div>
  );
}