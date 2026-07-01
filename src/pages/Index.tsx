import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Index = () => {
  const githubBaseUrl = "https://raw.githubusercontent.com/EstefaniaInteriors/moms-website/main/public";
  const navigate = useNavigate();
  
  // Add cache-busting parameter to force image refresh
  const cacheBuster = Date.now();

  const handlePageClick = () => {
    navigate("/interiors");
  };
  
  return (
    <div className="min-h-[100svh] bg-background cursor-pointer flex flex-col relative" onClick={handlePageClick}>
      <Seo
        title="Interior Design & Art Consulting in New York"
        description="Estefania Bustamante is a New York-based interior designer and art consultant creating luxury residential interiors across the Upper East Side, the Hamptons, Brooklyn, and beyond."
        path="/"
      />
      {/* Hero Section — full-bleed image sized to the visible viewport (svh) so it fills
          the screen but stops at the phone toolbar instead of hiding behind it */}
      <section className="relative h-[100svh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[1, 2, 3, 4, 5].map((num) => (
            <img
              key={num}
              src={`${githubBaseUrl}/images/hero-shots/home-page-${num}.jpeg?v=${cacheBuster}`}
              alt={`Estefania's interior design showcase ${num}`}
              style={num === 5 ? { objectPosition: 'center 68%' } : num === 3 ? { objectPosition: 'center 56%' } : num === 1 ? { objectPosition: 'center 74%' } : undefined}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${
                num === 1 ? 'animate-slideshow-1' :
                num === 2 ? 'animate-slideshow-2' :
                num === 3 ? 'animate-slideshow-3' :
                num === 4 ? 'animate-slideshow-4' :
                'animate-slideshow-5'
              }`}
            />
          ))}
        </div>

        {/* Logo + welcome overlaid in white near the bottom */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-[16vh] sm:pb-[7vh]">
          <div className="text-center text-white w-full flex flex-col items-center">
            <h1 className="font-light tracking-[0.3em] font-sans whitespace-nowrap text-[clamp(1.15rem,2.45vw,1.75rem)]" style={{ transform: 'scaleY(0.7)', lineHeight: '1', wordSpacing: '0.1em' }}>
              ESTEFANIA INTERIORS
            </h1>
            <div className="flex items-center justify-center mt-4 mb-4">
              <div className="w-16 h-px bg-white"></div>
              <Link to="/interiors" className="mx-4 tracking-[0.2em] font-light hover:opacity-80 transition-opacity cursor-pointer font-sans text-[clamp(0.85rem,1.4vw,1rem)]" style={{ transform: 'scaleY(0.7)' }}>
                WELCOME
              </Link>
              <div className="w-16 h-px bg-white"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer overlaid in white at the very bottom, lifted above the phone toolbar/home indicator */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom)]">
        <Footer transparent compact smallIcons />
      </div>
    </div>
  );
};

export default Index;