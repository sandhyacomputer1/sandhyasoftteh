import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiStar } from 'react-icons/hi';
import SectionTitle from '../ui/SectionTitle';
import { getTestimonials } from '../../firebase/firestore';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [currentSet, setCurrentSet] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getTestimonials();
                setTestimonials(data);
            } catch (err) {
                console.error('Error fetching testimonials:', err);
                // No fallback data - start with empty array
                setTestimonials([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    // Split testimonials into groups (3 for desktop/tablet, 1 for mobile as requested)
    const setSize = isMobile ? 1 : 3;
    const testimonialSets = [];
    for (let i = 0; i < testimonials.length; i += setSize) {
        testimonialSets.push(testimonials.slice(i, i + setSize));
    }

    // Auto-scroll: 2 seconds on mobile, 5 seconds on desktop
    useEffect(() => {
        if (!inView || isPaused || testimonialSets.length <= 1) return;

        const intervalDuration = isMobile ? 2000 : 5000;
        const interval = setInterval(() => {
            setCurrentSet((prev) => (prev + 1) % testimonialSets.length);
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [inView, isPaused, testimonialSets.length, isMobile]);

    // Handle hover pause
    const handleMouseEnter = () => {
        setIsPaused(true);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    const handleMouseLeave = () => {
        // Resume after 5 seconds
        const newTimeoutId = setTimeout(() => {
            setIsPaused(false);
        }, 4000);
        setTimeoutId(newTimeoutId);
    };

    if (loading) {
        return (
            <section id="testimonials" className="section-padding bg-dark-100 relative overflow-hidden">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return null; // Don't show section if no testimonials
    }

    const currentTestimonials = testimonialSets[currentSet] || [];

    const StarRating = ({ rating }) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <HiStar
                        key={i}
                        className={`text-lg ${i < rating ? 'text-orange-400 fill-current' : 'text-gray-600'}`}
                    />
                ))}
            </div>
        );
    };

    const TestimonialCard = ({ testimonial, index }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                    y: -5,
                    scale: 1.02,
                    borderColor: "rgba(255, 107, 0, 0.5)"
                }}
                className="glass rounded-2xl p-6 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 h-full"
            >
                <div className="text-center h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex justify-center mb-4">
                        <StarRating rating={testimonial.rating} />
                    </div>

                    {/* Testimonial text */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 italic flex-grow">
                        "{testimonial.testimonial}"
                    </p>

                    {/* Name and position */}
                    <div className="border-t border-white/10 pt-4 mt-auto">
                        <h4 className="font-display font-bold text-white text-base mb-1">{testimonial.name}</h4>
                        <p className="text-gray-400 text-xs">{testimonial.position}</p>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <section id="testimonials" className="section-padding bg-dark-100 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 via-transparent to-transparent pointer-events-none" />

            <div className="container-custom">
                <SectionTitle
                    label="Client Testimonials"
                    title={<>What Our <span className="text-gradient">Clients Say</span></>}
                    subtitle="Real experiences from professionals we've helped transform with our software solutions."
                    center
                />

                {/* Testimonials Grid - 3 Cards at a time */}
                <div className="relative mt-12" ref={ref}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSet}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {currentTestimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={testimonial.id}
                                    testimonial={testimonial}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {testimonialSets.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setCurrentSet(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSet
                                ? 'bg-orange-500 w-8'
                                : 'bg-gray-600 hover:bg-gray-500 w-2'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
