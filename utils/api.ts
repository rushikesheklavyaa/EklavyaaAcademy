import { EnquiryFormData } from '../types';

// Your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyq2Ms4c1dmofZuQxPoRlUD9Ly6dsa3k_VQovhMOJ9DjuNim0o6PANN4vmES4R7F6J5xA/exec';

export const submitEnquiry = async (data: any): Promise<boolean> => {
  // Verify the URL is configured (it should start with https)
  const isConfigured = GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('https');

  if (!isConfigured) {
    console.warn('⚠️ Google Script URL is missing or invalid in utils/api.ts');
    alert('System Error: The API URL is missing. Please contact the administrator.');
    return false;
  }

  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key] || '');
    });
    
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