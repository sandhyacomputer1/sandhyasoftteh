import { motion } from 'framer-motion';
import { HiLightningBolt, HiCode, HiChip, HiDatabase, HiCloud } from 'react-icons/hi';

import { useState } from 'react';

const FloatingIcon = ({ icon: Icon, delay, x, y, size = 'text-2xl', floatRange = 15 }) => {
    const [duration] = useState(() => 4 + Math.random() * 2);
    
    return (
        <motion.div
            animate={{
                y: [0, -floatRange, 0],
                rotate: [0, 5, -5, 0],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className={`absolute ${x} ${y} z-20`}
        >
            <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/40 transition-all duration-300" />
                <div className="relative glass-dark p-4 rounded-full border border-orange-500/30 text-orange-400 group-hover:scale-110 group-hover:border-orange-500/60 transition-all shadow-[0_0_30px_rgba(255,107,0,0.15)] group-hover:shadow-[0_0_40px_rgba(255,107,0,0.3)]">
                    <Icon className={size} />
                </div>
            </div>
        </motion.div>
    );
};

const HeroIllustration = () => {
    return (
        <div className="relative w-full h-[500px] hidden lg:flex items-center justify-center mt-12 lg:mt-0">
            {/* Center Core Node */}
            <motion.div
                animate={{
                    boxShadow: [
                        '0 0 40px rgba(255,107,0,0.2)',
                        '0 0 80px rgba(255,107,0,0.4)',
                        '0 0 40px rgba(255,107,0,0.2)'
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-32 h-32 rounded-full glass-dark border border-orange-500/40 flex items-center justify-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-orange-500/30"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.5)]"
                >
                    <HiChip className="text-3xl text-white drop-shadow-md" />
                </motion.div>
            </motion.div>

            {/* Orbit Rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border-[1px] border-white/5 z-0"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-[1px] border-white/5 border-dashed z-0"
            />

            {/* Floating Connecting Nodes */}
            <FloatingIcon icon={HiCode} delay={0} x="right-[15%]" y="top-[15%]" size="text-xl" floatRange={12} />
            <FloatingIcon icon={HiDatabase} delay={1.5} x="left-[20%]" y="bottom-[15%]" size="text-2xl" floatRange={18} />
            <FloatingIcon icon={HiCloud} delay={0.8} x="right-[25%]" y="bottom-[25%]" size="text-xl" floatRange={10} />
            <FloatingIcon icon={HiLightningBolt} delay={2.2} x="left-[15%]" y="top-[25%]" size="text-3xl" floatRange={20} />

            {/* Decorative Connection Lines (SVG) */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {/* Simulated SVG paths connecting the nodes */}
                    <path d="M 25 25 Q 50 50 50 50" stroke="rgba(255,107,0,0.15)" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
                    <path d="M 85 15 Q 50 50 50 50" stroke="rgba(255,107,0,0.15)" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
                    <path d="M 20 85 Q 50 50 50 50" stroke="rgba(255,107,0,0.15)" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
                    <path d="M 75 75 Q 50 50 50 50" stroke="rgba(255,107,0,0.15)" strokeWidth="0.5" fill="none" strokeDasharray="1 1" />
                </motion.g>
            </svg>
        </div>
    );
};

export default HeroIllustration;
