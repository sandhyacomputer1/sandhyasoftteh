import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiChatAlt2, HiLightningBolt, HiCloud, HiLockClosed, HiChip, HiRefresh, HiChartBar, HiGlobe, HiClock, HiCode, HiDeviceMobile } from 'react-icons/hi';
import NeuralNetworkCanvas from '../ui/NeuralNetworkCanvas';
import DemoModal from '../ui/DemoModal';
import HeroIllustration from '../ui/HeroIllustration';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const StatItem = ({ s, i }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    return (
        <div ref={ref} className="flex items-center gap-3">
            <p className="font-display font-bold text-2xl text-gradient">
                {inView ? (
                    <CountUp start={0} end={s.end} duration={1.5} suffix={s.suffix} />
                ) : '0' + s.suffix}
            </p>
            <p className="text-gray-500 text-xs leading-tight max-w-[70px]">{s.label}</p>
            {i < 2 && <div className="w-px h-6 bg-white/10" />}
        </div>
    );
};

const Hero = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [demoOpen, setDemoOpen] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handler = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);


    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        show: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.18, duration: 0.7, ease: 'easeOut' },
        }),
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0F]">

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0A0A0F]/90 to-[rgba(255,107,0,0.05)] z-[1]" />

            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-orange-500/5 blur-3xl z-[1]" />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 z-[1] opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,107,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.5) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Neural network canvas overlay */}
            <NeuralNetworkCanvas isMobile={isMobile} />

            {/* Content */}
            <div className="w-full px-8 md:px-14 lg:px-20 relative z-10 pt-28 pb-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Text Content */}
                    <div className="flex-1 w-full max-w-3xl">
                        <motion.div
                            custom={0}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full mb-6 border border-orange-500/20"
                        >
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-xs text-orange-400 font-medium tracking-widest">AI-POWERED SOFTWARE SOLUTIONS</span>
                        </motion.div>

                        <motion.h1
                            custom={1}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-white mb-6"
                        >
                            Empowering Businesses<br />
                            Through{' '}
                            <span className="text-gradient glow-text">Intelligent</span>
                            <br />
                            Software Solutions
                        </motion.h1>

                        <motion.p
                            custom={2}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="text-gray-400 text-lg sm:text-xl max-w-2xl mb-6 leading-relaxed"
                        >
                            We architect transformative digital experiences — from enterprise software to cutting-edge
                            SaaS platforms — accelerating your business into the intelligent future.
                        </motion.p>

                        {/* Feature Tags */}
                        <motion.div
                            custom={2.5}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="flex flex-wrap gap-2.5 mb-8"
                        >
                            {[
                                { Icon: HiLightningBolt, label: 'Enterprise Grade', tip: 'Built for high-performance enterprise environments' },
                                { Icon: HiChip, label: 'AI-Powered', tip: 'Intelligent automation at every layer' },
                                { Icon: HiCloud, label: 'Cloud Native', tip: 'Seamlessly deployed on AWS, GCP or Azure' },
                                { Icon: HiLockClosed, label: 'Secure & Scalable', tip: 'ISO-grade security with infinite scalability' },
                                { Icon: HiRefresh, label: 'CI/CD Ready', tip: 'Continuous delivery pipelines built-in' },

                            ].map(({ Icon, label, tip }) => (
                                <div key={label} className="relative group cursor-default">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 group-hover:border-orange-500/40 group-hover:text-orange-400 group-hover:bg-orange-500/5 transition-all duration-200">
                                        <Icon className="text-sm text-orange-400/80 group-hover:text-orange-400" />
                                        {label}
                                    </span>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-[#111118] border border-orange-500/20 text-xs text-gray-300 whitespace-nowrap shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50 pointer-events-none">
                                        {tip}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-orange-500/20" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div
                            custom={3}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="flex flex-wrap gap-4 mt-2"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary flex items-center gap-2 text-base px-7 py-3.5 shadow-lg shadow-orange-500/20"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = '/assets/brochure.pdf';
                                    link.download = 'Sandhya_SoftTech_Brochure.pdf';
                                    link.click();
                                }}
                            >
                                Download Brochure <HiArrowRight className="text-lg" />
                            </motion.button>
                            <a href="/#services" onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,107,0,0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-outline flex items-center gap-2 text-base px-7 py-3.5 backdrop-blur-sm bg-white/5"
                                >
                                    Explore Services
                                </motion.button>
                            </a>
                        </motion.div>

                        {/* Stats + Trust section */}
                        <motion.div
                            custom={4}
                            variants={fadeUp}
                            initial="hidden"
                            animate="show"
                            className="mt-10 space-y-5"
                        >
                            {/* Stats row */}
                            <div className="flex flex-wrap gap-6 items-center p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md max-w-fit shadow-xl">
                                {[
                                    { label: 'Projects Delivered', end: 30, suffix: '+' },
                                    { label: 'Happy Clients', end: 20, suffix: '+' },
                                    { label: 'Client Satisfaction', end: 100, suffix: '%' },
                                ].map((s, i) => (
                                    <StatItem key={s.label} s={s} i={i} />
                                ))}
                            </div>

                        </motion.div>
                    </div>

                    {/* Right Illustration Content */}
                    <div className="flex-1 w-full hidden lg:block">
                        <HeroIllustration />
                    </div>

                </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent z-10" />

            {/* Scroll hint */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
            >
                <p className="text-gray-600 text-xs tracking-widest">SCROLL DOWN</p>
                <div className="w-[2px] h-8 bg-gradient-to-b from-orange-500 to-transparent" />
            </motion.div>

            {/* Demo Modal */}
            <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
        </section>
    );
};

export default Hero;
