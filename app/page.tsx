import MainComponent from "./components/MainComponent";
import GraphsComponent from "./components/GaphsComponent";
export default function App() {
  return (
    <div className="flex justify-center">
      <section className="flex flex-col w-full">
        <MainComponent/>
        <GraphsComponent/>
      </section>
    </div>
  );
}