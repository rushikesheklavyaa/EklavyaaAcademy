import { EnquiryFormData } from '../types';

// Your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwcVi3-b7gw4sEjI8WtlaQHkkX2hH3oshj1Shj4cAK8URClWbF-3N0L0uVI7j86BeF_/exec';

export const submitEnquiry = async (data: EnquiryFormData): Promise<boolean> => {
  // Verify the URL is configured (it should start with https)
  const isConfigured = GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('https');

  if (!isConfigured) {
    console.warn('⚠️ Google Script URL is missing or invalid in utils/api.ts');
    alert('System Error: The API URL is missing. Please contact the administrator.');
    return false;
  }

  try {
    const formData = new FormData();
    formData.append('studentName', data.studentName);
    formData.append('parentName', data.parentName);
    formData.append('grade', data.grade);
    formData.append('board', data.board);
    formData.append('schoolName', data.schoolName);
    formData.append('address', data.address);
    formData.append('phone', data.phone);
    formData.append('email', data.email || '');
    formData.append('message', data.message || '');
    
    // 'no-cors' mode is required for Google Scripts to avoid CORS errors in the browser
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', 
    });
    
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
};