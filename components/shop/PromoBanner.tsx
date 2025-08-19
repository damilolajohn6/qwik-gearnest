import Image from "next/image";

const PromoBanner = () => {
  return (
    <section className="bg-gray-800 text-white font-sans overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[400px]">
          {/* Left Side: Text Content */}
          <div className="text-center md:text-left p-8 md:w-1/2 space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Shop Smart
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-300">Get</p>
            <p className="text-6xl lg:text-8xl font-extrabold text-yellow-400 drop-shadow-lg">
              10% OFF
            </p>
            <p className="text-xl lg:text-2xl text-gray-300">
              All shopping today
            </p>
          </div>

          {/* Right Side: Image Content */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto self-stretch">
            
            <Image
              src="/phone.png"
              alt="Happy person holding a smartphone to show a great deal"
              fill
              style={{ objectFit: "cover" }}
              className="transform md:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
