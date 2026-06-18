import axios from 'axios';

const API_URL =  'https://taskassignmentbackend.onrender.com/api/v1';


console.log("API URLaaa:", API_URL);

// Utility function to get userId from localStorage
export const getUserId = () => {
  return localStorage.getItem('userId');
};
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});
// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const isAuthEndpoint =
    config.url.includes('/auth/login') ||
    config.url.includes('/auth/setup-password');

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const authAPI = {
 
  login: (email, password) => api.post('/auth/login', { email, password }),
  setupPassword: (token, password, confirmPassword) =>
    api.post('/auth/setup-password', { token, password, confirmPassword }),
  getMe: () => api.get('/auth/me'),
};
console.log('Auth API:', authAPI); 

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.log('401 error - removing token');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/setup-password')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
); 
// Employee APIs
export const employeeAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/employees?page=${page}&limit=${limit}`),
  add: (fullName, email, role) => api.post('/employees', { fullName, email, role }),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getById: (id) => api.get(`/employees/${id}`),
  search: (search) => api.get(`/employees/search?search=${search}`),

};


export const attendanceAPI = {
  checkIn: () => api.post("/attendance/check-in"),
  checkOut: () => api.post("/attendance/check-out"),
  getStatus: (userId) => api.get(`/attendance/today`),
  getTimerStatus: () => api.get("/attendance/timer-status"),
  getMyAttendance: () => api.get("/attendance/my"),
  getAllAttendance: () => api.get("/attendance/all"),
};
// Task APIs
export const taskAPI = {
  getAll: (page = 1, limit = 10, status = '', priority = '', assignedTo = '') =>
    api.get(`/tasks?page=${page}&limit=${limit}&status=${status}&priority=${priority}&assignedTo=${assignedTo}`),
  getMyTasks: (page = 1, limit = 10, status = '', priority = '') =>
    api.get(`/tasks/my-tasks?page=${page}&limit=${limit}&status=${status}&priority=${priority}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
  getById: (id) => api.get(`/tasks/${id}`),
  search: (search) => api.get(`/tasks/search?search=${search}`),
  getAnalytics: () => api.get('/tasks/analytics'),
};

// Notification APIs
export const notificationAPI = {
  getAll: (page = 1, limit = 10, isRead = '') =>
    api.get(`/notifications?page=${page}&limit=${limit}&isRead=${isRead}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};



export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
};
export default api;
