import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Art = () => {
  const location = useLocation();
  const githubBaseUrl = "https://raw.githubusercontent.com/EstefaniaInteriors/moms-website/main/public/images/art";

  const navItems = [
    { name: "INTERIORS", path: "/interiors" },
    { name: "ART", path: "/art" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Generate all art images dynamically from GitHub
  const generateArtworksFromGitHub = async () => {
    try {
      setLoading(true);
      const allArtworks = [];
      let artworkId = 1;
      
      // First, get the latest commit SHA from the main branch
      const branchResponse = await fetch("https://api.github.com/repos/EstefaniaInteriors/moms-website/branches/main");
      
      if (!branchResponse.ok) {
        throw new Error(`Failed to fetch branch info: ${branchResponse.status}`);
      }
      
      const branchData = await branchResponse.json();
      const commitSha = branchData.commit.sha;
      
      // Now get the recursive tree using the commit SHA
      const treeResponse = await fetch(`https://api.github.com/repos/EstefaniaInteriors/moms-website/git/trees/${commitSha}?recursive=1`);
      
      if (!treeResponse.ok) {
        throw new Error(`Failed to fetch repository tree: ${treeResponse.status}`);
      }
      
      const treeData = await treeResponse.json();
      
      // Filter for image files only
      const imageFiles = treeData.tree.filter(item => 
        item.type === 'blob' && 
        item.path.startsWith('public/images/art/') &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(item.path)
      );
      
      // Add each image to our collection
      imageFiles.forEach(item => {
        // Extract filename from path
        const filename = item.path.split('/').pop();
        
        // Extract artist name from filename (remove extension and format)
        const artistName = filename
          .split('.')[0] // Remove extension
          .replace(/-\d+$/, '') // Remove trailing numbers like -2, -3
          .replace(/-/g, ' ') // Replace hyphens with spaces
          .toUpperCase(); // Convert to uppercase
        
        allArtworks.push({
          id: artworkId++,
          image: `https://raw.githubusercontent.com/EstefaniaInteriors/moms-website/main/${item.path}`,
          alt: `Artwork by ${artistName}`,
          artist: artistName
        });
      });

      allArtworks.sort((a, b) => a.artist.localeCompare(b.artist));

      setArtworks(allArtworks);
      setError(null);
    } catch (error) {
      console.error('Error generating artworks from GitHub:', error);
      setError('Failed to load artworks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load artworks on component mount
  useEffect(() => {
    generateArtworksFromGitHub();
  }, []);

  // Handle image click
  const handleImageClick = (artwork, index) => {
    setSelectedImage(artwork);
    setSelectedIndex(index);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedIndex(null);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex - 1 + artworks.length) % artworks.length;
    setSelectedImage(artworks[newIndex]);
    setSelectedIndex(newIndex);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex + 1) % artworks.length;
    setSelectedImage(artworks[newIndex]);
    setSelectedIndex(newIndex);
  };

  // Handle escape + arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, selectedIndex]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
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

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[60vh] pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
            <p className="text-muted-foreground font-light tracking-[0.1em]">Loading artworks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
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

        {/* Error State */}
        <div className="flex items-center justify-center min-h-[60vh] pt-6">
          <div className="text-center">
            <p className="text-red-500 font-light tracking-[0.1em] mb-4">{error}</p>
            <button 
              onClick={generateArtworksFromGitHub}
              className="px-6 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-light tracking-[0.1em]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Art Consulting & Curation"
        description="Art consulting and curation by Estefania Bustamante — sourcing, advising on, and placing fine art to complete sophisticated, collected interiors in New York and beyond."
        path="/art"
      />
      <h1 className="sr-only">Art Consulting &amp; Curation — Estefania Bustamante</h1>
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

      {/* Art Gallery */}
      <section className="pt-12 pb-6 px-4 flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {artworks.map((artwork, index) => (
              <div key={artwork.id} className="group flex flex-col items-center cursor-pointer" onClick={() => handleImageClick(artwork, index)}>
                <div className="relative w-full max-w-xs h-64 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={artwork.image}
                    alt={artwork.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <p className="text-foreground text-[10px] font-light tracking-[0.2em] font-sans mt-3">{artwork.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          {/* Left arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors text-3xl select-none z-10 p-2"
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <div className="relative flex flex-col items-center w-fit max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image}
              alt={selectedImage.alt}
              className="max-w-[90vw] max-h-[82vh] object-contain rounded-lg"
            />
            <h3 className="text-white text-[10px] font-light tracking-[0.2em] font-sans mt-4">{selectedImage.artist}</h3>
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Right arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors text-3xl select-none z-10 p-2"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}

      {/* Museum Exhibition Text */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-[12px] font-light leading-loose tracking-[0.1em] text-muted-foreground">
              One of the paintings in the Estefania Interiors collection was lent to be exhibited at MALBA Museo de Arte Latinoamericano de Buenos Aires{' '}
              <a href="https://malba.org.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                https://malba.org.ar/
              </a>{' '}
              @museomalba another one to MACBA to be the main work of art of the show{' '}
              <a href="https://museomacba.org/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                https://museomacba.org/
              </a>{' '}
              @museomacba and several artists we work with have been purchased to be part of collection of The Museum of Modern Art MoMA{' '}
              <a href="https://www.moma.org/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                https://www.moma.org/
              </a>{' '}
              @themuseumofmodernart and Museo Nacional de Bellas Artes Argentina{' '}
              <a href="https://www.bellasartes.gob.ar" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                https://www.bellasartes.gob.ar
              </a>{' '}
              @bellasartesargentina
            </p>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-6 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-center text-[12px] font-light leading-loose tracking-[0.1em] text-muted-foreground">
              "If I could say it in words there would be no reason to paint." - Edward Hopper
            </blockquote>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Art;