import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadResume = async (file, applicantName) => {
    try {
        const timestamp = Date.now();
        const sanitizedName = applicantName.replace(/\s+/g, '_');
        const fileRef = ref(storage, `resumes/${sanitizedName}_${timestamp}_${file.name}`);
        
        console.log('Starting resume upload...');
        const snapshot = await uploadBytes(fileRef, file);
        console.log('Upload completed, getting download URL...');
        
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', downloadURL);
        
        return { downloadURL, path: snapshot.ref.fullPath };
    } catch (error) {
        console.error('Resume upload error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // If it's a CORS error, provide a helpful message
        if (error.message.includes('CORS') || error.message.includes('blocked')) {
            throw new Error('Resume upload failed due to CORS configuration. Please contact administrator to set up Firebase Storage CORS rules.');
        }
        
        throw error;
    }
};


export const uploadAdminFile = async (file, folder, itemName, type = 'asset') => {
    try {
        const timestamp = Date.now();
        const sanitizedItemName = itemName.replace(/\s+/g, '_');
        const fileRef = ref(storage, `${folder}/${sanitizedItemName}/${type}_${timestamp}_${file.name}`);
        
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return { downloadURL, path: snapshot.ref.fullPath };
    } catch (error) {
        console.error(`Upload error in ${folder}:`, error);
        throw error;
    }
};
