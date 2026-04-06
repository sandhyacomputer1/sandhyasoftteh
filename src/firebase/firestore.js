import { collection, addDoc, getDocs, serverTimestamp, orderBy, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export const submitContactForm = async (data) => {
    return await addDoc(collection(db, 'contactMessages'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'unread',
    });
};

export const submitJobApplication = async (data) => {
    return await addDoc(collection(db, 'jobApplications'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'pending',
    });
};

export const getContactMessages = async () => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getJobApplications = async () => {
    const q = query(collection(db, 'jobApplications'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addJob = async (jobData) => {
    return await addDoc(collection(db, 'jobs'), {
        ...jobData,
        createdAt: serverTimestamp(),
    });
};

export const updateJob = async (jobId, jobData) => {
    const jobRef = doc(db, 'jobs', jobId);
    return await updateDoc(jobRef, jobData);
};

export const deleteJob = async (jobId) => {
    const jobRef = doc(db, 'jobs', jobId);
    return await deleteDoc(jobRef);
};

export const getJobs = async () => {
    const q = query(collection(db, 'jobs'), orderBy('posted', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const submitDemoRequest = async (data) => {
    return await addDoc(collection(db, 'demoRequests'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'pending',
    });
};

export const submitFutureApplication = async (data) => {
    return await addDoc(collection(db, 'futureApplications'), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'pending',
    });
};

// --- Projects CRUD ---

export const getProjects = async () => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProject = async (projectId) => {
    const projectRef = doc(db, 'projects', projectId);
    const { getDoc } = await import('firebase/firestore'); 
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

export const addProject = async (projectData) => {
    return await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: serverTimestamp(),
    });
};

export const updateProject = async (projectId, projectData) => {
    const projectRef = doc(db, 'projects', projectId);
    return await updateDoc(projectRef, projectData);
};

export const deleteProject = async (projectId) => {
    const projectRef = doc(db, 'projects', projectId);
    return await deleteDoc(projectRef);
};

// --- Testimonials CRUD ---

export const getTestimonials = async () => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const addTestimonial = async (testimonialData) => {
    return await addDoc(collection(db, 'testimonials'), {
        ...testimonialData,
        createdAt: serverTimestamp(),
    });
};

export const updateTestimonial = async (testimonialId, testimonialData) => {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    return await updateDoc(testimonialRef, testimonialData);
};

export const deleteTestimonial = async (testimonialId) => {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    return await deleteDoc(testimonialRef);
};

export const toggleTestimonialStatus = async (testimonialId, currentStatus) => {
    const testimonialRef = doc(db, 'testimonials', testimonialId);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return await updateDoc(testimonialRef, { status: newStatus, updatedAt: serverTimestamp() });
};

// --- Franchises CRUD ---

export const getFranchises = async () => {
    const q = query(collection(db, 'franchises'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const addFranchise = async (franchiseData) => {
    return await addDoc(collection(db, 'franchises'), {
        ...franchiseData,
        createdAt: serverTimestamp(),
    });
};

export const updateFranchise = async (franchiseId, franchiseData) => {
    const franchiseRef = doc(db, 'franchises', franchiseId);
    return await updateDoc(franchiseRef, franchiseData);
};

export const deleteFranchise = async (franchiseId) => {
    const franchiseRef = doc(db, 'franchises', franchiseId);
    return await deleteDoc(franchiseRef);
};

export const toggleFranchiseStatus = async (franchiseId, currentStatus) => {
    const franchiseRef = doc(db, 'franchises', franchiseId);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return await updateDoc(franchiseRef, { status: newStatus, updatedAt: serverTimestamp() });
};
