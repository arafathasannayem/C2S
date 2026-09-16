import React, { useState } from 'react';
import Layout from './Layout';
import { usersAPI } from '../api';
import './Settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'worker',
    phone: '',
    employee_id: '',
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    const response = await usersAPI.addUser(newUser);
    if (response.data?.success) {
      alert(
        `User ${newUser.full_name} (${newUser.role}) provisioned successfully!`,
      );
      setNewUser({
        full_name: '',
        email: '',
        password: '',
        role: 'worker',
        phone: '',
        employee_id: '',
      });
      setShowUserModal(false);
    }
  };

  const settingsCards = [
    {
      id: 'profile',
      icon: 'fas fa-user-cog',
      title: 'Profile Settings',
      description: 'Manage your administrator credentials',
    },
    {
      id: 'factory',
      icon: 'fas fa-industry',
      title: 'Factory Profile',
      description: 'Address, BGMEA licensing, capacity',
    },
    {
      id: 'users',
      icon: 'fas fa-users-cog',
      title: 'Roles & Permissions',
      description: 'Access control list & role assignments',
    },
    {
      id: 'input_user',
      icon: 'fas fa-user-plus',
      title: 'Provision New User',
      description: 'Create admin, manager, or worker login',
      isSpecial: true,
    },
    {
      id: 'production',
      icon: 'fas fa-cogs',
      title: 'Production Thresholds',
      description: 'Line pace benchmarks and shift definitions',
    },
    {
      id: 'quality',
      icon: 'fas fa-check-circle',
      title: 'AQL Inspection Criteria',
      description: 'Defect thresholds & sampling rates',
    },
    {
      id: 'notifications',
      icon: 'fas fa-bell',
      title: 'Alert Preferences',
      description: 'SMS & in-app alerts for critical hazards',
    },
    {
      id: 'backup',
      icon: 'fas fa-database',
      title: 'Database Backup',
      description: 'Export relational snapshots and schemas',
    },
  ];

  return (
    <Layout>
      <div className="settings-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">System Settings & Administration</h1>
            <p className="page-subtitle">
              Manage factory configurations, role-based user access, and system
              preferences
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowUserModal(true)}
            >
              <i className="fas fa-user-plus"></i> Provision User
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="report-sub-tabs">
          <button
            className={`tab-btn ${activeSection === 'general' ? 'active' : ''}`}
            onClick={() => setActiveSection('general')}
          >
            General Configuration
          </button>
          <button
            className={`tab-btn ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            User Management
          </button>
          <button
            className={`tab-btn ${activeSection === 'system' ? 'active' : ''}`}
            onClick={() => setActiveSection('system')}
          >
            System & Database
          </button>
        </div>

        {/* Settings Cards Grid */}
        <div className="settings-cards-grid">
          {settingsCards.map((card) => (
            <div
              key={card.id}
              className={`setting-tile ${card.isSpecial ? 'special' : ''}`}
              onClick={() => {
                if (card.id === 'input_user') setShowUserModal(true);
                else alert(`Navigating to ${card.title}...`);
              }}
            >
              <div className="setting-tile-icon">
                <i className={card.icon}></i>
              </div>
              <div className="setting-tile-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <i className="fas fa-chevron-right chevron-icon"></i>
            </div>
          ))}
        </div>
      </div>

      {/* User Provisioning Modal */}
      {showUserModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Provision New System User</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowUserModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.full_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, full_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">System Role</label>
                  <select
                    className="form-control"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="worker">Worker Operator</option>
                    <option value="line_manager">
                      Line Supervisor / Manager
                    </option>
                    <option value="qc_inspector">QC Inspector</option>
                    <option value="maintenance_staff">
                      Maintenance Technician
                    </option>
                    <option value="admin">System Administrator</option>
                    <option value="auditor">Buyer Compliance Auditor</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Employee ID (if applicable)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="EMP-..."
                      value={newUser.employee_id}
                      onChange={(e) =>
                        setNewUser({ ...newUser, employee_id: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-user-check"></i> Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Settings;
