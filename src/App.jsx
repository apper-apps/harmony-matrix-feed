import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ToastContainer } from 'react-toastify';

// Layout Components
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

// Page Components
import Dashboard from '@/components/pages/Dashboard';
import Students from '@/components/pages/Students';
import Teachers from '@/components/pages/Teachers';
import Classes from '@/components/pages/Classes';
import Attendance from '@/components/pages/Attendance';
import Schedule from '@/components/pages/Schedule';
import Billing from '@/components/pages/Billing';
import Reports from '@/components/pages/Reports';

// Configure Redux Store
const store = configureStore({
  reducer: {
    // Add your reducers here as they are implemented
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

function App() {
  return (
    <Provider store={store}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
        
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Provider>
  );
}

export default App;