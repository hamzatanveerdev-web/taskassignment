import axios from 'axios';

const API_URL =  'https://taskassignmentbackend.onrender.com/api/v1';


console.log("API URLaaa:", API_URL);
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});



// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
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
// Employee APIs
export const employeeAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/employees?page=${page}&limit=${limit}`),
  add: (fullName, email, role) => api.post('/employees', { fullName, email, role }),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getById: (id) => api.get(`/employees/${id}`),
  search: (search) => api.get(`/employees/search?search=${search}`),

};


// Attendance APIs
export const attendanceAPI = {
  checkIn: (userId) => api.post('/attendance/check-in', { userId }),
  
  checkOut: (userId) => api.post('/attendance/check-out', { userId }),
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

export default api;
