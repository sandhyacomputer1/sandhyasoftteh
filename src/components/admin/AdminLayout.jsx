import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiBriefcase, HiChip, HiStar, HiUsers, HiLogout, HiViewGrid, HiRefresh, HiChevronRight, HiBell } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title, fetchData }) => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Redirect to main website
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Overview', icon: <HiViewGrid /> },
        { path: '/admin/messages', label: 'Messages', icon: <HiMail /> },
        { path: '/admin/applications', label: 'Applications', icon: <HiUsers /> },
        { path: '/admin/jobs', label: 'Manage Jobs', icon: <HiBriefcase /> },
        { path: '/admin/projects', label: 'Manage Projects', icon: <HiChip /> },
        { path: '/admin/testimonials', label: 'Testimonials', icon: <HiStar /> },
        { path: '/admin/franchises', label: 'Franchises', icon: <HiUsers /> },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="w-full lg:w-60 bg-[#111118] border-r border-orange-500/10 flex flex-col z-50 lg:sticky lg:top-0 lg:h-screen">
                {/* Logo Section */}
                <div className="p-5 border-b border-orange-500/10">
                    <Link to="/admin/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-lg font-display">S</span>
                        </div>
                        <div>
                            <p className="font-display font-bold text-white tracking-tight text-sm">Sandhya Admin</p>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest">Portal v2.0</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar hide-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_20px_rgba(255,107,0,0.05)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium text-xs tracking-wide">{item.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div layoutId="activeDot">
                                        <HiChevronRight className="text-orange-500 text-sm" />
                                    </motion.div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 mt-auto border-t border-orange-500/10 bg-[#0c0c11]">
                    <div className="flex items-center gap-2.5 mb-4 px-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${currentUser?.email}&background=FF6B00&color=fff`} alt="Avatar" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-white truncate leading-none mb-1">{currentUser?.email}</p>
                            <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">System Admin</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:border-red-500/30"
                    >
                        <HiLogout className="text-sm" />
                        <span>Logout Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0F]">
                {/* Header Section */}
                <header className="h-14 bg-[#111118]/80 backdrop-blur-xl border-b border-orange-500/10 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <h1 className="font-display font-bold text-white text-sm tracking-widest uppercase">
                            {title || 'Dashboard Overview'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchData}
                            className="p-2 glass-dark rounded-lg text-gray-400 hover:text-orange-500 transition-all border border-white/5 hover:border-orange-500/30"
                            title="Refresh Database"
                        >
                            <HiRefresh className="text-base" />
                        </button>
                        <div className="h-6 w-px bg-white/10 mx-1" />
                        <button className="relative p-2 glass-dark rounded-lg text-gray-400 hover:text-orange-500 transition-all border border-white/5">
                            <HiBell className="text-base" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto custom-scrollbar p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
