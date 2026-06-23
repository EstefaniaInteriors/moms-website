import { Link, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";

const Portfolio = () => {
  const location = useLocation();

  const navItems = [
    { name: "INTERIORS", path: "/interiors" },
    { name: "ART", path: "/art" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            {/* Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 w-full">
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-6 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-muted-foreground py-20">
            <h1 className="text-2xl font-light tracking-[0.2em]">PORTFOLIO PAGE - COMING SOON</h1>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;