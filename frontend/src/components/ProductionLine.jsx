import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { productionAPI } from '../api';
import './ProductionLine.css';

const ProductionLine = () => {
  const [lines, setLines] = useState([]);
  const [stats, setStats] = useState({
    total_lines: 6,
    active_lines: 5,
    total_capacity: 225,
    total_operators: 194,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLineForm, setNewLineForm] = useState({
    line_name: '',
    line_type: 'Sewing',
    capacity: 50,
    supervisor_id: 1,
    target_output_per_hour: 120,
  });

  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    setLoading(true);
    const [linesRes, statsRes] = await Promise.all([
      productionAPI.getLines(),
      productionAPI.getStats(),
    ]);
    if (linesRes.data?.success) setLines(linesRes.data.data);
    if (statsRes.data?.success) setStats(statsRes.data.data);
    setLoading(false);
  };

  const handleCreateLine = async (e) => {
    e.preventDefault();
    if (!newLineForm.line_name) {
      alert('Line name is required');
      return;
    }
    await productionAPI.createLine(newLineForm);
    alert(`Production Line "${newLineForm.line_name}" created successfully!`);
    setShowCreateModal(false);
    loadProductionData();
  };

  return (
    <Layout>
      <div className="production-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Production Line Operations</h1>
            <p className="page-subtitle">
              Real-time floor line tracking, throughput telemetry, and line
              balancing
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus-circle"></i> Create Production Line
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="production-stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Lines</span>
              <div className="stat-card-icon icon-blue">
                <i className="fas fa-industry"></i>
              </div>
            </div>
            <div className="stat-card-value">{stats.total_lines}</div>
            <div className="stat-card-subtitle">
              {stats.active_lines} currently operating
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Active Floor Capacity</span>
              <div className="stat-card-icon icon-green">
                <i className="fas fa-users"></i>
              </div>
            </div>
            <div className="stat-card-value">{stats.total_capacity}</div>
            <div className="stat-card-subtitle">
              Workstation slots available
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Active Operators</span>
              <div className="stat-card-icon icon-yellow">
                <i className="fas fa-user-friends"></i>
              </div>
            </div>
            <div className="stat-card-value">{stats.total_operators}</div>
            <div className="stat-card-subtitle">Clocked in this shift</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Average Floor Efficiency</span>
              <div className="stat-card-icon icon-green">
                <i className="fas fa-chart-line"></i>
              </div>
            </div>
            <div className="stat-card-value">89.4%</div>
            <div className="stat-card-subtitle">Target &gt; 85%</div>
          </div>
        </div>

        {/* Production Lines Grid */}
        <div className="lines-section">
          <h2>Active Production Lines</h2>
          {loading ? (
            <div className="loading-state">Loading line metrics...</div>
          ) : (
            <div className="lines-grid">
              {lines.map((line) => (
                <div key={line.id} className="line-card">
                  <div className="line-card-header">
                    <div>
                      <h3>{line.line_name}</h3>
                      <span className="line-type-badge">{line.line_type}</span>
                    </div>
                    <span
                      className={`badge ${line.status === 'active' ? 'badge-success' : 'badge-danger'}`}
                    >
                      {line.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="line-supervisor">
                    <i className="fas fa-user-tie"></i>
                    <span>
                      Supervisor:{' '}
                      <strong>{line.supervisor_name || 'Unassigned'}</strong>
                    </span>
                  </div>

                  <div className="line-metrics-table">
                    <div className="line-metric-col">
                      <span className="col-label">Staffing</span>
                      <span className="col-val">
                        {line.actual_workers || line.current_workers || 45} /{' '}
                        {line.capacity}
                      </span>
                    </div>
                    <div className="line-metric-col">
                      <span className="col-label">Hourly Output</span>
                      <span className="col-val">
                        {line.current_output || 118} pcs
                      </span>
                    </div>
                    <div className="line-metric-col">
                      <span className="col-label">Target Rate</span>
                      <span className="col-val">
                        {line.target_output_per_hour || 120} pcs
                      </span>
                    </div>
                  </div>

                  <div className="line-pace-progress">
                    <div className="pace-labels">
                      <span>Capacity Utilization</span>
                      <span>
                        {Math.round(
                          ((line.actual_workers || 45) / line.capacity) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div
                      className="progress-bar-container"
                      style={{ width: '100%' }}
                    >
                      <div
                        className="progress-fill success"
                        style={{
                          width: `${Math.min(100, Math.round(((line.actual_workers || 45) / line.capacity) * 100))}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="line-card-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        alert(
                          `Opening telemetric line diagnostics for ${line.line_name}...`,
                        )
                      }
                    >
                      <i className="fas fa-sliders-h"></i> Line Telemetry
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        alert(`Reallocating workforce for ${line.line_name}...`)
                      }
                    >
                      <i className="fas fa-user-friends"></i> Reallocate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Production Line Modal (Figma node-id=1-58463) */}
      {showCreateModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Create New Production Line</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateLine}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">Line Name / Identifier</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Line-G"
                    value={newLineForm.line_name}
                    onChange={(e) =>
                      setNewLineForm({
                        ...newLineForm,
                        line_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department / Line Type</label>
                  <select
                    className="form-control"
                    value={newLineForm.line_type}
                    onChange={(e) =>
                      setNewLineForm({
                        ...newLineForm,
                        line_type: e.target.value,
                      })
                    }
                  >
                    <option value="Sewing">Sewing</option>
                    <option value="Cutting">Cutting</option>
                    <option value="Finishing">Finishing</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Max Operator Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newLineForm.capacity}
                    onChange={(e) =>
                      setNewLineForm({
                        ...newLineForm,
                        capacity: Number(e.target.value),
                      })
                    }
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Target Output Per Hour (Pcs)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={newLineForm.target_output_per_hour}
                    onChange={(e) =>
                      setNewLineForm({
                        ...newLineForm,
                        target_output_per_hour: Number(e.target.value),
                      })
                    }
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check"></i> Save Production Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductionLine;
