import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const Interiors = () => {
  const location = useLocation();
  const githubBaseUrl = "https://raw.githubusercontent.com/EstefaniaInteriors/moms-website/main";

  const navItems = [
    { name: "INTERIORS", path: "/interiors" },
    { name: "ART", path: "/art" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const [interiorProjects, setInteriorProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Generate all images dynamically from GitHub
  const generateImagesFromGitHub = async () => {
    try {
      setLoading(true);
      const allImages = [];
      let imageId = 1;
      
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
      
      // Filter for image files in the interiors directory, excluding Bridgehampton
      const imageFiles = treeData.tree.filter(item =>
        item.type === 'blob' &&
        item.path.startsWith('public/images/interiors/') &&
        !item.path.includes('/Bridgehampton/') &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(item.path)
      );
      
      // Process each image file
      imageFiles.forEach(file => {
        // Extract location from path: public/images/interiors/[location]/filename.jpg
        const pathParts = file.path.split('/');
        const location = pathParts[3]; // The directory name after 'interiors/'
        const filename = pathParts[pathParts.length - 1];
        
        allImages.push({
          id: imageId++,
          image: `${githubBaseUrl}/${file.path}`,
          alt: `Estefania Bustamante interiors – ${location} ${filename.split('.')[0].replace(/-/g, ' ')}`,
          location: location
        });
      });
      
      setInteriorProjects(allImages);
      setError(null);
    } catch (error) {
      console.error('Error generating images from GitHub:', error);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Define the order of folders
  const folderOrder = [
    'Upper East Side',
    'Upper East Side 79th',
    'Upper East Side 90th',
    'Manhattan West Side',
    'Park Avenue, New York',
    'SAG HARBOR TOWN',
    'Sag Harbor',
    'Brooklyn',
    'Upper East Side, Carnegie Hill',
    'Southampton',
    'Buenos Aires'
  ];

  // Custom combined order for Upper East Side groups (displayed as one)
  const combinedUpperEastSide79thOrder = [
    { location: 'Upper East Side', filename: 'entrance-1.jpeg' },
    { location: 'Upper East Side', filename: 'living-1.jpg' },
    { location: 'Upper East Side', filename: 'living-4.jpeg' },
    { location: 'Upper East Side', filename: 'living-5.jpeg' },
    { location: 'Upper East Side', filename: 'living-5.jpg' },
    { location: 'Upper East Side 79th', filename: 'dining-1.jpeg' },
    { location: 'Upper East Side 79th', filename: 'kitchen-1.jpeg' },
    { location: 'Upper East Side 79th', filename: 'bed-1.jpg' },
    { location: 'Upper East Side 79th', filename: 'bed-2-new.JPG' },
    { location: 'Upper East Side 79th', filename: 'bath-1.JPG' },
    { location: 'Upper East Side 79th', filename: 'bath-2.JPG' }
  ];

  // Custom order for specific project images
  const customImageOrder = {
    'SAG HARBOR TOWN': ['outside-2-sht.png', 'front-door-sht.jpg'],
    'Sag Harbor': ['outside-1-sh.JPG'],
    'Brooklyn': ['exterior.jpeg']
  };

  // Sort images by folder order and custom image order
  const sortedProjects = interiorProjects.sort((a, b) => {
    const aFilename = a.image.split('/').pop();
    const bFilename = b.image.split('/').pop();

    // Check if both are in the combined Upper East Side 79th order
    const aInCombined = combinedUpperEastSide79thOrder.findIndex(
      item => item.location === a.location && item.filename === aFilename
    );
    const bInCombined = combinedUpperEastSide79thOrder.findIndex(
      item => item.location === b.location && item.filename === bFilename
    );

    if (aInCombined !== -1 && bInCombined !== -1) {
      return aInCombined - bInCombined;
    }

    // Fall back to folder order
    const aIndex = folderOrder.indexOf(a.location);
    const bIndex = folderOrder.indexOf(b.location);

    // If both locations are in the order array
    if (aIndex !== -1 && bIndex !== -1) {
      // If they're in different locations, sort by folder order
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }

      // If they're in the same location, check for custom image order
      const customOrder = customImageOrder[a.location];
      if (customOrder) {
        const aCustomIndex = customOrder.indexOf(aFilename);
        const bCustomIndex = customOrder.indexOf(bFilename);

        // Both have custom order
        if (aCustomIndex !== -1 && bCustomIndex !== -1) {
          return aCustomIndex - bCustomIndex;
        }
        // Only a has custom order (should come first)
        if (aCustomIndex !== -1 && bCustomIndex === -1) return -1;
        // Only b has custom order (should come first)
        if (aCustomIndex === -1 && bCustomIndex !== -1) return 1;
      }

      // No custom order, maintain original order
      return 0;
    }

    // If only one is in the order array, prioritize it
    if (aIndex !== -1 && bIndex === -1) return -1;
    if (aIndex === -1 && bIndex !== -1) return 1;

    // If neither is in the order array, maintain original order
    return 0;
  });

  // Load images on component mount
  useEffect(() => {
    generateImagesFromGitHub();
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle image click
  const handleImageClick = (project, index) => {
    setSelectedImage(project);
    setSelectedIndex(index);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedIndex(null);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex - 1 + sortedProjects.length) % sortedProjects.length;
    setSelectedImage(sortedProjects[newIndex]);
    setSelectedIndex(newIndex);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const newIndex = (selectedIndex + 1) % sortedProjects.length;
    setSelectedImage(sortedProjects[newIndex]);
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
            <p className="text-muted-foreground font-light tracking-[0.1em]">Loading images...</p>
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
            <div className="flex justify-between items-center">
              {/* Navigation */}
              <nav>
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

              {/* Logo */}
              <Link to="/" className="flex items-center space-x-4">
                <span className="text-sm font-light tracking-[0.3em] font-sans" style={{ transform: 'scaleY(0.7)' }}>ESTEFANIA INTERIORS</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Error State */}
        <div className="flex items-center justify-center min-h-[60vh] pt-6">
          <div className="text-center">
            <p className="text-red-500 font-light tracking-[0.1em] mb-4">{error}</p>
            <button 
              onClick={generateImagesFromGitHub}
              className="px-6 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors font-light tracking-[0.1em]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Function to format location text for display
  const formatLocationText = (location) => {
    if (location === 'Park Avenue, New York') {
      return 'PARK AVENUE, NEW YORK';
    } else if (location.includes('79th')) {
      return 'UPPER EAST SIDE, 79th Street';
    } else if (location.includes('90th')) {
      return 'UPPER EAST SIDE, 90th Street';
    } else if (location === 'Upper East Side') {
      return 'UPPER EAST SIDE, 79th Street';
    } else if (location === 'Manhattan West Side') {
      return 'MANHATTAN, WEST SIDE';
    } else if (location === 'SAG HARBOR TOWN') {
      return (
        <>
          THE HAMPTONS,<br />
          SAG HARBOR VILLAGE
        </>
      );
    } else if (location === 'Sag Harbor') {
      return 'THE HAMPTONS, SAG HARBOR';
    } else if (location === 'Buenos Aires') {
      return 'BUENOS AIRES';
    } else if (location === 'Brooklyn') {
      return 'BROOKLYN, NEW YORK';
    } else if (location === 'Upper East Side, Carnegie Hill') {
      return (
        <>
          UPPER EAST SIDE,<br />
          CARNEGIE HILL
        </>
        );
    } else if (location === 'Southampton') {
      return 'THE HAMPTONS, SOUTHAMPTON';
    }
    return location.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Interior Design Portfolio"
        description="Browse Estefania Bustamante's portfolio of luxury residential interior design projects across New York City, the Upper East Side, the Hamptons, Brooklyn, and Buenos Aires."
        path="/interiors"
      />
      <h1 className="sr-only">Interior Design Portfolio — Estefania Bustamante</h1>
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

      {/* Interiors Gallery */}
      <section className="pt-12 pb-6 px-4 flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project, index) => (
              <div
                key={project.id}
                className={`group relative overflow-hidden rounded-lg cursor-pointer ${
                  index === sortedProjects.length - 1 && sortedProjects.length % 3 === 1
                    ? 'lg:col-start-2'
                    : ''
                }`}
                onClick={() => handleImageClick(project, index)}
              >
                <div className="aspect-[4/3] relative">
                  <img 
                    src={project.image} 
                    alt={project.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-[10px] font-light tracking-[0.2em]">{formatLocationText(project.location)}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <div className="pt-24 pb-8 flex justify-center">
        <button
          onClick={scrollToTop}
          className="px-8 py-3 bg-gray-400 text-white hover:bg-gray-500 transition-colors duration-300 font-light tracking-[0.15em] text-[11px]"
          aria-label="Back to top"
        >
          BACK TO TOP
        </button>
      </div>

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

          <div className="relative max-w-[80vw] max-h-[90vh]">
            <img
              src={selectedImage.image}
              alt={selectedImage.alt}
              className="max-w-[80vw] max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-[10px] font-light tracking-[0.2em] font-sans">{formatLocationText(selectedImage.location)}</h3>
            </div>
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

      {/* Quote Section */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-center text-[12px] font-light leading-loose tracking-[0.1em] text-muted-foreground">
              "Make it simple, but significant." - Don Draper
            </blockquote>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Interiors;