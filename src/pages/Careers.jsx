import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionTitle from '../components/ui/SectionTitle';
import SEO from '../components/SEO';
import { submitJobApplication, submitFutureApplication } from '../firebase/firestore';
import { uploadResume } from '../firebase/storage';
import { getJobs } from '../firebase/firestore';
import { HiBriefcase, HiLocationMarker, HiClock, HiUpload, HiCheckCircle, HiLightBulb, HiHeart, HiGlobeAlt, HiUserGroup, HiAcademicCap, HiSparkles, HiMail, HiBookmark, HiArrowRight } from 'react-icons/hi';
import FutureApplicationForm from '../components/ui/FutureApplicationForm';

const benefits = [
    {
        icon: <HiSparkles className="w-8 h-8" />,
        title: 'Innovation-Driven Culture',
        description: 'Work on cutting-edge projects that challenge the status quo and push technological boundaries.'
    },
    {
        icon: <HiLightBulb className="w-8 h-8" />,
        title: 'Continuous Learning',
        description: 'Access to training programs, workshops, and conferences to enhance your skills.'
    },
    {
        icon: <HiHeart className="w-8 h-8" />,
        title: 'Work-Life Balance',
        description: 'Flexible work hours and remote options to support your personal and professional life.'
    },
    {
        icon: <HiGlobeAlt className="w-8 h-8" />,
        title: 'Global Impact',
        description: 'Work on projects that make a difference for clients worldwide.'
    },
    {
        icon: <HiUserGroup className="w-8 h-8" />,
        title: 'Career Growth',
        description: 'Clear career progression paths and opportunities for advancement.'
    },
    {
        icon: <HiAcademicCap className="w-8 h-8" />,
        title: 'Learning & Development',
        description: 'Mentorship programs and skill development initiatives.'
    }
];

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', coverLetter: '', resume: null });
    const [futureForm, setFutureForm] = useState({ name: '', email: '', phone: '', role: '', message: '', resume: null });
    const [status, setStatus] = useState('idle');
    const [futureStatus, setFutureStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [futureErrorMsg, setFutureErrorMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('all');
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showTalentPoolModal, setShowTalentPoolModal] = useState(false);
    const fileRef = useRef();
    const futureFileRef = useRef();
    const openingsRef = useRef(null);
    const talentPoolRef = useRef(null);

    // Scroll to openings or talent pool
    const scrollToContent = () => {
        if (jobs.length > 0) {
            openingsRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
            talentPoolRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Fetch jobs from Firebase
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                console.log('Fetching jobs from Firebase...');
                const jobList = await getJobs();
                console.log('Jobs fetched:', jobList);
                setJobs(jobList);
                console.log('Jobs state updated:', jobList.length, 'jobs found');
            } catch (err) {
                console.error('Error fetching jobs:', err);
                console.error('Full error details:', err.code, err.message);
            } finally {
                setJobsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter jobs
    const filteredJobs = useMemo(() => {
        let filtered = jobs;
        if (selectedDept !== 'all') {
            filtered = filtered.filter(job => job.dept === selectedDept);
        }
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [jobs, searchTerm, selectedDept]);

    const departments = ['all', ...new Set(jobs.map(job => job.dept))];

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            let resumeData = null;
            if (form.resume) {
                try {
                    resumeData = await uploadResume(form.resume, form.name);
                } catch (uploadError) {
                    setErrorMsg('Resume upload temporarily unavailable. Application submitted. You can email your resume to hr@sandhyasofttech.com');
                }
            }
            await submitJobApplication({
                name: form.name,
                email: form.email,
                phone: form.phone,
                position: form.position,
                coverLetter: form.coverLetter,
                resumeURL: resumeData?.downloadURL || null,
                resumePath: resumeData?.path || null,
            });
            setStatus('success');
            setForm({ name: '', email: '', phone: '', position: '', coverLetter: '', resume: null });
            if (fileRef.current) fileRef.current.value = '';
        } catch (err) {
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again.');
            console.error(err);
        }
    };

    const handleFutureSubmit = async (e) => {
        e.preventDefault();
        setFutureStatus('loading');
        setFutureErrorMsg('');
        try {
            let resumeData = null;
            if (futureForm.resume) {
                try {
                    resumeData = await uploadResume(futureForm.resume, futureForm.name);
                } catch {
                    setFutureErrorMsg('Resume upload failed. Your profile was still saved. Email your resume to hr@sandhyasofttech.com');
                }
            }
            await submitFutureApplication({
                name: futureForm.name,
                email: futureForm.email,
                phone: futureForm.phone,
                role: futureForm.role,
                message: futureForm.message,
                resumeURL: resumeData?.downloadURL || null,
                resumePath: resumeData?.path || null,
            });
            setFutureStatus('success');
            setFutureForm({ name: '', email: '', phone: '', role: '', message: '', resume: null });
            if (futureFileRef.current) futureFileRef.current.value = '';
        } catch (err) {
            setFutureStatus('error');
            setFutureErrorMsg('Something went wrong. Please try again.');
            console.error(err);
        }
    };

    const handleFutureChange = (e) => {
        const { name, value, files } = e.target;
        setFutureForm((p) => ({ ...p, [name]: files ? files[0] : value }));
    };

    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

    return (
        <div className="min-h-screen bg-[#0A0A0F] pt-24">
            <SEO title="Careers" description="Join our innovative team and build transformative solutions at Sandhya SoftTech." />
            {/* Hero Section */}
            <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden bg-[#0A0A0F] py-12">
                {/* Video Background - desktop only */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                >
                    <source src="/assets/hero.mp4" type="video/mp4" />
                </video>

                {/* Dark overlay with tech animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0A0A0F]/80 to-[rgba(255,107,0,0.1)] z-[1]" />

                {/* Animated tech particles */}
                <div className="absolute inset-0 z-[1]">
                    <div className="absolute top-10 left-10 w-1 h-20 bg-orange-500/20 animate-pulse" />
                    <div className="absolute top-20 right-20 w-1 h-16 bg-blue-500/20 animate-pulse delay-1000" />
                    <div className="absolute bottom-20 left-1/4 w-1 h-24 bg-purple-500/20 animate-pulse delay-500" />
                    <div className="absolute bottom-10 right-1/3 w-1 h-16 bg-green-500/20 animate-pulse delay-1500" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full mb-6 border border-orange-500/30 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-sm text-orange-400 font-medium">CAREERS AT SANDHYA SOFTTECH</span>
                        </div>

                        {/* Title */}
                        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                            Shape Your<br />
                            <span className="text-gradient">Career Future</span>
                            <br />
                            With Us
                        </h1>

                        {/* Description */}
                        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                            Join our innovative team and build transformative solutions.
                            Where your talent meets opportunity and your ambition becomes reality.
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-3 justify-center mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gray-300 hover:border-orange-500/40 hover:text-orange-400 transition-all">
                                <HiUserGroup className="text-base" />
                                <span>Team Collaboration</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gray-300 hover:border-orange-500/40 hover:text-orange-400 transition-all">
                                <HiAcademicCap className="text-base" />
                                <span>Career Growth</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gray-300 hover:border-orange-500/40 hover:text-orange-400 transition-all">
                                <HiHeart className="text-base" />
                                <span>Work-Life Balance</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gray-300 hover:border-orange-500/40 hover:text-orange-400 transition-all">
                                <HiGlobeAlt className="text-base" />
                                <span>Global Impact</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex justify-center">
                            <motion.button
                                onClick={() => openingsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                            >
                                Explore Opportunities
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                            Why Join <span className="text-gradient"> Sandhya SoftTech?</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-4">
                            Empowerment Through Innovation: As a technology-driven company, we provide a platform for you to
                            push boundaries and think outside the box.
                        </p>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                            Work That Makes a Difference: We're not just building software – we're changing the world.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="glass p-8 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                <div className="relative z-10 text-orange-500 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-400">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-white font-bold text-xl mb-3 relative z-10 group-hover:text-orange-400 transition-colors duration-300">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed relative z-10 text-sm group-hover:text-gray-300 transition-colors duration-300">
                                    {benefit.description}
                                </p>
                                <div className="absolute inset-0 rounded-xl bg-orange-500/5 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hiring Process */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent hidden lg:block" />
                <div className="container-custom relative z-10">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                            Our <span className="text-gradient">Hiring Process</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Four simple steps to joining our elite team of innovators and creators.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Application', desc: 'Browse openings and submit your resume directly.', icon: <HiMail className="w-6 h-6" /> },
                            { step: '02', title: 'Review', desc: 'Our HR team evaluates your skills and experience.', icon: <HiUserGroup className="w-6 h-6" /> },
                            { step: '03', title: 'Interview', desc: 'Technical and cultural assessment with our team.', icon: <HiSparkles className="w-6 h-6" /> },
                            { step: '04', title: 'Hired', desc: 'Receive an offer and start your journey with us.', icon: <HiCheckCircle className="w-6 h-6" /> }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="relative bg-white/[0.02] border border-white/5 p-8 rounded-2xl group hover:border-orange-500/30 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <span className="text-4xl font-display font-black text-white/5 absolute top-6 right-8 group-hover:text-orange-500/10 transition-colors">{item.step}</span>
                                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section ref={openingsRef} className="py-20 bg-dark-200/50">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-12">
                        <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                            Career <span className="text-gradient">Opportunities</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Sandhya SoftTech is looking for talented and enthusiastic team members. If you have passion for
                            challenge, technology and creativity, then come join us.
                        </p>
                    </motion.div>

                    {/* Search and Filters */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Search positions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-dark-300 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                className="px-4 py-3 bg-dark-300 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>
                                        {dept === 'all' ? 'All Departments' : dept}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Job Listings Grid */}
                    <div ref={ref} className="flex items-center justify-center min-h-[400px]">
                        {jobsLoading ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="glass rounded-2xl p-6 border border-orange-500/5 flex flex-col gap-4 animate-pulse">
                                        <div className="flex justify-between">
                                            <div className="w-12 h-12 bg-gray-700/50 rounded-xl" />
                                            <div className="w-20 h-6 bg-gray-700/50 rounded-full" />
                                        </div>
                                        <div className="w-3/4 h-5 bg-gray-700/50 rounded" />
                                        <div className="w-1/2 h-4 bg-gray-700/50 rounded" />
                                        <div className="w-full h-10 bg-gray-700/50 rounded mt-auto" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {filteredJobs.map((job, i) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: i * 0.08 }}
                                        className="glass rounded-2xl p-6 card-hover group border border-orange-500/5 hover:border-orange-500/25"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                                <HiBriefcase className="text-orange-500 text-xl" />
                                            </div>
                                            <span className="text-xs glass px-3 py-1 rounded-full text-orange-400 border border-orange-500/20">{job.type}</span>
                                        </div>
                                        <h3 className="font-display font-bold text-white text-base mb-2 group-hover:text-orange-400 transition-colors">{job.title}</h3>
                                        <p className="text-gray-500 text-xs mb-3">{job.dept}</p>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.description}</p>
                                        <div className="flex flex-col gap-1.5 mb-4">
                                            <p className="flex items-center gap-1.5 text-xs text-gray-400"><HiLocationMarker className="text-orange-500" />{job.location}</p>
                                            <p className="flex items-center gap-1.5 text-xs text-gray-400"><HiClock className="text-orange-500" />{job.exp} experience</p>
                                            <p className="flex items-center gap-1.5 text-xs text-gray-400">Posted: {job.posted}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {Array.isArray(job.skills) ? job.skills.map((s) => (
                                                <span key={s} className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">{s}</span>
                                            )) : job.skills ? job.skills.split(',').map((s) => (
                                                <span key={s.trim()} className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">{s.trim()}</span>
                                            )) : null}
                                        </div>
                                        <motion.button
                                            onClick={() => {
                                                setSelectedJob(job);
                                                setShowApplicationForm(true);
                                                setForm(prev => ({ ...prev, position: job.title }));
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                                        >
                                            Apply Now
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8 }}
                                className="w-full max-w-xl mx-auto text-center"
                            >
                                {/* No Openings Banner */}
                                <div className="rounded-2xl p-10 border border-white/8 bg-white/[0.02] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-5">
                                        <HiBriefcase className="text-orange-500 text-2xl" />
                                    </div>
                                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-2">Talent Pool</p>
                                    <h3 className="font-display font-bold text-white text-2xl mb-3">No Current Openings</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                                        We don't have any open positions matching your criteria at the moment.
                                        However, we're continuously growing and would love to hear from you.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* Application Form Modal */}
            {showApplicationForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowApplicationForm(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="glass rounded-2xl border border-orange-500/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="font-display font-bold text-white text-lg mb-2">Apply for Position</h2>
                                    {selectedJob && (
                                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                                <HiBriefcase className="text-orange-500 text-sm" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm leading-none mb-1">{selectedJob.title}</p>
                                                <p className="text-gray-500 text-[10px] uppercase tracking-wider">{selectedJob.dept} • {selectedJob.location}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowApplicationForm(false)}
                                    className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-6"
                                >
                                    <HiCheckCircle className="text-5xl text-orange-500 mx-auto mb-3" />
                                    <h3 className="font-display font-bold text-white text-lg mb-1">Application Received!</h3>
                                    <p className="text-gray-400 text-sm mb-5">Our team will reach out within 48 hours.</p>
                                    <button
                                        onClick={() => {
                                            setStatus('idle');
                                            setShowApplicationForm(false);
                                            setSelectedJob(null);
                                            setForm({ name: '', email: '', phone: '', position: '', coverLetter: '', resume: null });
                                        }}
                                        className="btn-primary py-2 px-8 text-sm"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Full Name *</label>
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your Name"
                                                className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:border-orange-500/50 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Email Address *</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:border-orange-500/50 focus:outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Phone Number</label>
                                            <input
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="+91 9999 999999"
                                                className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:border-orange-500/50 focus:outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Applying For *</label>
                                            <div className="relative">
                                                <select
                                                    name="position"
                                                    value={form.position || (selectedJob ? selectedJob.title : '')}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-xl text-white text-sm focus:border-orange-500/50 focus:outline-none transition-all appearance-none"
                                                >
                                                    <option value="" className="bg-dark-300">Select Position</option>
                                                    {jobs.map((j) => <option key={j.id} value={j.title} className="bg-dark-300">{j.title}</option>)}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Cover Letter</label>
                                        <textarea
                                            name="coverLetter"
                                            value={form.coverLetter}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Extremely brief intro..."
                                            className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:border-orange-500/50 focus:outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 ml-1">Resume / CV (PDF, DOC — max 5MB) *</label>
                                        <label className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 cursor-pointer hover:border-orange-500/40 transition-all border border-gray-700 hover:bg-orange-500/5 group">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                                <HiUpload className="text-orange-500 text-sm" />
                                            </div>
                                            <span className="text-gray-500 text-xs group-hover:text-gray-300 transition-colors truncate">
                                                {form.resume ? form.resume.name : 'Upload your resume'}
                                            </span>
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                name="resume"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleChange}
                                                required
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {errorMsg && <p className="text-red-400 text-[10px] font-medium ml-1">{errorMsg}</p>}
                                    <div className="flex gap-3 pt-2">
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowApplicationForm(false)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-6 py-2.5 border border-gray-700 text-gray-400 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-[2] btn-primary py-2.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                                        </motion.button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Always-visible Talent Pool Teaser */}
            {/* Always-visible Talent Pool Teaser */}
            <section ref={talentPoolRef} className="py-16 border-t border-white/5 bg-dark-200/20">
                <div className="container-custom max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-display font-bold text-white text-2xl md:text-3xl mb-4">
                            Don't See Your Role?
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
                            We're always looking for exceptional talent. If you don't find a position that fits your profile,{' '}
                            <span className="text-orange-400 font-medium">submit your resume</span> and we'll contact you when a suitable role opens up.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <motion.a
                                href="mailto:sandhyasofttechpvtltd@gmail.com"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-white/10 text-white font-bold text-base transition-all backdrop-blur-sm shadow-xl"
                            >
                                <HiMail className="text-orange-500 text-xl" />
                                sandhyasofttechpvtltd@gmail.com
                            </motion.a>

                            <motion.button
                                onClick={() => { setFutureStatus('idle'); setShowTalentPoolModal(true); }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-[0_4px_24px_rgba(255,107,0,0.25)] hover:shadow-[0_4px_32px_rgba(255,107,0,0.4)]"
                            >
                                Submit Your Resume
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Talent Pool Modal */}
            {showTalentPoolModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setShowTalentPoolModal(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-2xl my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="rounded-2xl border border-white/10 bg-[#111114] overflow-hidden">
                            {/* Top accent line */}
                            <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

                            {/* Modal Header */}
                            <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-display font-bold text-white text-lg mb-0.5">Submit Your Resume</h2>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        Join our talent network and we'll reach out when a suitable opportunity matching your skills arises.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowTalentPoolModal(false)}
                                    className="text-gray-500 hover:text-white transition-colors mt-0.5 flex-shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Form Body */}
                            <div className="p-6">
                                <FutureApplicationForm
                                    form={futureForm}
                                    onChange={handleFutureChange}
                                    onSubmit={handleFutureSubmit}
                                    status={futureStatus}
                                    errorMsg={futureErrorMsg}
                                    fileRef={futureFileRef}
                                    jobs={jobs}
                                    onReset={() => setFutureStatus('idle')}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

        </div>
    );
};

export default Careers;
