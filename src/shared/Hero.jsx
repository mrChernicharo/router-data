export default function Hero() {
  const height = "63vh";
  const imgPath = "/assets/mulher-consultas.jpg";

  return (
    <div data-component="Hero" class="flex" style={{ height }}>
      <div
        class="w-[50vw] sm:w-[60vw] lg:w-[50vw] translate-x-[20%] bg-neutral"
        style={{
          "clip-path": "polygon(100% 0%, 80% 100%, 70% 100%,70% 0%)",
        }}
      ></div>

      <div class="w-[100vw] sm:w-[50vw] absolute bg-neutral overflow-visible" style={{ height }}>
        <div class="text-center sm:text-left p-8 md:pr-16">
          <h2 class="text-3xl sm:text-4xl md:text-5xl tracking-tight font-extrabold">
            <span class="block xl:inline">Atendimento psicológico especializado</span>
          </h2>

          <h1 class="text-4xl sm:text-5xl md:text-6xl my-8 tracking-tight font-extrabold">
            <span class="block text-secondary my-4">Clínica Laços</span>
          </h1>

          <p class="text-base sm:text-lg md:text-xl mx-3 lg:mx-0 sm:mt-5 md:mt-5 sm:max-w-xl sm:mx-auto ">
            Confie na experiência de quem cuida de pessoas há mais de 20 anos. Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Nisi, optio perspiciatis. Qui sed amet facilis voluptatum nisi
          </p>
        </div>
      </div>

      <img src={imgPath} class="w-[50vw] object-cover" style={{ height }} />
    </div>
  );
}
