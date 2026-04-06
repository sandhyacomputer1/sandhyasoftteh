import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiPencil, HiChip, HiCloudUpload, HiCheckCircle, HiX } from 'react-icons/hi';
import { getProjects, addProject, updateProject, deleteProject } from '../../firebase/firestore';
import { uploadAdminFile } from '../../firebase/storage';
import AdminLayout from '../../components/admin/AdminLayout';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        category: 'Web App',
        description: '',
        keyFeatures: [''],
        logo: null,
        slider: [],
        sliderPreviews: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const list = await getProjects();
            setProjects(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let logoURL = editingProject?.logoURL || '';
            let sliderImages = editingProject?.sliderImages || [];

            const projectData = {
                title: form.title,
                category: form.category,
                description: form.description,
                keyFeatures: form.keyFeatures.filter(f => f.trim()),
                logoURL,
                sliderImages
            };

            let projectId;
            if (editingProject) {
                projectId = editingProject.id;
                await updateProject(projectId, projectData);
            } else {
                const docRef = await addProject(projectData);
                projectId = docRef.id;
            }

            // Upload logo if selected
            if (form.logo) {
                const { downloadURL } = await uploadAdminFile(form.logo, 'projects', form.title, 'logo');
                logoURL = downloadURL;
                await updateProject(projectId, { logoURL });
            }

            // Upload gallery images if selected
            if (form.slider.length > 0) {
                const uploadPromises = Array.from(form.slider).map(file =>
                    uploadAdminFile(file, 'projects', form.title, 'slider')
                );
                const results = await Promise.all(uploadPromises);
                const newSliderURLs = results.map(r => r.downloadURL);
                sliderImages = [...sliderImages, ...newSliderURLs];
                await updateProject(projectId, { sliderImages });
            }

            setForm({
                title: '', category: 'Web App',
                description: '', keyFeatures: [''],
                logo: null, slider: [], sliderPreviews: []
            });
            setShowForm(false);
            setEditingProject(null);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const handleEdit = (proj) => {
        setEditingProject(proj);
        setForm({
            title: proj.title || '',
            category: proj.category || 'Web App',
            description: proj.description || '',
            keyFeatures: Array.isArray(proj.keyFeatures) ? proj.keyFeatures : [''],
            logo: null,
            slider: [],
            sliderPreviews: []
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            await deleteProject(id);
            fetchData();
        }
    };

    return (
        <AdminLayout title="Portfolio Projects" fetchData={fetchData}>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl">
                            <HiChip />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-tight">Manage Portfolio</h2>
                            <p className="text-gray-500 text-xs">Showcase your best tech work</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowForm(true); setEditingProject(null); }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                        <HiPlus className="text-lg" />
                        <span>Add New Project</span>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Identity & Industry</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Project Title</label>
                                                <input
                                                    type="text"
                                                    value={form.title}
                                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                    placeholder="E-commerce Architecture"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs focus:border-orange-500 transition-all outline-none font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Sector / Category</label>
                                                <select
                                                    value={form.category}
                                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 font-bold uppercase tracking-wider"
                                                >
                                                    {['Web App', 'Mobile', 'SaaS', 'Fintech', 'Healthcare'].map(c => <option key={c} value={c} className="bg-dark-300">{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1">Tech & Feature Stack</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Key Components (Manage)</label>
                                                <div className="space-y-2">
                                                    {form.keyFeatures.map((f, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <input 
                                                                value={f}
                                                                onChange={(e) => {
                                                                    const n = [...form.keyFeatures]; n[i] = e.target.value; setForm({...form, keyFeatures: n});
                                                                }}
                                                                className="flex-1 bg-white/5 border border-white/10 p-2 text-[10px] rounded-lg text-white font-medium"
                                                                placeholder="Component Name"
                                                            />
                                                            <button type="button" onClick={() => setForm({...form, keyFeatures: form.keyFeatures.filter((_, idx) => idx !== i)})} className="p-2 text-red-500 bg-red-500/5 rounded-lg border border-red-500/10 hover:bg-red-500/20 transition-all"><HiX/></button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => setForm({...form, keyFeatures: [...form.keyFeatures, '']})} className="text-[9px] font-black text-orange-500 hover:text-orange-400 uppercase tracking-widest px-1 transition-colors">+ Add Component</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Detailed Technical Breakdown</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium leading-relaxed"
                                        placeholder="Explain the scope and achievements..."
                                        required
                                    />
                                </div>

                                {/* Image Assets */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-4">
                                        <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Brand Identity (Logo)</label>
                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                onChange={(e) => setForm({...form, logo: e.target.files[0]})} 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                accept="image/*" 
                                            />
                                            <div className="w-full bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3 group-hover:border-orange-500/30 transition-all">
                                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                                    <HiCloudUpload className="text-lg" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-white font-bold truncate">
                                                        {form.logo ? form.logo.name : 'Select Project Logo'}
                                                    </p>
                                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">SVG / PNG Preferred</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Visual Gallery (Screenshots)</label>
                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                multiple 
                                                onChange={(e) => setForm({...form, slider: [...form.slider, ...e.target.files]})} 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                accept="image/*" 
                                            />
                                            <div className="w-full bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3 group-hover:border-orange-500/30 transition-all">
                                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                                    <HiCloudUpload className="text-lg" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-white font-bold truncate">
                                                        {form.slider.length > 0 ? `${form.slider.length} Assets Staged` : 'Select Showcase Images'}
                                                    </p>
                                                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Multi-Select Enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-white/5">
                                    <button 
                                        type="submit" 
                                        disabled={uploading}
                                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Deploying Assets...</span>
                                            </>
                                        ) : (
                                            <span>{editingProject ? 'Commit Project Changes' : 'Initialize Technical Project'}</span>
                                        )}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-white/5 text-gray-400 font-bold text-[10px] rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">Discard Entry</button>
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
                                {['Work Info', 'Category', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {projects.map((proj, i) => (
                                <tr key={proj.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                                                {proj.logoURL ? <img src={proj.logoURL} className="w-full h-full object-contain" /> : <HiChip className="text-orange-500 text-2xl"/>}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm line-clamp-1">{proj.title}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">ID: {proj.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">{proj.category}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                                            <HiCheckCircle /> Published
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(proj)} className="p-2.5 glass rounded-xl text-gray-400 hover:text-orange-500 transition-all border border-white/5 hover:border-orange-500/30"><HiPencil/></button>
                                            <button onClick={() => handleDelete(proj.id)} className="p-2.5 glass rounded-xl text-gray-400 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/30"><HiTrash/></button>
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

export default ProjectManager;
