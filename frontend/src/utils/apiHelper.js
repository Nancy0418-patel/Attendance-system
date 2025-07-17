// API helper utility to handle fetch requests with proper error handling
const API_BASE_URL =  'http://localhost:5000' ;

/**
 * Makes a fetch request and handles JSON parsing errors
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<{data: any, error: string|null}>} - Returns data or error
 */
export const apiRequest = async (url, options = {}) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, options);
    
    // Check if response is ok first
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      // Try to parse JSON error message if available
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }
      } catch (jsonError) {
        // If JSON parsing fails, use the status text
        console.warn('Failed to parse error response as JSON:', jsonError);
      }
      
      return { data: null, error: errorMessage };
    }
    
    // Try to parse successful response as JSON
    try {
      const data = await response.json();
      return { data, error: null };
    } catch (jsonError) {
      console.warn('Failed to parse response as JSON:', jsonError);
      return { data: null, error: 'Invalid JSON response from server' };
    }
    
  } catch (networkError) {
    console.error('Network error:', networkError);
    return { data: null, error: 'Network error - please check your connection' };
  }
};

/**
 * Makes a GET request
 * @param {string} url - The API endpoint URL
 * @param {object} headers - Additional headers
 * @returns {Promise<{data: any, error: string|null}>}
 */
export const apiGet = async (url, headers = {}) => {
  return apiRequest(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

/**
 * Makes a POST request
 * @param {string} url - The API endpoint URL
 * @param {object} data - Request body data
 * @param {object} headers - Additional headers
 * @returns {Promise<{data: any, error: string|null}>}
 */
export const apiPost = async (url, data, headers = {}) => {
  return apiRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
};

/**
 * Makes a PUT request
 * @param {string} url - The API endpoint URL
 * @param {object} data - Request body data
 * @param {object} headers - Additional headers
 * @returns {Promise<{data: any, error: string|null}>}
 */
export const apiPut = async (url, data, headers = {}) => {
  return apiRequest(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  });
};

/**
 * Makes a DELETE request
 * @param {string} url - The API endpoint URL
 * @param {object} headers - Additional headers
 * @returns {Promise<{data: any, error: string|null}>}
 */
export const apiDelete = async (url, headers = {}) => {
  return apiRequest(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

/**
 * Gets authorization header with token
 * @returns {object} Authorization header object
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default { apiRequest, apiGet, apiPost, apiPut, apiDelete, getAuthHeader };
