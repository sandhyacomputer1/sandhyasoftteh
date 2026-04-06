import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getContactMessages, getJobApplications, getJobs, getProjects, getTestimonials, getFranchises } from '../../firebase/firestore';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardOverview from './DashboardOverview';
import Loader from '../../components/layout/Loader';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [data, setData] = useState({
        messages: [],
        applications: [],
        jobs: [],
        projects: [],
        testimonials: [],
        franchises: []
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [msgs, apps, jobList, projList, testimonialList, franchiseList] = await Promise.all([
                getContactMessages(),
                getJobApplications(),
                getJobs(),
                getProjects(),
                getTestimonials(),
                getFranchises()
            ]);
            setData({
                messages: msgs,
                applications: apps,
                jobs: jobList,
                projects: projList,
                testimonials: testimonialList,
                franchises: franchiseList
            });
        } catch (err) {
            console.error('Master data fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <Loader />;

    return (
        <AdminLayout title="System Overview" fetchData={fetchData}>
            <DashboardOverview data={data} />
        </AdminLayout>
    );
};

export default AdminDashboard;
