import { motion } from 'framer-motion';
import { HiLocationMarker, HiEye, HiDownload, HiExternalLink, HiCheckCircle } from 'react-icons/hi';

const FranchiseCard = ({ franchise, onViewDetails, onDownloadBrochure, onGetLocation, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(255, 107, 0, 0.15)",
                transition: { duration: 0.5, ease: "easeOut" }
            }}
            className="glass rounded-2xl overflow-hidden border border-orange-500/10 hover:border-orange-500/30 transition-all duration-500 cursor-pointer group"
            onClick={onViewDetails}
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 z-10" />
                
                {/* Image */}
                <div className="absolute inset-0">
                    {franchise.image ? (
                        <motion.img
                            src={franchise.image}
                            alt={franchise.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500/30 to-orange-600/30 flex items-center justify-center">
                            <div className="text-center">
                                <HiLocationMarker className="text-4xl text-orange-400 mx-auto mb-2" />
                                <p className="text-orange-300 text-sm">Location Image</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                        <HiCheckCircle className="text-green-400 text-sm" />
                        <span className="text-green-400 text-xs font-medium">Active</span>
                    </div>
                </div>

                {/* Hover Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"
                >
                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white/80 text-xs">Click to view details</p>
                    </div>
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Franchise Name */}
                <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-orange-400 transition-colors duration-300">
                    {franchise.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <HiLocationMarker className="text-orange-500 text-base" />
                    <span>{franchise.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* View Details Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-500 transition-all duration-300 shadow-md shadow-orange-500/10"
                    >
                        <HiEye className="text-sm" />
                        <span>View Details</span>
                    </motion.button>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Download Brochure */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onDownloadBrochure}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 border border-white/20 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/15 hover:border-orange-500/30 hover:text-orange-400 transition-all duration-300"
                        >
                            <HiDownload className="text-base" />
                            <span>Brochure</span>
                        </motion.button>

                        {/* Get Location */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onGetLocation}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 border border-white/20 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/15 hover:border-orange-500/30 hover:text-orange-400 transition-all duration-300"
                        >
                            <HiExternalLink className="text-base" />
                            <span>Location</span>
                        </motion.button>
                    </div>
                </div>

                {/* Additional Info */}
                {(franchise.established || franchise.teamSize) && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs">
                            {franchise.established && (
                                <div className="text-gray-400">
                                    <span className="text-gray-500">Since</span> {franchise.established}
                                </div>
                            )}
                            {franchise.teamSize && (
                                <div className="text-gray-400">
                                    <span className="text-gray-500">Team</span> {franchise.teamSize}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default FranchiseCard;
