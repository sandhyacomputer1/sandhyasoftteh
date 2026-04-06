import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, image }) => {
    const siteTitle = title ? `${title} | Sandhya SoftTech` : 'Sandhya SoftTech - AI-Powered Software Solutions';
    const siteDescription = description || 'We architect transformative digital experiences — from enterprise software to cutting-edge SaaS platforms.';
    const siteUrl = url || 'https://sandhyasofttech.com';
    const siteImage = image || '/navlogo.png'; // default fallback image

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={siteDescription} />
            
            {/* Open Graph metadata for social sharing */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={siteImage} />
            <meta property="og:url" content={siteUrl} />
            
            {/* Twitter Card data */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={siteImage} />
        </Helmet>
    );
};

export default SEO;
