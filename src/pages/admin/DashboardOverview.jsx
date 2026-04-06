import { motion } from 'framer-motion';
import { HiMail, HiBriefcase, HiChip, HiStar, HiUsers, HiTrendingUp, HiExternalLink, HiChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const DashboardOverview = ({ data }) => {
    const { messages, applications, jobs, projects, testimonials, franchises } = data;

    const stats = [
        { label: 'Unread Messages', value: messages.length, icon: <HiMail />, color: 'from-orange-500 to-orange-600', link: '/admin/messages' },
        { label: 'New Applications', value: applications.length, icon: <HiUsers />, color: 'from-blue-500 to-blue-600', link: '/admin/applications' },
        { label: 'Live Careers', value: jobs.length, icon: <HiBriefcase />, color: 'from-purple-500 to-purple-600', link: '/admin/jobs' },
        { label: 'Portfolio Projects', value: projects.length, icon: <HiChip />, color: 'from-emerald-500 to-emerald-600', link: '/admin/projects' },
        { label: 'Active Franchises', value: franchises.length, icon: <HiUsers />, color: 'from-rose-500 to-rose-600', link: '/admin/franchises' },
        { label: 'Testimonials', value: testimonials.length, icon: <HiStar />, color: 'from-amber-500 to-amber-600', link: '/admin/testimonials' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 shadow-2xl shadow-orange-500/20"
            >
                <div className="relative z-10">
                    <h2 className="font-display font-black text-white text-3xl mb-2 tracking-tight">Welcome Back, Admin!</h2>
                    <p className="text-orange-100/80 text-sm max-w-lg mb-6 leading-relaxed">
                        Your portal is up to date. You have {messages.length} new messages and {applications.length} pending job applications requiring your attention.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 font-bold text-xs rounded-xl hover:bg-orange-50 transition-all shadow-lg">
                            <HiExternalLink /> View Website
                        </Link>
                    </div>
                </div>
                {/* Decorative Element */}
                <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="glass-dark rounded-xl p-4 border border-white/5 hover:border-orange-500/20 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white text-base shadow-lg group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center gap-1 text-[8px] text-green-500 font-black uppercase tracking-wider">
                                <HiTrendingUp />
                            </div>
                        </div>
                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-0.5">{stat.label}</p>
                        <h3 className="text-xl font-display font-black text-white">{stat.value}</h3>
                        
                        <Link to={stat.link} className="mt-3 flex items-center justify-between text-[9px] text-orange-500 font-black uppercase tracking-widest hover:text-orange-400 group/link">
                            <span>Manage</span>
                            <HiChevronRight className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Insights Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
                <div className="glass-dark rounded-3xl p-8 border border-white/5">
                    <h4 className="font-display font-bold text-white text-lg mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                        System Health
                    </h4>
                    <div className="space-y-6">
                        {[
                            { label: 'Database Sync', status: 'Optimal', val: 98, color: 'bg-green-500' },
                            { label: 'Storage Capacity', status: 'Healthy', val: 42, color: 'bg-blue-500' },
                            { label: 'API Response', status: 'Excellent', val: 92, color: 'bg-orange-500' },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-400 font-medium">{item.label}</span>
                                    <span className="text-white font-bold">{item.status}</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.val}%` }}
                                        className={`h-full ${item.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-dark rounded-3xl p-8 border border-white/5 flex flex-col justify-center text-center">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 text-3xl mx-auto mb-4">
                        <HiChip />
                    </div>
                    <h4 className="font-display font-bold text-white text-lg mb-2">Technical Automation</h4>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                        Your dashboard is powered by high-performance cloud functions and real-time syncing.
                    </p>
                    <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest">
                        Run Optimization
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
