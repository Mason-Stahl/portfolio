import Footer from './components/Footer'
import ProjectsSection from "./components/ProjectSection";
import ScrollLink from "./components/ScrollLink";

const dashboardProjects = [
  {
    title: "⚠️ Diet Dashboard ",
    description: "🚧 Under Construction: 👷‍♂️🔨 Check Back Soon 🚧 - Data-driven vegan insights",
    href: "/vegan_dash",
  },
];

const aiProjects = [
  { title: "At What Cost", href: "/awc", description: "Corporate Accountability Commitment Tracker and Watchdog - Innoreader, OpenRouter, Jina, Python, FastAPI, Supabase, N8N, React", image: "/images/awc/awc_logo.png" },
  { title: "To The Death", href: "/ttd", description: "Multiplayer Real-time Board Game with Computer Opponent", image: "/images/ttd/Yin_yang.png"  },
];

const designProjects = [
  { title: "Root", href: "/root", description: "Music-based social media - Mobile Figma mockup", image: "/images/root/logo_final.png"},
  { title: "TAK SafeOps", href: "/tak", description: "App designed for life and death situations - Mobile Figma mockup", image: "/images/tak/tak_logo.png" },
  { title: "Next Gen Innovations", href: "/ngi", description: "Your platform for exploration and connection - Desktop Figma mockup", image: "/images/ngi/ngi_logo.png" },
];

export default function PortfolioLanding() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Hero Section */}
      <section id="hero" className="snap-start h-screen flex flex-col justify-center items-center relative px-6">
        <div className="absolute top-[20%] w-full text-center" style={{ zIndex: 2 }}>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            Mason Stahl
          </h1>
        </div>
        <div className="absolute top-[40%] w-full" style={{ zIndex: 2 }}>
          <nav className="flex justify-center items-center gap-10 md:gap-24 flex-wrap px-4">
            <ScrollLink
              targetId="ai-applications"
              className="text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              AI Applications
            </ScrollLink>
            <ScrollLink
              targetId="designs"
              className="text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              Designs
            </ScrollLink>
            <ScrollLink
              targetId="dashboards"
              className="text-2xl md:text-3xl font-medium hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              Dashboards
            </ScrollLink>
          </nav>
        </div>
        <div className="absolute bottom-32 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section id="ai-applications" className="snap-start h-screen flex flex-col justify-end relative z-[2]">
        <ProjectsSection title="AI Applications" projects={aiProjects} />
      </section>

      <section id="designs" className="snap-start h-screen flex flex-col justify-end relative z-[2]">
        <ProjectsSection title="Designs" projects={designProjects} />
      </section>

      <section id="dashboards" className="snap-start h-screen flex flex-col justify-end relative z-[2]">
        <ProjectsSection title="Dashboards" projects={dashboardProjects} />
      </section>

      <section id="footer" className="snap-start h-screen flex flex-col justify-end relative z-[2]">
        <div id="mountain-trigger" style={{ position: 'absolute', top: '10%', height: 0, width: 0, visibility: 'hidden' }} />
        <Footer />
      </section>
    </div>
  );
}
