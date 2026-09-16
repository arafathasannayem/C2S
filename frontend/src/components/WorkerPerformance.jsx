import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { workersAPI } from '../api';
import './WorkerPerformance.css';

const WorkerPerformance = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [trainingForm, setTrainingForm] = useState({
    training_module: 'Precision Lockstitch & Tension Adjustment',
    supervisor_id: 1,
    start_date: new Date().toISOString().split('T')[0],
    target_completion_date: new Date(Date.now() + 14 * 86400000)
      .toISOString()
      .split('T')[0],
    notes:
      'Focus on seam uniformity and reducing needle breaks on high-speed runs.',
  });

  useEffect(() => {
    loadWorkers();
  }, [departmentFilter]);

  const loadWorkers = async () => {
    setLoading(true);
    const res = await workersAPI.getWorkers(
      1,
      20,
      departmentFilter,
      searchTerm,
    );
    if (res.data?.success) {
      setWorkers(res.data.data);
    }
    setLoading(false);
  };

  const handleOpenTraining = (worker) => {
    setSelectedWorker(worker);
    setShowTrainingModal(true);
  };

  const handleConfirmTraining = async (e) => {
    e.preventDefault();
    await workersAPI.assignTraining({
      worker_id: selectedWorker?.id,
      ...trainingForm,
    });
    alert(
      `Training module "${trainingForm.training_module}" assigned to ${selectedWorker?.full_name}!`,
    );
    setShowTrainingModal(false);
  };

  const filteredWorkers = workers.filter(
    (w) =>
      w.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <div className="performance-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Worker Performance & Upskilling</h1>
            <p className="page-subtitle">
              Evaluate line output quality, skill tiers, and assign targeted
              vocational upskilling
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => handleOpenTraining(workers[0] || null)}
            >
              <i className="fas fa-graduation-cap"></i> Assign Training
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="performance-filter-bar">
          <div className="filter-input-wrap">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by worker name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-select-wrap">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Sewing">Sewing</option>
              <option value="Cutting">Cutting</option>
              <option value="Finishing">Finishing</option>
              <option value="Packaging">Packaging</option>
              <option value="Quality Control">Quality Control</option>
            </select>
          </div>
        </div>

        {/* Performance Cards Matrix */}
        <div className="performance-grid">
          {loading ? (
            <div className="loading-state">Loading worker records...</div>
          ) : (
            filteredWorkers.map((worker) => (
              <div key={worker.id} className="perf-card">
                <div className="perf-card-header">
                  <div className="perf-worker-meta">
                    <div className="worker-avatar-box">
                      {worker.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h3>{worker.full_name}</h3>
                      <span className="worker-subtext">
                        {worker.employee_id} • {worker.department}
                      </span>
                    </div>
                  </div>
                  <div className="perf-score-badge">
                    <span>{worker.score || 85}%</span>
                  </div>
                </div>

                <div className="perf-metrics-row">
                  <div className="perf-metric">
                    <span className="perf-metric-label">Assigned Line</span>
                    <span className="perf-metric-value">
                      {worker.line_assignment || 'Line-A'}
                    </span>
                  </div>
                  <div className="perf-metric">
                    <span className="perf-metric-label">Skill Level</span>
                    <span className="perf-metric-value">
                      {worker.skill_level || 'Skilled'}
                    </span>
                  </div>
                  <div className="perf-metric">
                    <span className="perf-metric-label">Base Rate</span>
                    <span className="perf-metric-value">
                      BDT {worker.hourly_rate || 90}/hr
                    </span>
                  </div>
                </div>

                <div className="perf-progress-wrap">
                  <div className="perf-progress-labels">
                    <span>Monthly Efficiency Index</span>
                    <span>{worker.score || 85}%</span>
                  </div>
                  <div className="perf-progress-bar">
                    <div
                      className="perf-progress-fill"
                      style={{ width: `${worker.score || 85}%` }}
                    ></div>
                  </div>
                </div>

                <div className="perf-card-footer">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenTraining(worker)}
                  >
                    <i className="fas fa-graduation-cap"></i> Assign Training
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      alert(
                        `Generating appraisal dossier for ${worker.full_name}...`,
                      )
                    }
                  >
                    <i className="fas fa-chart-line"></i> Appraisal
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assign Training Modal (Figma node-id=1-58054) */}
      {showTrainingModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Assign Training & Upskilling Module</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowTrainingModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleConfirmTraining}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">Worker Target</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      selectedWorker
                        ? `${selectedWorker.full_name} (${selectedWorker.employee_id} - ${selectedWorker.department})`
                        : 'Select Operator'
                    }
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Training Curriculum / Module
                  </label>
                  <select
                    className="form-control"
                    value={trainingForm.training_module}
                    onChange={(e) =>
                      setTrainingForm({
                        ...trainingForm,
                        training_module: e.target.value,
                      })
                    }
                  >
                    <option value="Precision Lockstitch & Tension Adjustment">
                      Precision Lockstitch & Tension Adjustment
                    </option>
                    <option value="Overlock 4-Thread Edge Finishing">
                      Overlock 4-Thread Edge Finishing
                    </option>
                    <option value="Fabric Defect Identification & QA Standards">
                      Fabric Defect Identification & QA Standards
                    </option>
                    <option value="Needle Heat Control & Machine Health Basics">
                      Needle Heat Control & Machine Health Basics
                    </option>
                    <option value="Workplace Safety & Bengali Incident Protocol">
                      Workplace Safety & Bengali Incident Protocol
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Completion Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={trainingForm.target_completion_date}
                    onChange={(e) =>
                      setTrainingForm({
                        ...trainingForm,
                        target_completion_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Supervisor Notes & Focus Area
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={trainingForm.notes}
                    onChange={(e) =>
                      setTrainingForm({
                        ...trainingForm,
                        notes: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTrainingModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check"></i> Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WorkerPerformance;
