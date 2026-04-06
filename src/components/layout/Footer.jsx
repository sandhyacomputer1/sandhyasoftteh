import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { motion } from 'framer-motion';
import LegalModal from '../ui/LegalModal';

const Footer = () => {

    const year = new Date().getFullYear();
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [activeContent, setActiveContent] = useState('privacy');
    const location = useLocation();
    const navigate = useNavigate();

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

    const quickLinks = [
        { name: 'Home', to: '/' },
        { name: 'About', to: '/#about' },
        { name: 'Services', to: '/#services' },
        { name: 'Portfolio', to: '/#portfolio' },
        { name: 'Careers', to: '/careers' },
        { name: 'Contact', to: '/contact' },
    ];

    const services = [
        'Custom Software Development',
        'Web Application Development',
        'Mobile App Development',
        'SaaS Product Development',
    ];

    const socials = [
        { icon: <FaWhatsapp />, href: 'https://wa.me/919527537131?text=Hi%20Sandhya%20SoftTech,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.', label: 'WhatsApp' },
        { icon: <FaLinkedin />, href: 'https://www.linkedin.com/company/sandhya-softtech-pvt-ltd/', label: 'LinkedIn' },
        { icon: <FaInstagram />, href: 'https://www.instagram.com/sandhyasofttechpvtltd?igsh=MXBld2JlMGhrM3RrMQ==', label: 'Instagram' },
        { icon: <FaWhatsapp />, href: 'https://wa.me/919527537131?text=Hi%20Sandhya%20SoftTech,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.', label: 'WhatsApp' },
    ];

    return (
        <>
            <footer className="bg-dark-100 border-t border-orange-500/10 relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />

                <div className="container-custom pt-16 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <Link to="/" className="flex items-center gap-3 mb-6 pt-6">
                                <img src="/navlogo.png" alt="Sandhya SoftTech" className="h-10 w-10 object-contain" />
                                <div>
                                    <p className="font-display font-bold text-white text-xl tracking-widest block">SANDHYA</p>
                                    <p className="font-display font-bold text-xs tracking-[0.2em] text-gradient block ml-0.5">SOFTTECH PVT. LTD.</p>
                                </div>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Empowering businesses through intelligent software solutions. We build the future of digital transformation.
                            </p>

                            {/* Social */}
                            <h4 className="font-display font-bold text-white mb-5 text-sm tracking-wide uppercase mt-8">Follow Us</h4>
                            <div className="flex gap-4 mt-6">
                                <a
                                    href="https://wa.me/919527537131?text=Hi%20Sandhya%20SoftTech,%20I%20would%20like%20to%20discuss%20a%20project%20with%20you."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    <FaWhatsapp size={24} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/sandhya-softtech-pvt-ltd/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    <FaLinkedin size={24} />
                                </a>
                                <a
                                    href="https://www.instagram.com/sandhyasofttechpvtltd?igsh=MXBld2JlMGhrM3RrMQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    <FaInstagram size={24} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="lg:col-span-1 pt-6">
                            <h4 className="font-display font-bold text-white mb-5 text-sm tracking-wide uppercase">Quick Links</h4>
                            <ul className="space-y-2.5">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.to}
                                            onClick={(e) => handleHashLink(e, link.to)}
                                            className="text-gray-400 hover:text-orange-500 text-sm transition-colors flex items-center gap-2 group"
                                        >
                                            <span className="w-0 group-hover:w-4 transition-all h-[1px] bg-orange-500 inline-block" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="lg:col-span-1 pt-6">
                            <h4 className="font-display font-bold text-white mb-5 text-sm tracking-wide uppercase">Services</h4>
                            <ul className="space-y-2.5">
                                {services.map((s) => (
                                    <li key={s} className="text-gray-400 text-sm flex items-start gap-2">
                                        <span className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-orange-500 block" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="lg:col-span-1 pt-6">
                            <h4 className="font-display font-bold text-white mb-5 text-sm tracking-wide uppercase">Contact Us</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-gray-400 text-sm">
                                    <HiLocationMarker className="text-orange-500 shrink-0 text-lg" />
                                    <div>
                                        <p className="text-white font-medium mb-1">Head Office:</p>
                                        <p>Sandhya Softtech Pvt Ltd,<br />Mondha Rd, Miya Bhai Colony,<br />Ambajogai, Maharashtra 431515</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 text-gray-400 text-sm">
                                    <HiPhone className="text-orange-500 shrink-0 text-lg" />
                                    <div>
                                        <p className="text-white font-medium mb-1">Phone:</p>
                                        <a href="tel:+918767145100" className="hover:text-orange-500 transition-colors block">+91 87671 45100</a>
                                        <a href="tel:+919527537131" className="hover:text-orange-500 transition-colors block">+91 95275 37131</a>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <HiMail className="text-orange-500 shrink-0 text-lg" />
                                    <a href="mailto:sandhyasofttechpvtltd@gmail.com" className="hover:text-orange-500 transition-colors">sandhyasofttechpvtltd@gmail.com</a>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400 text-sm">
                                    <HiMail className="text-orange-500 shrink-0 text-lg" />
                                    <div>
                                        <p className="text-white font-medium mb-1">Business Hours:</p>
                                        <p>Mon – Sat: 9 AM – 6 PM IST</p>
                                    </div>
                                </li>

                            </ul>

                            {/* Map */}
                            <div className="mt-8 rounded-xl overflow-hidden border border-white/10 relative h-36 w-full shadow-[0_0_15px_rgba(255,107,0,0.05)]">
                                <iframe
                                    src="https://maps.google.com/maps?q=Sandhya%20Softtech%20Pvt%20Ltd,%20Ambajogai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0 grayscale contrast-125 opacity-70 hover:grayscale-0 transition-all duration-500 hover:opacity-100"
                                ></iframe>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-3 px-5">
                    <p className="text-gray-500 text-xs">
                        &copy; {year} Sandhya SoftTech Pvt. Ltd. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setActiveContent('privacy');
                                setShowLegalModal(true);
                            }}
                            className="text-gray-500 text-xs hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => {
                                setActiveContent('terms');
                                setShowLegalModal(true);
                            }}
                            className="text-gray-500 text-xs hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Terms of Use
                        </button>
                        <button
                            onClick={() => {
                                setActiveContent('cookies');
                                setShowLegalModal(true);
                            }}
                            className="text-gray-500 text-xs hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Cookie Policy
                        </button>
                    </div>
                </div>
            </footer>

            {/* Legal Modal */}
            <LegalModal 
                isOpen={showLegalModal}
                onClose={() => setShowLegalModal(false)}
                activeContent={activeContent}
            />

        </>
    );
};

export default Footer;
