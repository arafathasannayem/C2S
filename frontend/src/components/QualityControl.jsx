import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { qualityAPI } from '../api';
import './QualityControl.css';

const QualityControl = () => {
  const [data, setData] = useState({
    summary: {},
    defect_breakdown: [],
    pass_fail_trends: [],
  });
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'history'

  // Modals state
  const [showStartInspectModal, setShowStartInspectModal] = useState(false);
  const [showViewInspectModal, setShowViewInspectModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

  // New Inspection Form
  const [newInspectForm, setNewInspectForm] = useState({
    batch_number: 'BATCH-2026-095',
    product_id: 1,
    line_id: 1,
    sample_size: 200,
    defects_found: 2,
    defect_category: 'Fabric Defects',
    notes: 'Random sample check on Line-A output batch',
  });

  useEffect(() => {
    loadQCData();
  }, []);

  const loadQCData = async () => {
    setLoading(true);
    const [statsRes, inspRes] = await Promise.all([
      qualityAPI.getStats(),
      qualityAPI.getInspections(),
    ]);
    if (statsRes.data?.success) setData(statsRes.data.data);
    if (inspRes.data?.success) setInspections(inspRes.data.data);
    setLoading(false);
  };

  const handleOpenDetails = (insp) => {
    setSelectedInspection(insp);
    setShowViewInspectModal(true);
  };

  const handleStartInspection = async (e) => {
    e.preventDefault();
    await qualityAPI.createInspection(newInspectForm);
    alert(
      `Inspection for ${newInspectForm.batch_number} logged successfully! Status: ${newInspectForm.defects_found <= 4 ? 'Accepted' : 'Rejected'}`,
    );
    setShowStartInspectModal(false);
    loadQCData();
  };

  return (
    <Layout>
      <div className="qc-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Quality Assurance & Defect Tracking</h1>
            <p className="page-subtitle">
              AQL 2.5 defect inspections, first-pass yield metrics, and
              historical batch audits
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowStartInspectModal(true)}
            >
              <i className="fas fa-plus-circle"></i> Start New Inspection
            </button>
            <button
              className={`btn ${currentView === 'history' ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() =>
                setCurrentView(currentView === 'main' ? 'history' : 'main')
              }
            >
              <i className="fas fa-history"></i>{' '}
              {currentView === 'main'
                ? 'View All Inspection History'
                : 'Back to QC Dashboard'}
            </button>
          </div>
        </div>

        {currentView === 'main' ? (
          <>
            {/* Overview Stats */}
            <div className="qc-overview-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Overall Pass Rate</span>
                  <div className="stat-card-icon icon-green">
                    <i className="fas fa-check-double"></i>
                  </div>
                </div>
                <div className="stat-card-value">
                  {data.summary?.overall_pass_rate || 93.6}%
                </div>
                <div className="stat-card-subtitle">
                  AQL 2.5 Industry Target &gt; 92%
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">
                    Total Inspected (Month)
                  </span>
                  <div className="stat-card-icon icon-blue">
                    <i className="fas fa-box"></i>
                  </div>
                </div>
                <div className="stat-card-value">
                  {data.summary?.total_inspected_month || 14200} pcs
                </div>
                <div className="stat-card-subtitle">
                  {data.summary?.total_rejected_month || 910} rejected pcs
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-card-title">Avg. Time to Resolve</span>
                  <div className="stat-card-icon icon-yellow">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
                <div className="stat-card-value">
                  {data.summary?.avg_resolve_time_hours || 12}h
                </div>
                <div className="stat-card-subtitle">
                  Down from 18h last month
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="qc-charts-grid">
              {/* Defect Category Breakdown */}
              <div className="chart-card">
                <h3 className="chart-card-title">
                  Defect Type Breakdown (Pareto Analysis)
                </h3>
                <div className="defect-breakdown-list">
                  {(data.defect_breakdown || []).map((item, idx) => (
                    <div key={idx} className="defect-breakdown-row">
                      <div className="defect-row-info">
                        <span className="defect-name">{item.category}</span>
                        <span className="defect-pct">{item.percentage}%</span>
                      </div>
                      <div
                        className="progress-bar-container"
                        style={{ width: '100%' }}
                      >
                        <div
                          className="progress-fill danger"
                          style={{
                            width: `${item.percentage * 3.5}%`,
                            backgroundColor: 'var(--color-primary-500)',
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Pass/Fail Trends */}
              <div className="chart-card">
                <h3 className="chart-card-title">
                  Monthly Pass / Fail Rate Telemetry
                </h3>
                <div className="pass-fail-bars">
                  {(data.pass_fail_trends || []).map((trend, idx) => (
                    <div key={idx} className="trend-bar-col">
                      <div className="bar-track">
                        <div
                          className="bar-pass"
                          style={{ height: `${trend.pass}%` }}
                        ></div>
                      </div>
                      <span className="trend-month">{trend.month}</span>
                      <span className="trend-rate">{trend.pass}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Inspections Grid */}
            <div className="inspections-section">
              <div className="section-title-row">
                <h2>Recent Inspections (Last 30 Days)</h2>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentView('history')}
                >
                  View All Inspections
                </button>
              </div>

              <div className="inspections-grid">
                {inspections.slice(0, 4).map((insp) => (
                  <div key={insp.id} className="inspection-card">
                    <div className="inspection-card-header">
                      <div>
                        <h3>{insp.item}</h3>
                        <span className="batch-sub">{insp.batch_number}</span>
                      </div>
                      <span
                        className={`badge ${insp.status === 'Accepted' ? 'badge-success' : 'badge-danger'}`}
                      >
                        {insp.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="inspection-details-row">
                      <div>
                        <i className="fas fa-calendar"></i> {insp.date}
                      </div>
                      <div>
                        <i className="fas fa-tshirt"></i> {insp.unit} units
                      </div>
                      <div>
                        <i className="fas fa-user-check"></i>{' '}
                        {insp.inspector_name}
                      </div>
                    </div>

                    <div className="inspection-card-footer">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenDetails(insp)}
                      >
                        <i className="fas fa-eye"></i> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* History View (Figma node-id=1-56481) */
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Quality Control Comprehensive Inspection History</h2>
              <span className="badge badge-info">
                {inspections.length} Total Audits
              </span>
            </div>

            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Batch Code</th>
                    <th>Product Item</th>
                    <th>Audit Date</th>
                    <th>Lot Sample Size</th>
                    <th>Auditing Inspector</th>
                    <th>Verdict Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((insp) => (
                    <tr key={insp.id}>
                      <td>
                        <strong>{insp.batch_number}</strong>
                      </td>
                      <td>{insp.item}</td>
                      <td>{insp.date}</td>
                      <td>{insp.unit} units</td>
                      <td>{insp.inspector_name}</td>
                      <td>
                        <span
                          className={`badge ${insp.status === 'Accepted' ? 'badge-success' : 'badge-danger'}`}
                        >
                          {insp.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenDetails(insp)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: View Inspect Page / Details (Figma node-id=1-56566) */}
      {showViewInspectModal && selectedInspection && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>
                Inspection Audit Dossier: {selectedInspection.batch_number}
              </h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowViewInspectModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="c2s-modal-body">
              <div className="dossier-grid">
                <div className="dossier-item">
                  <span className="dossier-label">Garment Product</span>
                  <span className="dossier-val">{selectedInspection.item}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Inspection Date</span>
                  <span className="dossier-val">{selectedInspection.date}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Sample Units</span>
                  <span className="dossier-val">
                    {selectedInspection.unit} pcs
                  </span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Assigned Inspector</span>
                  <span className="dossier-val">
                    {selectedInspection.inspector_name}
                  </span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">AQL Verdict</span>
                  <span
                    className={`badge ${selectedInspection.status === 'Accepted' ? 'badge-success' : 'badge-danger'}`}
                  >
                    {selectedInspection.status}
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  backgroundColor: 'var(--color-neutral-50)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h4
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    marginBottom: '0.5rem',
                  }}
                >
                  QC Defect Breakdown
                </h4>
                <p
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  1 Minor Stitch Skip (Line-A, Station 3). Minor spot stain
                  removed during finishing steam process.
                </p>
              </div>
            </div>
            <div className="c2s-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowViewInspectModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert('Generated signed QC Certificate');
                  setShowViewInspectModal(false);
                }}
              >
                <i className="fas fa-file-pdf"></i> Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Start New Inspection (Figma node-id=1-56586) */}
      {showStartInspectModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Start New Quality Inspection</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowStartInspectModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleStartInspection}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">Batch Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newInspectForm.batch_number}
                    onChange={(e) =>
                      setNewInspectForm({
                        ...newInspectForm,
                        batch_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Garment</label>
                  <select
                    className="form-control"
                    value={newInspectForm.product_id}
                    onChange={(e) =>
                      setNewInspectForm({
                        ...newInspectForm,
                        product_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="1">Crew Neck Shirt (PRD001)</option>
                    <option value="2">Winter Jacket (PRD002)</option>
                    <option value="3">Slim Fit Jeans (PRD003)</option>
                    <option value="4">Polo Shirt (PRD006)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sample Lot Size (pcs)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newInspectForm.sample_size}
                    onChange={(e) =>
                      setNewInspectForm({
                        ...newInspectForm,
                        sample_size: Number(e.target.value),
                      })
                    }
                    min="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Defects Identified</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newInspectForm.defects_found}
                    onChange={(e) =>
                      setNewInspectForm({
                        ...newInspectForm,
                        defects_found: Number(e.target.value),
                      })
                    }
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Defect Category</label>
                  <select
                    className="form-control"
                    value={newInspectForm.defect_category}
                    onChange={(e) =>
                      setNewInspectForm({
                        ...newInspectForm,
                        defect_category: e.target.value,
                      })
                    }
                  >
                    <option value="Fabric Defects">Fabric Defects</option>
                    <option value="Embroidery Defects">
                      Embroidery Defects
                    </option>
                    <option value="Trims & Accessories Defects">
                      Trims & Accessories Defects
                    </option>
                    <option value="Finishing Defects">Finishing Defects</option>
                    <option value="Sewing Defects">Sewing Defects</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Inspector Notes</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={newInspectForm.notes}
                    onChange={(e) =>
                      setNewInspectForm({
                        ...newInspectForm,
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
                  onClick={() => setShowStartInspectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check"></i> Submit Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QualityControl;
