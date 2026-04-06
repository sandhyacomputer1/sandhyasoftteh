import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiPencil, HiCheckCircle, HiX, HiLocationMarker, HiUserGroup, HiExternalLink, HiStatusOnline, HiCloudUpload } from 'react-icons/hi';
import { getFranchises, addFranchise, updateFranchise, deleteFranchise, toggleFranchiseStatus } from '../../firebase/firestore';
import { uploadAdminFile } from '../../firebase/storage';
import AdminLayout from '../../components/admin/AdminLayout';

const FranchiseManager = () => {
    const [franchises, setFranchises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingFranchise, setEditingFranchise] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedBrochure, setSelectedBrochure] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        location: '',
        image: '',
        brochure: '',
        mapLink: '',
        description: '',
        established: '',
        teamSize: '',
        services: [''],
        status: 'active'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const list = await getFranchises();
            setFranchises(list);
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
        setUploading(true);
        try {
            let finalForm = { ...form };

            // Upload Image if selected
            if (selectedImage) {
                const { downloadURL } = await uploadAdminFile(selectedImage, 'franchises', form.name || 'new', 'cover');
                finalForm.image = downloadURL;
            }

            // Upload Brochure if selected
            if (selectedBrochure) {
                const { downloadURL } = await uploadAdminFile(selectedBrochure, 'franchises', form.name || 'new', 'brochure');
                finalForm.brochure = downloadURL;
            }

            if (editingFranchise) {
                await updateFranchise(editingFranchise.id, finalForm);
            } else {
                await addFranchise(finalForm);
            }

            setForm({
                name: '', location: '', image: '', brochure: '', mapLink: '',
                description: '', established: '', teamSize: '', services: [''], status: 'active'
            });
            setSelectedImage(null);
            setSelectedBrochure(null);
            setShowForm(false);
            setEditingFranchise(null);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert('Upload/Save Error: ' + err.message);
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const handleEdit = (fran) => {
        setEditingFranchise(fran);
        setForm({
            name: fran.name || '',
            location: fran.location || '',
            image: fran.image || '',
            brochure: fran.brochure || '',
            mapLink: fran.mapLink || '',
            description: fran.description || '',
            established: fran.established || '',
            teamSize: fran.teamSize || '',
            services: Array.isArray(fran.services) ? fran.services : [''],
            status: fran.status || 'active'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this franchise?')) {
            await deleteFranchise(id);
            fetchData();
        }
    };

    const handleToggleStatus = async (fran) => {
        try {
            await toggleFranchiseStatus(fran.id, fran.status);
            await fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout title="Franchise Net" fetchData={fetchData}>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl">
                            <HiUserGroup />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-tight">Active Franchises</h2>
                            <p className="text-gray-500 text-xs">Expanding the Sandhya SoftTech network</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowForm(true); setEditingFranchise(null); }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                        <HiPlus className="text-lg" />
                        <span>Add New Location</span>
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
                            <form onSubmit={handleSubmit} className="p-7 space-y-7">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1 leading-none">Location Details</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Franchise Name</label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    placeholder="Franchise Name"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">City / Region</label>
                                                <input
                                                    type="text"
                                                    value={form.location}
                                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                                    placeholder="City / Region"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">G-Maps Integration</label>
                                                <input
                                                    type="text"
                                                    value={form.mapLink}
                                                    onChange={(e) => setForm({ ...form, mapLink: e.target.value })}
                                                    placeholder="Google Maps URL"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-[10px] outline-none focus:border-orange-500 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1 leading-none">Operational Stats</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Est. Year</label>
                                                <input
                                                    type="text"
                                                    value={form.established}
                                                    onChange={(e) => setForm({ ...form, established: e.target.value })}
                                                    placeholder="Established Since (e.g., 2025)"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Team Size</label>
                                                <input
                                                    type="text"
                                                    value={form.teamSize}
                                                    onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                                                    placeholder="Team Size (e.g., 10+)"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Verticals / Services</label>
                                                <div className="space-y-2">
                                                    {form.services.map((s, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <input 
                                                                value={s}
                                                                onChange={(e) => {
                                                                    const n = [...form.services]; n[i] = e.target.value; setForm({...form, services: n});
                                                                }}
                                                                className="flex-1 bg-white/5 border border-white/10 p-2 text-[10px] rounded-lg text-white font-medium"
                                                                placeholder="Service Name"
                                                            />
                                                            <button type="button" onClick={() => setForm({...form, services: form.services.filter((_, idx) => idx !== i)})} className="p-2 text-red-500 bg-red-500/5 rounded-lg border border-red-500/10 hover:bg-red-500/20 transition-all"><HiX/></button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => setForm({...form, services: [...form.services, '']})} className="text-[9px] font-black text-orange-500 hover:text-orange-400 uppercase tracking-widest px-1">+ Add Vertical</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1 leading-none">Assets & Bio</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Cover Image (Local File)</label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setSelectedImage(e.target.files[0])}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="w-full bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3 group-hover:border-orange-500/30 transition-all">
                                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                                            <HiCloudUpload className="text-lg" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] text-white font-bold truncate">
                                                                {selectedImage ? selectedImage.name : 'Select Cover Image'}
                                                            </p>
                                                            <p className="text-[8px] text-gray-500 uppercase font-black">Max 5MB • JPG/PNG</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {form.image && !selectedImage && (
                                                    <p className="text-[8px] text-orange-500/60 mt-1 px-1 italic truncate">Current: {form.image}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Brochure/PDF (Local File)</label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => setSelectedBrochure(e.target.files[0])}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="w-full bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-3 group-hover:border-orange-500/30 transition-all">
                                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                                            <HiCloudUpload className="text-lg" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] text-white font-bold truncate">
                                                                {selectedBrochure ? selectedBrochure.name : 'Select PDF Catalog'}
                                                            </p>
                                                            <p className="text-[8px] text-gray-500 uppercase font-black">Max 10MB • PDF Only</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {form.brochure && !selectedBrochure && (
                                                    <p className="text-[8px] text-orange-500/60 mt-1 px-1 italic truncate">Current: {form.brochure}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Market Narrative</label>
                                                <textarea
                                                    value={form.description}
                                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                    rows={4}
                                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-[11px] outline-none focus:border-orange-500 transition-all font-medium leading-relaxed custom-scrollbar"
                                                    placeholder="Provide a detailed technical and market overview of this franchise location..."
                                                />
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
                                                <span>Uploading Assets...</span>
                                            </>
                                        ) : (
                                            <span>{editingFranchise ? 'Update Network Node' : 'Initialize New Franchise'}</span>
                                        )}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-white/5 text-gray-400 font-bold text-[10px] rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">Abort Action</button>
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
                                {['Location Info', 'Timeline', 'Team', 'Availability', 'Actions'].map(h => (
                                    <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {franchises.map((fran, i) => (
                                <tr key={fran.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex-shrink-0 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform overflow-hidden">
                                                {fran.image ? <img src={fran.image} className="w-full h-full object-cover" /> : <HiLocationMarker className="text-orange-500 text-2xl"/>}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{fran.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{fran.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 text-xs font-bold font-display uppercase tracking-widest">Since {fran.established || '2025'}</td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">{fran.teamSize || '10+'} Members</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button 
                                            onClick={() => handleToggleStatus(fran)}
                                            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${fran.status === 'active' ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            <HiStatusOnline /> {fran.status || 'Active'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(fran)} className="p-2.5 glass rounded-xl text-gray-400 hover:text-orange-500 transition-all border border-white/5 hover:border-orange-500/30"><HiPencil/></button>
                                            <button onClick={() => handleDelete(fran.id)} className="p-2.5 glass rounded-xl text-gray-400 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/30"><HiTrash/></button>
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

export default FranchiseManager;
