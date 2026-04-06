import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiPencil, HiStar, HiX, HiCheckCircle, HiStatusOnline, HiUserCircle, HiCloudUpload } from 'react-icons/hi';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialStatus } from '../../firebase/firestore';
import { uploadAdminFile } from '../../firebase/storage';
import AdminLayout from '../../components/admin/AdminLayout';

const TestimonialManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        position: '',
        rating: 5,
        testimonial: '',
        image: '',
        status: 'active'
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const list = await getTestimonials();
            setTestimonials(list);
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
            
            if (selectedFile) {
                const { downloadURL } = await uploadAdminFile(selectedFile, 'testimonials', form.name || 'anonymous', 'avatar');
                finalForm.image = downloadURL;
            }

            if (editingTestimonial) {
                await updateTestimonial(editingTestimonial.id, finalForm);
            } else {
                await addTestimonial(finalForm);
            }
            setForm({ name: '', position: '', rating: 5, testimonial: '', image: '', status: 'active' });
            setSelectedFile(null);
            setShowForm(false);
            setEditingTestimonial(null);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert('Upload/Save Error: ' + err.message);
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const handleEdit = (testi) => {
        setEditingTestimonial(testi);
        setForm({
            name: testi.name || '',
            position: testi.position || '',
            rating: testi.rating || 5,
            testimonial: testi.testimonial || '',
            status: testi.status || 'active'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this testimonial?')) {
            await deleteTestimonial(id);
            fetchData();
        }
    };

    const handleToggleStatus = async (testi) => {
        try {
            await toggleTestimonialStatus(testi.id, testi.status);
            await fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout title="Social Proof" fetchData={fetchData}>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl">
                            <HiStar />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-tight">Client Feedback</h2>
                            <p className="text-gray-500 text-xs">Manage public success stories</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setShowForm(true); setEditingTestimonial(null); }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
                    >
                        <HiPlus className="text-lg" />
                        <span>Add Success Story</span>
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
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1 leading-none">Customer Profile</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Client Name</label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    placeholder="Client Name"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-bold"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Company & Title</label>
                                                <input
                                                    type="text"
                                                    value={form.position}
                                                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                                                    placeholder="Company & Position"
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1 leading-none">Engagement Metrics</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Satisfaction Rating</label>
                                                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                                    <div className="flex gap-1.5">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <button 
                                                                key={star} 
                                                                type="button" 
                                                                onClick={() => setForm({...form, rating: star})}
                                                                className={`text-base transition-colors ${star <= form.rating ? 'text-amber-500 scale-110' : 'text-gray-700'}`}
                                                            >
                                                                <HiStar />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-amber-500 font-black">{form.rating}.0</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Visibility Status</label>
                                                <select
                                                    value={form.status}
                                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white text-xs outline-none focus:border-orange-500 font-black tracking-widest uppercase"
                                                >
                                                    <option value="active" className="bg-dark-300">PUBLIC DISPLAY</option>
                                                    <option value="inactive" className="bg-dark-300">ARCHIVED</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest px-1 leading-none">Statement</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Customer Photo</label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-3 group-hover:border-orange-500/30 transition-all">
                                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                                            <HiCloudUpload className="text-base" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] text-white font-bold truncate">
                                                                {selectedFile ? selectedFile.name : 'Select Avatar'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] uppercase font-bold text-gray-500 mb-1.5 block tracking-widest px-1">Client Feedback Phrase</label>
                                                <textarea
                                                    value={form.testimonial}
                                                    onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                                                    rows={2}
                                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-medium leading-relaxed italic"
                                                    placeholder="What the client said..."
                                                    required
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
                                                <span>Publishing Feedback...</span>
                                            </>
                                        ) : (
                                            <span>{editingTestimonial ? 'Update Success Story' : 'Authorize Publication'}</span>
                                        )}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-white/5 text-gray-400 font-bold text-[10px] rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest">Abort Action</button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testi, i) => (
                        <motion.div
                            key={testi.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-dark rounded-3xl border border-white/5 p-6 flex flex-col justify-between group hover:border-orange-500/20 transition-all"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-600 text-2xl group-hover:scale-110 group-hover:text-amber-500 transition-all">
                                        <HiUserCircle />
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, idx) => (
                                            <HiStar key={idx} className={`text-sm ${idx < testi.rating ? 'text-amber-500' : 'text-gray-800'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs italic font-medium leading-relaxed mb-6">"{testi.testimonial}"</p>
                            </div>
                            
                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{testi.name}</h4>
                                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{testi.position}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <button 
                                        onClick={() => handleToggleStatus(testi)}
                                        className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors ${testi.status === 'active' ? 'text-green-500' : 'text-gray-600'}`}
                                    >
                                        <HiStatusOnline /> {testi.status || 'Active'}
                                    </button>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(testi)} className="p-2 glass rounded-xl text-gray-500 hover:text-orange-500 transition-all border border-white/5"><HiPencil/></button>
                                        <button onClick={() => handleDelete(testi.id)} className="p-2 glass rounded-xl text-gray-500 hover:text-red-500 transition-all border border-white/5"><HiTrash/></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {testimonials.length === 0 && <div className="col-span-full py-20 text-center text-gray-600 font-medium">No testimonials yet. Grow your authority by adding feedback!</div>}
                </div>
            </div>
        </AdminLayout>
    );
};

export default TestimonialManager;
