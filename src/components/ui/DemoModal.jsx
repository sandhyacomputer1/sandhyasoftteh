import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitDemoRequest, getProjects } from '../../firebase/firestore';
import { HiX, HiCheckCircle } from 'react-icons/hi';

const DemoModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        product: '',
        date: '',
        time: '',
        requirements: '',
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoadingProjects(false);
            }
        };
        fetchProjects();
    }, []);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            await submitDemoRequest(form);
            setStatus('success');
            setForm({ name: '', email: '', phone: '', companyName: '', product: '', date: '', time: '', requirements: '' });
        } catch (err) {
            setStatus('error');
            setErrorMsg('Failed to submit request. Please try again.');
            console.error(err);
        }
    };

    // Scroll Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        if (status === 'loading') return;
        setStatus('idle');
        setForm({ name: '', email: '', phone: '', companyName: '', product: '', date: '', time: '', requirements: '' });
        onClose();
    };

    // Get tomorrow's date for the min attribute on the date input
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-2xl bg-[#0A0A0F] border border-orange-500/20 rounded-2xl shadow-[0_0_40px_rgba(255,107,0,0.1)] overflow-hidden overscroll-contain"
                        data-lenis-prevent
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                            <div>
                                <h3 className="font-display font-bold text-2xl text-white">Book a Demo</h3>
                                <p className="text-gray-400 text-sm mt-1">See our products in action with a personalized tour.</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <HiX className="text-xl" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <HiCheckCircle className="text-7xl text-green-500 mx-auto mb-5" />
                                    <h4 className="font-display font-bold text-white text-2xl mb-3">Demo Requested!</h4>
                                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                        Thank you for your interest. Our team will review your request and confirm your demo slot via email shortly.
                                    </p>
                                    <button onClick={handleClose} className="btn-primary">
                                        Close Window
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Full Name *</label>
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Rajesh Sharma"
                                                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Work Email *</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="rajesh@company.com"
                                                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Phone Number *</label>
                                            <input
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="+91 99999 99999"
                                                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Company Name *</label>
                                            <input
                                                name="companyName"
                                                value={form.companyName}
                                                onChange={handleChange}
                                                required
                                                placeholder="Sandhya SoftTech"
                                                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Product of Interest *</label>
                                        <select
                                            name="product"
                                            value={form.product}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                                            disabled={loadingProjects}
                                        >
                                            <option value="" disabled>
                                                {loadingProjects ? 'Loading products...' : 'Select a product...'}
                                            </option>
                                            {projects.map((p) => (
                                                <option key={p.id} value={p.title}>{p.title}</option>
                                            ))}
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Preferred Date *</label>
                                            <input
                                                name="date"
                                                type="date"
                                                min={getTomorrowDate()}
                                                value={form.date}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors [color-scheme:dark]"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Preferred Time *</label>
                                            <input
                                                name="time"
                                                type="time"
                                                value={form.time}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1.5">Specific Requirements</label>
                                        <textarea
                                            name="requirements"
                                            value={form.requirements}
                                            onChange={handleChange}
                                            placeholder="Tell us about what you're looking for..."
                                            rows={3}
                                            className="w-full bg-dark-300 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600 resize-none"
                                        />
                                    </div>

                                    {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

                                    <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="btn-outline px-6 py-2.5 disabled:opacity-50"
                                            disabled={status === 'loading'}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="btn-primary px-8 py-2.5 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                                    Scheduling...
                                                </>
                                            ) : (
                                                'Schedule Demo'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DemoModal;
