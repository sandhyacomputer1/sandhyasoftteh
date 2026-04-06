import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import { HiArrowRight, HiChip } from 'react-icons/hi';
import { categories } from '../../data/projects';
import { getProjects } from '../../firebase/firestore';

const Portfolio = () => {
    const [active, setActive] = useState('All');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

    return (
        <section id="portfolio" className="section-padding bg-dark-100 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

            <div className="container-custom">
                <SectionTitle
                    label="Our Portfolio"
                    title={<>Work That <span className="text-gradient">Speaks For Itself</span></>}
                    subtitle="A curated showcase of our most impactful solutions across industries and technologies."
                    center
                />

                {/* Category Filter */}
                <div ref={ref} className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => setActive(cat)}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active === cat
                                ? 'bg-orange-500 text-white shadow-orange'
                                : 'glass text-gray-400 hover:text-white border border-white/5'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((p, i) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                className="group relative rounded-2xl overflow-hidden glass border border-white/5 hover:border-orange-500/30 transition-all card-hover cursor-pointer"
                            >
                                {/* Placeholder visual */}
                                <div className={`h-48 bg-gradient-to-br ${p.color} relative overflow-hidden`}>
                                    <div
                                        className="absolute inset-0 opacity-20"
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                            backgroundSize: '20px 20px',
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {p.logoURL ? (
                                            <motion.img
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                src={p.logoURL}
                                                alt={p.title}
                                                className="w-full h-full object-cover drop-shadow-2xl"
                                            />
                                        ) : (
                                            <HiChip className="text-6xl text-orange-500/30" />
                                        )}
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-dark-100/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            className="text-center px-6"
                                        >
                                            <p className="text-white font-bold text-base mb-1">{p.title}</p>
                                            <button
                                                onClick={() => navigate(`/portfolio/${p.id}`)}
                                                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 mx-auto hover:-translate-y-1 transition-transform"
                                            >
                                                View Details <HiArrowRight />
                                            </button>
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <span className="text-xs text-orange-500 font-semibold tracking-widest">{p.category}</span>
                                    <h3 className="font-display font-bold text-white text-base mt-1">{p.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Portfolio;
