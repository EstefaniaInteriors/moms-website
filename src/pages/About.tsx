import { Link, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";

const About = () => {
  const location = useLocation();

  const navItems = [
    { name: "INTERIORS", path: "/interiors" },
    { name: "ART", path: "/art" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo - appears first on mobile */}
            <Link to="/" className="flex items-center space-x-4 order-1 md:order-2">
              <span className="text-sm font-light tracking-[0.3em] font-sans" style={{ transform: 'scaleY(0.7)' }}>ESTEFANIA INTERIORS</span>
            </Link>

            {/* Navigation */}
            <nav className="order-2 md:order-1">
              <ul className="flex space-x-8">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`text-[10px] font-light tracking-[0.2em] transition-colors ${
                        location.pathname === item.path
                          ? "text-foreground border-b-2 border-foreground pb-1"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-12 pb-1 px-6 flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <h1 className="text-lg font-light tracking-[0.2em] text-foreground mb-2">ABOUT</h1>
            
            <div className="max-w-none text-foreground space-y-6 font-light leading-loose text-[12px]">
              <p>
Estefania Interiors is a boutique interior design and art consultancy studio led by Estefania Bustamante. We offer a thoughtful, bespoke approach that transforms everyday spaces into something truly special. At Estefania Interiors, we believe the interiors that shape our daily lives should reflect who we are, inspire how we live, and elevate the everyday. Our work is guided by proportion, balance, and a deep appreciation for beauty and individuality. Whether crafting a home from the ground up or reimagining a single room, we create interiors with clean lines, intentional details, and eclectic sophistication. On the art side, we advise seasoned collectors in search of the perfect piece, as well as newcomers navigating the thrilling (and sometimes daunting) world of art collecting—always with warmth, taste, and discernment.
              </p>

              {/* About Image */}
              <div className="text-center" style={{ marginTop: '80px', marginBottom: '80px' }}>
                <img 
                  src="https://raw.githubusercontent.com/alexwes/buenos-aires-loft-nyc/refs/heads/main/public/images/about/tifi-hero.jpeg"
                  alt="Estefania Bustamante"
                  className="mx-auto rounded-lg max-w-lg w-full object-cover"
                />
              </div>
              
              {/* Quote below image */}
              <div>
                <blockquote className="text-center text-[12px] font-light leading-loose tracking-[0.1em] text-muted-foreground">
                  "Art is a line around your thoughts." - Gustav Klimt
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;