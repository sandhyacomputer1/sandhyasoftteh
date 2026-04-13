import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import DemoModal from '../ui/DemoModal';

const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/#about' },
    { name: 'Services', to: '/#services' },
    { name: 'Portfolio', to: '/#portfolio' },
    { name: 'Testimonials', to: '/#testimonials' },
    { name: 'Careers', to: '/careers' },
    { name: 'Contact', to: '/contact' },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [demoOpen, setDemoOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const handleHashLink = (e, to) => {
        if (to.startsWith('/#')) {
            e.preventDefault();
            const id = to.replace('/#', '');
            if (location.pathname !== '/') {
                navigate(to);
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'glass-dark border-b border-orange-500/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                    : 'bg-transparent'
                    }`}
            >
                <div className="w-full pl-[10px] pr-4 md:pr-8 xl:pr-12 flex items-center h-[70px]">
                    {/* Logo (Left Aligned) */}
                    <div className="flex-1">
                        <Link to="/" className="inline-flex items-center gap-3 group">
                            <motion.img
                                src="/navlogo.png"
                                alt="Sandhya SoftTech"
                                className="h-12 w-12 object-contain"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                            <div className="leading-tight">
                                <p className="font-display font-bold text-white text-xl tracking-widest block">SANDHYA</p>
                                <p className="font-display font-bold text-xs tracking-[0.2em] text-gradient block ml-0.5">SOFTTECH</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Links (Centered) */}
                    <div className="hidden lg:block flex-none">
                        <ul className="flex items-center justify-center gap-10">
                            {navLinks.map((link) => (
                                <li key={link.name} className="relative group">
                                    <Link
                                        to={link.to}
                                        onClick={(e) => handleHashLink(e, link.to)}
                                        className="text-gray-300 hover:text-white text-base font-medium transition-colors duration-200 py-2"
                                    >
                                        {link.name}
                                    </Link>
                                    <motion.span
                                        className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Actions / Mobile Hamburger */}
                    <div className="flex-1 flex justify-end items-center gap-3">
                        <div className="hidden lg:flex items-center gap-3">
                            <motion.button
                                onClick={() => setDemoOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn-primary text-xs px-4 py-2"
                            >
                                Book a Demo
                            </motion.button>
                        </div>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden text-white text-2xl p-2 ml-2"
                        >
                            {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-[70px] left-0 right-0 glass-dark border-b border-orange-500/10 z-40 lg:hidden"
                    >
                        <ul className="flex flex-col py-4 px-6 gap-1">
                            {navLinks.map((link, i) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                >
                                    <Link
                                        to={link.to}
                                        onClick={(e) => {
                                            handleHashLink(e, link.to);
                                            setMobileOpen(false);
                                        }}
                                        className="block py-3 text-gray-300 hover:text-orange-500 font-medium transition-colors border-b border-white/5"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                            <motion.li
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <motion.button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        setDemoOpen(true);
                                    }}
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,107,0,0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary w-full text-sm py-2.5"
                                >
                                    Book a Demo
                                </motion.button>
                            </motion.li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Demo Modal */}
            <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
        </>
    );
};

export default Navbar;
