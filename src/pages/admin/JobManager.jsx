import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiPencil, HiBriefcase, HiX, HiOfficeBuilding, HiLocationMarker, HiLightningBolt } from 'react-icons/hi';
import { getJobs, addJob, updateJob, deleteJob } from '../../firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';

const JobManager = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [form, setForm] = useState({
        title: '',
        dept: '',
        type: 'Full-Time',
        location: '',
        exp: '',
        skills: '',
        description: '',
        posted: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const list = await getJobs();
            setJobs(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingJob) {
                await updateJob(editingJob.id, form);
            } else {
                await addJob(form);
            }
            setForm({
                title: '', dept: '', type: 'Full-Time', location: '', exp: '', skills: '', description: '',
                posted: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
            setEditingJob(null);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setForm({
            title: job.title || '',
            dept: job.dept || '',
            type: job.type || 'Full-Time',
            location: job.location || '',
            exp: job.exp || '',
            skills: job.skills || '',
            description: job.description || '',
            posted: job.posted || new Date().toISOString().split('T')[0]
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this job posting?')) {
            await deleteJob(id);
            fetchData();
        }
    };

    return (
        <AdminLayout title="Career Opportunities" fetchData={fetchData}>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl">
                            <HiBriefcase />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-tight">Active Recruitment</h2>
                            <p className="text-gray-500 text-xs">Manage current job openings</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowForm(true); setEditingJob(null); }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                        <HiPlus className="text-lg" />
                        <span>Post New Role</span>
                    </motion.button>
                </div>

                {/* Form Module */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-dark rounded-3xl border border-orange-500/10 overflow-hidden mb-10"
                        >
                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Role & Department</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Job Designation</label>
                                                <input
                                                    type="text"
                                                    value={form.title}
                                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                    placeholder="Job Title (e.g., Full Stack Dev)"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Dept.</label>
                                                <select
                                                    value={form.dept}
                                                    onChange={(e) => setForm({ ...form, dept: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-bold uppercase tracking-wider"
                                                    required
                                                >
                                                    {['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'HR'].map(d => <option key={d} value={d} className="bg-dark-300">{d}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Logistics & Tenure</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Role Type</label>
                                                <select
                                                    value={form.type}
                                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-bold uppercase tracking-wider"
                                                    required
                                                >
                                                    {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map(t => <option key={t} value={t} className="bg-dark-300">{t}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Work Location</label>
                                                <input
                                                    type="text"
                                                    value={form.location}
                                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                                    placeholder="Location (e.g., Remote / Office)"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Exp. Level</label>
                                                <input
                                                    type="text"
                                                    value={form.exp}
                                                    onChange={(e) => setForm({ ...form, exp: e.target.value })}
                                                    placeholder="Experience (e.g., 2-4 years)"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Skills & Date</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Tech Stack</label>
                                                <input
                                                    type="text"
                                                    value={form.skills}
                                                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                                    placeholder="Key Skills (comma separated)"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Post Date</label>
                                                <input
                                                    type="date"
                                                    value={form.posted}
                                                    onChange={(e) => setForm({ ...form, posted: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all uppercase font-black"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Detailed Job Description</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 p-3.5 rounded-2xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium leading-relaxed"
                                        placeholder="Detailed role requirements..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-white/5">
                                    <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all">
                                        {editingJob ? 'Update Job Posting' : 'Publish Opportunity'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-white/5 text-gray-400 font-bold text-[10px] rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">Discard</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Data Table */}
                <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                {['Job Title', 'Department', 'Logistics', 'Posted On', 'Actions'].map(h => (
                                    <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {jobs.map((job, i) => (
                                <tr key={job.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex-shrink-0 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
                                                <HiBriefcase className="text-orange-500 text-xl"/>
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{job.title}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{job.exp} Exp</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-white/5 text-gray-300 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 w-fit">
                                            <HiOfficeBuilding className="text-orange-500"/> {job.dept || 'Engineering'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white text-xs font-bold flex items-center gap-1.5"><HiLocationMarker className="text-orange-500"/> {job.location}</span>
                                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{job.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">{job.posted}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(job)} className="p-2.5 glass rounded-xl text-gray-400 hover:text-orange-500 transition-all border border-white/5 hover:border-orange-500/30"><HiPencil/></button>
                                            <button onClick={() => handleDelete(job.id)} className="p-2.5 glass rounded-xl text-gray-400 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/30"><HiTrash/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default JobManager;
