import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { reportsAPI } from '../api';
import './ReportsCompliance.css';

const ReportsCompliance = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'daily-production', 'qc-summary', 'waste', 'supply', 'attendance-ledger'
  const [data, setData] = useState({ checklist: [] });
  const [dailyProd, setDailyProd] = useState({ hourly_ledger: [] });
  const [loading, setLoading] = useState(true);

  // Modals
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showComplianceDetailsModal, setShowComplianceDetailsModal] =
    useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReassessmentModal, setShowReassessmentModal] = useState(false);
  const [selectedClause, setSelectedClause] = useState(null);

  // Share form
  const [shareEmail, setShareEmail] = useState('auditor@buyer-compliance.com');
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    setLoading(true);
    const [compRes, prodRes] = await Promise.all([
      reportsAPI.getCompliance(),
      reportsAPI.getDailyProduction(),
    ]);
    if (compRes.data?.success) setData(compRes.data.data);
    if (prodRes.data?.success) setDailyProd(prodRes.data.data);
    setLoading(false);
  };

  const handleOpenDetails = (clause) => {
    setSelectedClause(clause);
    setShowComplianceDetailsModal(true);
  };

  const handleShareDossier = async (e) => {
    e.preventDefault();
    const res = await reportsAPI.shareDossier({ auditor_email: shareEmail });
    if (res.data?.success) {
      setShareLink(res.data.share_link);
    }
  };

  return (
    <Layout>
      <div className="reports-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Reports &amp; Buyer Audit Compliance</h1>
            <p className="page-subtitle">
              Standardized inspection dossiers, Bangladesh Labor Act 2006
              compliance, and audit exports
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowChecklistModal(true)}
            >
              <i className="fas fa-tasks"></i> Manage Checklist
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowShareModal(true)}
            >
              <i className="fas fa-share-alt"></i> Share Dossier
            </button>
            <button
              className="btn btn-accent"
              onClick={() => setShowExportModal(true)}
            >
              <i className="fas fa-file-export"></i> Export Report
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowReassessmentModal(true)}
            >
              <i className="fas fa-clipboard-check"></i> View Reassessment
            </button>
          </div>
        </div>

        {/* Navigation Tabs for Sub-Reports */}
        <div className="report-sub-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Compliance Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'daily-production' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily-production')}
          >
            Daily Production
          </button>
          <button
            className={`tab-btn ${activeTab === 'qc-summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('qc-summary')}
          >
            QC Summary Report
          </button>
          <button
            className={`tab-btn ${activeTab === 'waste' ? 'active' : ''}`}
            onClick={() => setActiveTab('waste')}
          >
            Waste &amp; Sustainability
          </button>
          <button
            className={`tab-btn ${activeTab === 'supply' ? 'active' : ''}`}
            onClick={() => setActiveTab('supply')}
          >
            Supply Audit
          </button>
          <button
            className={`tab-btn ${activeTab === 'attendance-ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance-ledger')}
          >
            Attendance Ledger
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Compliance Scores */}
            <div className="compliance-scores-grid">
              <div className="score-card">
                <div className="score-circle green">
                  <span>{data.readiness_score_pct || 96}%</span>
                </div>
                <div className="score-info">
                  <h3>Compliance Readiness</h3>
                  <p>
                    Ready for international buyer social audit (Accord / ILO)
                  </p>
                </div>
              </div>

              <div className="score-card">
                <div className="score-circle green">
                  <span>{data.sustainability_score_pct || 91}%</span>
                </div>
                <div className="score-info">
                  <h3>Sustainability Score</h3>
                  <p>
                    68% Fabric waste recycled; zero non-compliant effluent
                    discharge
                  </p>
                </div>
              </div>

              <div className="score-card">
                <div className="score-circle green">
                  <span>{data.worker_wellbeing_pct || 94}%</span>
                </div>
                <div className="score-info">
                  <h3>Worker Wellbeing</h3>
                  <p>
                    Bangla safety reporting active; fair wage transparency
                    enabled
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist Table */}
            <div className="attendance-table-card">
              <div className="table-header-row">
                <h2>Regulatory Standards &amp; Clause Verification</h2>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowChecklistModal(true)}
                >
                  <i className="fas fa-edit"></i> Edit Checklist
                </button>
              </div>

              <div className="table-responsive">
                <table className="c2s-table">
                  <thead>
                    <tr>
                      <th>Standard Code</th>
                      <th>Clause</th>
                      <th>Standard Title</th>
                      <th>Category</th>
                      <th>Compliance Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.checklist || []).map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.standard}</strong>
                        </td>
                        <td>{item.clause}</td>
                        <td>{item.title}</td>
                        <td>{item.category}</td>
                        <td>
                          <span
                            className={`badge ${item.status === 'Compliant' ? 'badge-success' : 'badge-warning'}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenDetails(item)}
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
          </>
        )}

        {/* Tab 2: Daily Production Ledger */}
        {activeTab === 'daily-production' && (
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Daily Production Summary ({dailyProd.date || 'Today'})</h2>
              <span className="badge badge-success">
                Active: {dailyProd.total_produced ?? 0} pcs &nbsp;|&nbsp;
                Target: {dailyProd.total_target ?? 0} pcs
              </span>
            </div>
            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Production Line</th>
                    <th>Scheduled Quantity (pcs)</th>
                    <th>Active Jobs</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(dailyProd.lines || []).length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: 'center',
                          color: '#888',
                          padding: '24px',
                        }}
                      >
                        No production jobs scheduled for this date.
                      </td>
                    </tr>
                  ) : (
                    (dailyProd.lines || []).map((line, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{line.line_name}</strong>
                        </td>
                        <td>{Number(line.quantity).toLocaleString()} pcs</td>
                        <td>{line.job_count} jobs</td>
                        <td>
                          <span className="badge badge-success">Scheduled</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: QC Summary Report (Figma node-id=1-60541) */}
        {activeTab === 'qc-summary' && (
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Monthly Quality Assurance Audit Summary</h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => alert('Downloading QC Executive Summary PDF...')}
              >
                <i className="fas fa-file-pdf"></i> Download PDF
              </button>
            </div>
            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Defect Group</th>
                    <th>Total Count (Month)</th>
                    <th>Pareto % Share</th>
                    <th>Primary Originating Line</th>
                    <th>Root Cause Action Taken</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Fabric Yarn Imperfections</strong>
                    </td>
                    <td>240 pcs</td>
                    <td>25%</td>
                    <td>Line-D Cutting</td>
                    <td>Mill supplier yarn lot returned for credit</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Trims &amp; Zippers Misalignment</strong>
                    </td>
                    <td>192 pcs</td>
                    <td>20%</td>
                    <td>Line-A Sewing</td>
                    <td>Operator zipper foot attachment adjusted</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Finishing Stain / Spotting</strong>
                    </td>
                    <td>172 pcs</td>
                    <td>18%</td>
                    <td>Line-C Finishing</td>
                    <td>Steam vacuum table filter replaced</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Waste Report (Figma node-id=1-60568) */}
        {activeTab === 'waste' && (
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Textile Scrap &amp; Waste Management Ledger</h2>
              <span className="badge badge-info">
                Certified Zero Landfill Practice
              </span>
            </div>
            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Material Classification</th>
                    <th>Gross Scrap (kg)</th>
                    <th>Recycled Diverted (kg)</th>
                    <th>Salvage Value Recovered ($)</th>
                    <th>Buyer Environmental Certification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>100% Cotton Knits</strong>
                    </td>
                    <td>185.0 kg</td>
                    <td>170.0 kg (91.8%)</td>
                    <td>$680.00</td>
                    <td>
                      <span className="badge badge-success">
                        OEKO-TEX Standard 100
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Denim 12oz Warp Slub</strong>
                    </td>
                    <td>120.0 kg</td>
                    <td>85.0 kg (70.8%)</td>
                    <td>$340.00</td>
                    <td>
                      <span className="badge badge-success">
                        GOTS Organic Certified
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Supply Audit (Figma node-id=1-60619) */}
        {activeTab === 'supply' && (
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Raw Material Supply &amp; Mill Traceability Audit</h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  alert('Generating Cotton Chain-of-Custody verification...')
                }
              >
                <i className="fas fa-barcode"></i> Verify Chain of Custody
              </button>
            </div>
            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Supplier / Textile Mill</th>
                    <th>Lot Number</th>
                    <th>Fabric Spec</th>
                    <th>Received Yardage</th>
                    <th>Shrinkage Test</th>
                    <th>Audit Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Square Yarns Ltd</strong>
                    </td>
                    <td>LOT-SQ-9421</td>
                    <td>Single Jersey 160 GSM</td>
                    <td>5,400 yds</td>
                    <td>2.1% (Standard &lt; 3.0%)</td>
                    <td>
                      <span className="badge badge-success">Passed Lab QC</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Chittagong Denim Mills</strong>
                    </td>
                    <td>LOT-CDM-104</td>
                    <td>Denim 12oz Twill</td>
                    <td>8,200 yds</td>
                    <td>1.8% (Standard &lt; 2.5%)</td>
                    <td>
                      <span className="badge badge-success">Passed Lab QC</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Attendance Ledger (Figma node-id=1-60593) */}
        {activeTab === 'attendance-ledger' && (
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Official Statutory Attendance &amp; Overtime Ledger</h2>
              <span className="badge badge-info">
                Labor Act 2006 Overtime Rate: 200%
              </span>
            </div>
            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Worker Name</th>
                    <th>Standard Hours</th>
                    <th>Overtime Hours</th>
                    <th>Basic Wage (BDT)</th>
                    <th>Overtime Pay (BDT)</th>
                    <th>Total Remuneration (BDT)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>EMP-001</strong>
                    </td>
                    <td>Taskin Amir</td>
                    <td>208 hrs</td>
                    <td>16.5 hrs</td>
                    <td>24,960</td>
                    <td>3,960</td>
                    <td>
                      <strong>28,920</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>EMP-002</strong>
                    </td>
                    <td>Riya Akter</td>
                    <td>208 hrs</td>
                    <td>12.0 hrs</td>
                    <td>22,880</td>
                    <td>2,640</td>
                    <td>
                      <strong>25,520</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>EMP-003</strong>
                    </td>
                    <td>Hosain Masba</td>
                    <td>208 hrs</td>
                    <td>14.0 hrs</td>
                    <td>19,760</td>
                    <td>2,660</td>
                    <td>
                      <strong>22,420</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Manage Checklist (Figma node-id=1-61217) */}
      {showChecklistModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog large">
            <div className="c2s-modal-header">
              <h2>Manage Regulatory Compliance Checklist</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowChecklistModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="c2s-modal-body">
              <p className="modal-description">
                Verify that statutory factory requirements adhere to local laws
                and buyer codes of conduct:
              </p>
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <input type="checkbox" defaultChecked />
                  <span>
                    <strong>Labor Act Sec. 32:</strong> Minimum wage and
                    overtime calculation transparency
                  </span>
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <input type="checkbox" defaultChecked />
                  <span>
                    <strong>ILO 155:</strong> Bangla safety reporting channel
                    without worker reprisal
                  </span>
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <input type="checkbox" defaultChecked />
                  <span>
                    <strong>Building Code:</strong> Emergency exits illuminated
                    and unobstructed
                  </span>
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <input type="checkbox" defaultChecked />
                  <span>
                    <strong>Environmental:</strong> Fabric cut waste diversion
                    and recycling receipts
                  </span>
                </label>
              </div>
            </div>
            <div className="c2s-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowChecklistModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert('Checklist updated and committed to audit ledger');
                  setShowChecklistModal(false);
                }}
              >
                Save Checklist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: View Compliance Details (Figma node-id=1-60398) */}
      {showComplianceDetailsModal && selectedClause && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Clause Verification: {selectedClause.clause}</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowComplianceDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="c2s-modal-body">
              <div className="dossier-grid">
                <div className="dossier-item">
                  <span className="dossier-label">Statute</span>
                  <span className="dossier-val">{selectedClause.standard}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Status</span>
                  <span className="badge badge-success">
                    {selectedClause.status}
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginTop: '1rem',
                  backgroundColor: 'var(--color-neutral-50)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h4>Requirement</h4>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-neutral-700)',
                    marginTop: '0.25rem',
                  }}
                >
                  {selectedClause.description}
                </p>
              </div>
            </div>
            <div className="c2s-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowComplianceDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Share (Figma node-id=1-60364) */}
      {showShareModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Share Buyer Compliance Dossier</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowShareModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleShareDossier}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">
                    Auditor / Buyer Contact Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    required
                  />
                </div>

                {shareLink && (
                  <div
                    style={{
                      marginTop: '1rem',
                      backgroundColor: '#ecfdf5',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: '#065f46',
                        fontWeight: 600,
                      }}
                    >
                      Secure One-Time Audit Access URL:
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        value={shareLink}
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          navigator.clipboard?.writeText(shareLink);
                          alert('Link copied to clipboard!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-paper-plane"></i> Generate Secure Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Export Report (Figma node-id=1-60229) */}
      {showExportModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Comprehensive Compliance Export</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowExportModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="c2s-modal-body">
              <p className="modal-description">
                Select modules to bundle into the audit export dossier:
              </p>
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <input type="checkbox" defaultChecked /> Daily Production
                  &amp; Throughput Ledgers
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <input type="checkbox" defaultChecked /> Quality Control AQL
                  Inspection Logs
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <input type="checkbox" defaultChecked /> Worker Safety Hazard
                  &amp; Resolution Records
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <input type="checkbox" defaultChecked /> Fabric Waste &amp;
                  Recycling Receipts
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <input type="checkbox" defaultChecked /> Statutory Attendance
                  &amp; Overtime Calculation Ledger
                </label>
              </div>
            </div>
            <div className="c2s-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert('Downloading Master Compliance Dossier (ZIP)...');
                  setShowExportModal(false);
                }}
              >
                <i className="fas fa-download"></i> Download All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: View Reassessment (Figma node-id=1-61182) */}
      {showReassessmentModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Post-Audit Remediation Reassessment</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowReassessmentModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="c2s-modal-body">
              <p className="modal-description">
                Remediation action verification for buyer audit
                non-conformances:
              </p>
              <div
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#fef2f2',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #fecaca',
                }}
              >
                <h4
                  style={{ color: '#991b1b', fontSize: 'var(--font-size-sm)' }}
                >
                  Audit Finding #1: Emergency Exit Blockage
                </h4>
                <p
                  style={{
                    color: '#7f1d1d',
                    fontSize: 'var(--font-size-xs)',
                    marginTop: '0.25rem',
                  }}
                >
                  Fabric rolls near Line 1 exit have been relocated to warehouse
                  racking. Line demarcation repainted in high-visibility yellow.
                </p>
                <span
                  className="badge badge-success"
                  style={{ marginTop: '0.5rem' }}
                >
                  Remediation Completed &amp; Signed
                </span>
              </div>
            </div>
            <div className="c2s-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowReassessmentModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert('Signed remediation affidavit generated!');
                  setShowReassessmentModal(false);
                }}
              >
                Sign-off Reassessment
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ReportsCompliance;
