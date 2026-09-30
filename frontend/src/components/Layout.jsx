import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

const ALL_NAV_ITEMS = [
  { title: 'Overview', isSection: true },
  { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { path: '/rewards', label: 'Worker Rewards', icon: 'fas fa-award' },
  { path: '/performance', label: 'Worker Performance', icon: 'fas fa-users-cog' },
  { path: '/attendance', label: 'Attendance & Shifts', icon: 'fas fa-calendar-check' },

  //{ title: 'Manufacturing', isSection: true },
  { path: '/production', label: 'Production Lines', icon: 'fas fa-industry' },
  { path: '/job-sequencing', label: 'Job Sequencing', icon: 'fas fa-tasks' },
  { path: '/inventory', label: 'Inventory Catalog', icon: 'fas fa-boxes' },
  { path: '/quality-control', label: 'Quality Control', icon: 'fas fa-check-circle' },
  { path: '/waste', label: 'Waste Tracking', icon: 'fas fa-recycle' },
  { path: '/machines', label: 'Machine Fleet', icon: 'fas fa-cogs' },

  //{ title: 'Intelligence & Safety', isSection: true },
  { path: '/safety', label: 'Worker Safety (বাং)', icon: 'fas fa-shield-alt', badge: 'Bangla' },
  { path: '/ai-insights', label: 'AI Insights', icon: 'fas fa-brain', badge: 'AI' },
  { path: '/reports', label: 'Reports & Compliance', icon: 'fas fa-file-contract' },
  { path: '/chats', label: 'Internal Chats', icon: 'fas fa-comments', badge: '3' },
  { path: '/settings', label: 'Settings', icon: 'fas fa-cog' },
];

const ROLE_PERMISSIONS = {
  admin: [
    '/dashboard',
    '/rewards',
    '/performance',
    '/attendance',
    '/safety',
    '/ai-insights',
    '/reports',
    '/chats',
  ],
  line_manager: [
    '/dashboard',
    '/rewards',
    '/performance',
    '/attendance',
    '/production',
    '/inventory',
  ],
  qc_inspector: [
    '/dashboard',
    '/quality-control',
    '/waste',
  ],
  maintenance_staff: [
    '/dashboard',
    '/machines',
  ],
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userRole = user?.role || 'admin';
  const allowedPaths = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.admin;

  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (item.isSection) return true;
    return allowedPaths.includes(item.path);
  });

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (!user) {
    return (
      <div className="layout-container">
        <div className="layout-main">
          <div className="layout-content">
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Please log in to access the system.</p>
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="layout-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-badge">C2S</div>
          <div className="brand-info">
            <h1>C2S System</h1>
            <p>Garments Platform v2.0</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => {
            if (item.isSection) {
              return (
                <div key={index} className="nav-section-title">
                  {item.title}
                </div>
              );
            }
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="layout-main">
        {/* Header */}
        <header className="layout-header">
          <div className="header-search-bar">
            <i
              className="fas fa-search"
              style={{ color: 'var(--color-neutral-400)' }}
            ></i>
            <input type="text" placeholder="Search orders, workers, lines..." />
          </div>

          <div className="header-meta">
            <div className="header-pill">
              <i
                className="fas fa-calendar-day"
                style={{ color: 'var(--color-primary-500)' }}
              ></i>
              <span>{currentDate}</span>
            </div>
            <div className="header-pill">
              <i
                className="fas fa-clock"
                style={{ color: 'var(--color-accent-600)' }}
              ></i>
              <span>Morning Shift (08:00 - 17:00)</span>
            </div>

            <div className="header-user-profile">
              <div className="user-avatar-circle">
                {user.full_name?.charAt(0) || 'A'}
              </div>
              <div className="user-text-info">
                <span className="user-name">
                  {user.full_name || 'System Admin'}
                </span>
                <span className="user-role">
                  {user.role || 'Administrator'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="layout-content">{children}</main>

        {/* Global System Status Footer */}
        <footer className="layout-footer">
          <div className="footer-badges">
            <div className="footer-badge-item">
              <i className="fas fa-check-circle"></i>
              <span>Compliance Readiness: Good (96%)</span>
            </div>
            <div className="footer-badge-item">
              <i className="fas fa-leaf"></i>
              <span>Sustainability Score: Good (91%)</span>
            </div>
            <div className="footer-badge-item">
              <i className="fas fa-heart"></i>
              <span>Worker Wellbeing: Good (94%)</span>
            </div>
          </div>
          <div>© 2026 C2S Garments Management System. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
