import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { HiLocationMarker, HiEye, HiDownload, HiExternalLink, HiPlus, HiSparkles } from 'react-icons/hi';
import { getFranchises } from '../../firebase/firestore';
import SectionTitle from '../ui/SectionTitle';
import FranchiseCard from './FranchiseCard';
import FranchiseModal from './FranchiseModal';

const Franchises = () => {
    const [franchises, setFranchises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFranchise, setSelectedFranchise] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const ref = useInView({ once: true, margin: "-100px" });

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                const data = await getFranchises();
                setFranchises(data.filter(f => f.status === 'active'));
            } catch (err) {
                console.error('Error fetching franchises:', err);
                // Fallback to sample data for demo
                setFranchises([
                    {
                        id: '1',
                        name: 'Sandhya SoftTech Pune',
                        location: 'Pune, Maharashtra',
                        image: '/images/franchise-pune.jpg',
                        brochure: '/pdfs/pune-brochure.pdf',
                        mapLink: 'https://maps.google.com/?q=Pune,Maharashtra',
                        status: 'active',
                        description: 'Leading software development center in Pune, serving enterprise clients across India.',
                        established: '2022',
                        teamSize: '25+',
                        services: ['Web Development', 'Mobile Apps', 'SaaS Solutions']
                    },
                    {
                        id: '2',
                        name: 'Sandhya SoftTech Mumbai',
                        location: 'Mumbai, Maharashtra',
                        image: '/images/franchise-mumbai.jpg',
                        brochure: '/pdfs/mumbai-brochure.pdf',
                        mapLink: 'https://maps.google.com/?q=Mumbai,Maharashtra',
                        status: 'active',
                        description: 'Strategic Mumbai office focusing on fintech and enterprise solutions.',
                        established: '2023',
                        teamSize: '40+',
                        services: ['Fintech Solutions', 'Enterprise Software', 'Cloud Migration']
                    },
                    {
                        id: '3',
                        name: 'Sandhya SoftTech Bangalore',
                        location: 'Bangalore, Karnataka',
                        image: '/images/franchise-bangalore.jpg',
                        brochure: '/pdfs/bangalore-brochure.pdf',
                        mapLink: 'https://maps.google.com/?q=Bangalore,Karnataka',
                        status: 'active',
                        description: 'Innovation hub in Bangalore, specializing in AI and machine learning solutions.',
                        established: '2023',
                        teamSize: '30+',
                        services: ['AI/ML Solutions', 'Product Development', 'Tech Consulting']
                    },
                    {
                        id: '4',
                        name: 'Sandhya SoftTech Hyderabad',
                        location: 'Hyderabad, Telangana',
                        image: '/images/franchise-hyderabad.jpg',
                        brochure: '/pdfs/hyderabad-brochure.pdf',
                        mapLink: 'https://maps.google.com/?q=Hyderabad,Telangana',
                        status: 'active',
                        description: 'Emerging technology center in Hyderabad, focusing on startup ecosystem.',
                        established: '2024',
                        teamSize: '20+',
                        services: ['Startup Solutions', 'Web Development', 'Mobile Apps']
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFranchises();
    }, []);

    const handleViewDetails = (franchise) => {
        setSelectedFranchise(franchise);
        setShowModal(true);
    };

    const handleDownloadBrochure = (e, brochureUrl) => {
        e.stopPropagation();
        // Create download link
        const link = document.createElement('a');
        link.href = brochureUrl;
        link.download = brochureUrl.split('/').pop();
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGetLocation = (e, mapLink) => {
        e.stopPropagation();
        window.open(mapLink, '_blank');
    };

    if (loading) {
        return (
            <section className="section-padding bg-dark-100 relative overflow-hidden">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                            <HiSparkles className="text-orange-500 animate-pulse" />
                            <span className="text-orange-400 text-sm font-medium">Loading Franchises...</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="glass rounded-2xl p-6 border border-orange-500/10 animate-pulse">
                                    <div className="h-48 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 bg-white/5 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (franchises.length === 0) {
        return null; // Don't show section if no active franchises
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <>
            <section className="section-padding bg-dark-100 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 107, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 107, 0, 0.05) 0%, transparent 50%)',
                    }} />
                </div>

                {/* Glow Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />

                <div className="container-custom relative z-10">
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                            <HiSparkles className="text-orange-500" />
                            <span className="text-orange-400 text-sm font-medium">Our Presence</span>
                        </div>
                        
                        <SectionTitle
                            label="Our Franchises"
                            title={<>Expanding Innovation Across <span className="text-gradient">Multiple Locations</span></>}
                            subtitle="Building a network of technology excellence across India to serve our clients better."
                            center
                        />

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 shadow-inner">
                                <span className="text-xl font-bold text-white">{franchises.length}+</span>
                                <span className="text-gray-400 text-sm">Locations Across India</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Franchises Grid */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                    >
                        {franchises.map((franchise, index) => (
                            <motion.div key={franchise.id} variants={itemVariants}>
                                <FranchiseCard
                                    franchise={franchise}
                                    onViewDetails={() => handleViewDetails(franchise)}
                                    onDownloadBrochure={(e) => handleDownloadBrochure(e, franchise.brochure)}
                                    onGetLocation={(e) => handleGetLocation(e, franchise.mapLink)}
                                    index={index}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center"
                    >
                        <div className="glass rounded-2xl p-8 md:p-10 border border-orange-500/10 relative overflow-hidden max-w-4xl mx-auto">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-[240px] bg-orange-500/10 rounded-full blur-3xl" />
                            
                            <div className="relative z-10">
                                <h3 className="font-display font-bold text-white text-xl md:text-2xl mb-3">
                                    Want to Partner With Us?
                                </h3>
                                <p className="text-gray-400 text-base mb-6 max-w-xl mx-auto leading-relaxed">
                                    Join our growing network of technology franchises and be part of India's digital transformation journey.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.location.href = '/contact'}
                                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-300"
                                >
                                    <span className="relative z-10">Become a Franchise Partner</span>
                                    <HiPlus className="relative z-10 text-lg group-hover:rotate-90 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Franchise Details Modal */}
            <AnimatePresence>
                {showModal && selectedFranchise && (
                    <FranchiseModal
                        franchise={selectedFranchise}
                        onClose={() => setShowModal(false)}
                        onDownloadBrochure={() => handleDownloadBrochure(null, selectedFranchise.brochure)}
                        onGetLocation={() => handleGetLocation(null, selectedFranchise.mapLink)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Franchises;
