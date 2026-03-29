import Link from 'next/link';
import AmbientBirds from './components/AmbientBirds';
import AsciiSky from './components/AsciiSky';
import Footer from './components/Footer'

export default function PortfolioLanding() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Hero Section */}
      <section className="snap-start h-screen flex flex-col justify-center items-center relative px-6">
        <AsciiSky />
        <AmbientBirds />
        <div className="absolute top-[20%] w-full text-center" style={{ zIndex: 2 }}>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            Mason Stahl
          </h1>
        </div>
        <div className="absolute top-[40%] w-full" style={{ zIndex: 2 }}>
          <nav className="flex justify-center items-center gap-10 md:gap-24 flex-wrap px-4">
            <Link 
              href="/ai-applications"
              className="text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              AI Applications
            </Link>
            <Link 
              href="/designs"
              className="text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              Designs
            </Link>
            <Link 
              href="/dashboards"
              className="text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              Dashboards
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-32 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

  {/* footer */}
  <section className="snap-start h-screen flex flex-col justify-end relative">
  
  </section>

  {/* footer */}
  <section className="snap-start h-screen flex flex-col justify-end relative">
    <Footer />
  </section>

</div>
  );
}