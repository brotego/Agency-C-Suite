import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131313' }}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="C-Suite Agency Logo"
              width={600}
              height={600}
              priority
              className="w-full max-w-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold leading-relaxed" suppressHydrationWarning>
              Fractional Executives for Start-up and Independent Creative Agencies
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

