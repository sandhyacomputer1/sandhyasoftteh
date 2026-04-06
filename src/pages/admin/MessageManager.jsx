import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiTrash, HiCheckCircle, HiCalendar, HiUser, HiPhone, HiChevronRight, HiEye } from 'react-icons/hi';
import { getContactMessages } from '../../firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';

const MessageManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const list = await getContactMessages();
            setMessages(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const formatDate = (ts) => {
        if (!ts) return '–';
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString('en-IN', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Communications" fetchData={fetchData}>
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Messages List */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl shadow-inner">
                                <HiMail />
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-bold text-white tracking-tight">Contact Inbox</h2>
                                <p className="text-gray-500 text-xs">Manage client inquiries and feedback</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {messages.length === 0 ? (
                            <div className="glass-dark rounded-3xl p-12 text-center border border-white/5">
                                <HiMail className="text-5xl text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">No messages in your inbox.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <motion.div 
                                    key={msg.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => setSelectedMessage(msg)}
                                    className={`glass-dark rounded-2xl p-5 border cursor-pointer transition-all duration-300 group ${
                                        selectedMessage?.id === msg.id 
                                        ? 'border-orange-500/40 bg-orange-500/5 shadow-lg shadow-orange-500/5' 
                                        : 'border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                                <HiUser className="text-gray-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-white font-bold text-sm truncate">{msg.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">{msg.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[10px] text-gray-500 font-medium mb-1">{formatDate(msg.createdAt)}</p>
                                            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[8px] font-black rounded uppercase tracking-[.15em]">New</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <p className="text-gray-400 text-[11px] line-clamp-2 leading-relaxed">
                                            {msg.message || msg.msg || 'No message content provided.'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail View */}
                <div className="w-full xl:w-[450px]">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                key={selectedMessage.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-dark rounded-3xl border border-orange-500/20 p-8 h-fit sticky top-28 shadow-2xl shadow-orange-500/10"
                            >
                                <div className="flex flex-col items-center text-center mb-10">
                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl shadow-orange-500/20 mb-4">
                                        <HiUser />
                                    </div>
                                    <h3 className="text-2xl font-display font-black text-white tracking-tight uppercase">{selectedMessage.name}</h3>
                                    <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mt-1">Direct Inquiry</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 leading-none">
                                                <HiMail className="text-orange-500" /> Email
                                            </p>
                                            <p className="text-white text-[11px] font-medium truncate">{selectedMessage.email}</p>
                                        </div>

                                        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 leading-none">
                                                <HiPhone className="text-orange-500" /> Phone
                                            </p>
                                            <p className="text-white text-[11px] font-medium">{selectedMessage.phone || '–'}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 relative group">
                                        <div className="absolute -top-2 left-4 px-2 bg-orange-500/10 border border-orange-500/20 rounded-md">
                                            <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest leading-loose">Inquiry Content</p>
                                        </div>
                                        <div className="text-gray-300 text-[11px] leading-relaxed max-h-[250px] overflow-auto custom-scrollbar italic font-medium pt-2">
                                            "{selectedMessage.message || selectedMessage.msg}"
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                                                className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all"
                                            >
                                                Send Response
                                            </button>
                                            <button className="p-3 glass rounded-xl text-red-500 border border-red-500/5 hover:bg-red-500/10 transition-all">
                                                <HiTrash className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[400px] glass-dark rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-700 text-3xl mb-6">
                                    <HiEye />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-2">Message Preview</h4>
                                <p className="text-gray-500 text-sm max-w-[240px]">Select a communication entry from the list to view full details and reply options.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AdminLayout>
    );
};

export default MessageManager;
