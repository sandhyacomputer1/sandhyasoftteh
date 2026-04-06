import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiLocationMarker, HiDownload, HiExternalLink, HiCalendar, HiUsers, HiBriefcase, HiGlobeAlt } from 'react-icons/hi';

const FranchiseModal = ({ franchise, onClose, onDownloadBrochure, onGetLocation }) => {
    // Scroll Lock
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-dark-100 rounded-3xl max-w-4xl mx-auto my-4 max-h-[90vh] overflow-y-auto border border-orange-500/20 relative overscroll-contain"
                data-lenis-prevent
            >
                {/* Header Image */}
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                    {franchise.image ? (
                        <img
                            src={franchise.image}
                            alt={franchise.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-orange-600/30 flex items-center justify-center">
                            <HiLocationMarker className="text-6xl text-orange-400" />
                        </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Close Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300"
                    >
                        <HiX className="text-xl" />
                    </motion.button>

                    {/* Title Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="font-display font-bold text-white text-3xl mb-2">
                            {franchise.name}
                        </h2>
                        <div className="flex items-center gap-3 text-gray-200">
                            <HiLocationMarker className="text-orange-400" />
                            <span className="text-lg">{franchise.location}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Status Badge */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Active Franchise</span>
                        </div>
                    </div>

                    {/* Description */}
                    {franchise.description && (
                        <div className="mb-8">
                            <h3 className="font-display font-bold text-white text-lg mb-3 flex items-center gap-2">
                                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                About This Location
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed border-l border-white/5 pl-4">
                                {franchise.description}
                            </p>
                        </div>
                    )}

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {franchise.established && (
                            <div className="glass rounded-xl p-4 border border-orange-500/10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <HiCalendar className="text-orange-500 text-lg" />
                                </div>
                                <div>
                                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block mb-0.5">Established</span>
                                    <p className="text-white text-lg font-bold leading-none">{franchise.established}</p>
                                </div>
                            </div>
                        )}

                        {franchise.teamSize && (
                            <div className="glass rounded-xl p-4 border border-orange-500/10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <HiUsers className="text-orange-500 text-lg" />
                                </div>
                                <div>
                                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block mb-0.5">Team Size</span>
                                    <p className="text-white text-lg font-bold leading-none">{franchise.teamSize}</p>
                                </div>
                            </div>
                        )}

                        <div className="glass rounded-xl p-4 border border-orange-500/10 flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0">
                                <HiBriefcase className="text-orange-500 text-lg" />
                            </div>
                            <div>
                                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block mb-0.5">Services</span>
                                <p className="text-white text-lg font-bold leading-none">
                                    {franchise.services?.length || 0}+
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    {franchise.services && franchise.services.length > 0 && (
                        <div className="mb-10">
                            <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-orange-500 rounded-full" />
                                Core Services
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {franchise.services.map((service, index) => (
                                    <div key={index} className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5 group/service hover:bg-orange-500/5 hover:border-orange-500/20 transition-all duration-300">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0 shadow-[0_0_10px_rgba(255,107,0,0.6)] group-hover/service:scale-125 transition-transform" />
                                        <span className="text-gray-200 text-sm font-semibold tracking-wide capitalize">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onDownloadBrochure}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl hover:from-orange-600 hover:to-orange-500 transition-all duration-300 shadow-lg shadow-orange-500/10"
                        >
                            <HiDownload className="text-lg" />
                            <span>Download Brochure</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onGetLocation}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300"
                        >
                            <HiGlobeAlt className="text-lg" />
                            <span>Get Location</span>
                        </motion.button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="text-center">
                            <p className="text-gray-500 text-xs mb-4 uppercase tracking-[0.2em] font-bold">Partner Engagement</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/contact'}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold rounded-xl hover:bg-orange-500/20 transition-all duration-300"
                            >
                                <span>Contact This Franchise</span>
                                <HiExternalLink className="text-sm" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FranchiseModal;
