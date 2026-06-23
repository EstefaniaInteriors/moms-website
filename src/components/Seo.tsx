import { Helmet } from "react-helmet-async";

const SITE_URL = "https://estefaniabustamante.com";
const DEFAULT_IMAGE =
  "https://raw.githubusercontent.com/EstefaniaInteriors/moms-website/main/public/images/interiors/Upper%20East%20Side%2079th/dining-1.jpeg";

interface SeoProps {
  /** Page title (the site name is appended automatically). */
  title: string;
  /** Meta description for search engines and social cards. */
  description: string;
  /** Route path, e.g. "/interiors". Used for the canonical URL. */
  path: string;
  /** Optional social-share image URL. */
  image?: string;
  /** Set true to keep a page out of search results. */
  noindex?: boolean;
}

/**
 * Per-page SEO tags (title, description, canonical, Open Graph, Twitter).
 * Rendered via react-helmet-async so each route gets its own metadata.
 */
const Seo = ({ title, description, path, image = DEFAULT_IMAGE, noindex = false }: SeoProps) => {
  const fullTitle = `${title} | Estefania Bustamante Interiors`;
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
