import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Index = () => {
  const githubBaseUrl = "https://raw.githubusercontent.com/EstefaniaInteriors/moms-website/main/public";
  const navigate = useNavigate();
  
  // Stable version tag for image URLs. Do NOT use Date.now() here — a URL that changes
  // on every render stops Google from indexing the images (they drop out of Google Images).
  // Only bump this string when the hero photos are swapped, to bust caches on that deploy.
  const cacheBuster = "2026-07";

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
          {[1, 2, 3, 4, 5].map((num) => {
            // NOTE: spell these out as literal strings — Tailwind only keeps classes it
            // can see literally in the source. A template like `animate-slideshow-${num}`
            // gets purged, which silently kills the slideshow (all photos stack, only the
            // last one shows). Keep this as an explicit map.
            const animClass = {
              1: 'animate-slideshow-1',
              2: 'animate-slideshow-2',
              3: 'animate-slideshow-3',
              4: 'animate-slideshow-4',
              5: 'animate-slideshow-5',
            }[num];
            const baseImg = `absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ease-in-out ${animClass}`;
            // Photos 3, 4, 5 use a differently-cropped file on phones (they read better tall)
            const hasMobileCrop = num === 3 || num === 4 || num === 5;
            // Computer / iPad crop position (photo 1 nudged down to 62%, midway back from 74%)
            const desktopPos =
              num === 5 ? 'center 68%' :
              num === 3 ? 'center 56%' :
              num === 1 ? 'center 62%' :
              'center center';
            return (
              <div key={num} className="absolute inset-0">
                {/* Computer / iPad crop (hidden on phones only when a phone-specific crop exists, or for photo 1 which shifts) */}
                <img
                  src={`${githubBaseUrl}/images/hero-shots/home-page-${num}.jpeg?v=${cacheBuster}`}
                  alt={`Interior design by Estefania Bustamante — New York luxury residential project ${num}`}
                  style={{ objectPosition: desktopPos }}
                  className={`${baseImg} ${hasMobileCrop || num === 1 ? 'hidden md:block' : ''}`}
                />
                {/* Phone crop */}
                {num === 1 ? (
                  <img
                    src={`${githubBaseUrl}/images/hero-shots/home-page-1.jpeg?v=${cacheBuster}`}
                    alt="Interior design by Estefania Bustamante — New York luxury residential project 1"
                    style={{ objectPosition: 'center 74%' }}
                    className={`${baseImg} md:hidden`}
                  />
                ) : hasMobileCrop ? (
                  <img
                    src={`${githubBaseUrl}/images/hero-shots/home-page-${num}-mobile.jpeg?v=${cacheBuster}`}
                    alt={`Interior design by Estefania Bustamante — New York luxury residential project ${num}`}
                    className={`${baseImg} md:hidden`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Logo + welcome overlaid in white near the bottom.
            On phones it sits ~1 inch lower (near the bottom edge); on iPad/desktop unchanged. */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-[5vh] md:pb-[7vh]">
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

      {/* Footer overlaid in white at the very bottom, lifted above the phone toolbar/home indicator.
          Hidden on phones (declutters the mobile homepage); shown on iPad/desktop. */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom)] hidden md:block">
        <Footer transparent compact smallIcons />
      </div>
    </div>
  );
};

export default Index;