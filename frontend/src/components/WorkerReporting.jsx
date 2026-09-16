import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { safetyAPI } from '../api';
import './WorkerReporting.css';

const WorkerReporting = () => {
  const [data, setData] = useState({ summary: {}, reports: [] });
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'history', 'resolve-history'

  // Modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Forms
  const [resolveForm, setResolveForm] = useState({
    resolution_notes_bn: '',
    resolution_notes_en: '',
  });

  const [newReportForm, setNewReportForm] = useState({
    title: '',
    category: 'Public Safety',
    severity: 'Major',
    location: '',
    description_bn: '',
    description_en: '',
  });

  useEffect(() => {
    loadSafetyReports();
  }, []);

  const loadSafetyReports = async () => {
    setLoading(true);
    const res = await safetyAPI.getReports();
    if (res.data?.success) {
      setData(res.data.data);
    }
    setLoading(false);
  };

  const handleOpenDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleOpenResolve = (report) => {
    setSelectedReport(report);
    setResolveForm({
      resolution_notes_bn: 'সমস্যাটি কার্যকরভাবে সমাধান ও মেরামত করা হয়েছে।',
      resolution_notes_en:
        'Defect inspected and permanently resolved by factory engineering.',
    });
    setShowResolveModal(true);
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    await safetyAPI.resolveReport({
      report_id: selectedReport?.id,
      ...resolveForm,
    });
    alert(`Incident "${selectedReport?.title}" marked as Resolved!`);
    setShowResolveModal(false);
    loadSafetyReports();
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!newReportForm.title || !newReportForm.description_bn) {
      alert('বাংলা বিবরণ এবং শিরোনাম আবশ্যক');
      return;
    }
    await safetyAPI.submitReport(newReportForm);
    alert(
      'নিরাপত্তা প্রতিবেদন সফলভাবে দাখিল হয়েছে! (Safety report submitted)',
    );
    setShowNewReportModal(false);
    loadSafetyReports();
  };

  const reportsList = data.reports || [];
  const resolvedReports = reportsList.filter((r) => r.status === 'Resolved');

  return (
    <Layout>
      <div className="safety-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">
              Worker Safety & Incident Reporting (শ্রমিক নিরাপত্তা)
            </h1>
            <p className="page-subtitle">
              Bangla-first hazard mitigation, non-intimidating incident logging,
              and compliance audit trail
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowNewReportModal(true)}
            >
              <i className="fas fa-plus-circle"></i> অভিযোগ দায়ের (New Safety
              Report)
            </button>
            <button
              className={`btn ${currentView === 'history' ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() =>
                setCurrentView(currentView === 'main' ? 'history' : 'main')
              }
            >
              <i className="fas fa-history"></i>{' '}
              {currentView === 'main'
                ? 'View All Reports (History)'
                : 'Main Safety View'}
            </button>
            <button
              className={`btn ${currentView === 'resolve-history' ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() =>
                setCurrentView(
                  currentView === 'resolve-history'
                    ? 'main'
                    : 'resolve-history',
                )
              }
            >
              <i className="fas fa-check-circle"></i> Resolve History
            </button>
          </div>
        </div>

        {/* View 1: Main View */}
        {currentView === 'main' && (
          <>
            {/* Summary Counters */}
            <div className="summary-cards">
              <div className="summary-card unresolved">
                <div className="summary-card-header">
                  <span className="summary-card-title">Unresolved Reports</span>
                  <div className="summary-card-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                </div>
                <div className="summary-card-value">
                  {data.summary?.unresolved || 2}
                </div>
                <span className="summary-card-sub">
                  Immediate inspection mandated
                </span>
              </div>

              <div className="summary-card pending">
                <div className="summary-card-header">
                  <span className="summary-card-title">Pending Reports</span>
                  <div className="summary-card-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
                <div className="summary-card-value">
                  {data.summary?.pending || 2}
                </div>
                <span className="summary-card-sub">
                  Investigation under review
                </span>
              </div>

              <div className="summary-card resolved">
                <div className="summary-card-header">
                  <span className="summary-card-title">
                    Resolved This Month
                  </span>
                  <div className="summary-card-icon">
                    <i className="fas fa-shield-check"></i>
                  </div>
                </div>
                <div className="summary-card-value">
                  {data.summary?.resolved || 4}
                </div>
                <span className="summary-card-sub">Audited and verified</span>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="reports-section">
              <div className="section-title-row">
                <h2>Recent Incident Reports (Last 30 Days)</h2>
                <span className="badge badge-info">
                  {reportsList.length} Total Reports
                </span>
              </div>

              {loading ? (
                <div className="loading-state">Loading safety incidents...</div>
              ) : (
                <div className="reports-grid">
                  {reportsList.map((report) => (
                    <div key={report.id} className="report-card">
                      <div className="report-card-header">
                        <h3>{report.title}</h3>
                        <span
                          className={`badge ${
                            report.severity === 'Critical'
                              ? 'badge-danger'
                              : report.severity === 'Major'
                                ? 'badge-warning'
                                : 'badge-info'
                          }`}
                        >
                          {report.severity}
                        </span>
                      </div>

                      <div className="report-card-body">
                        <div className="report-detail-item">
                          <i className="fas fa-calendar"></i>
                          <span>{report.incident_date}</span>
                        </div>
                        <div className="report-detail-item">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{report.location}</span>
                        </div>
                        <div className="report-detail-item">
                          <i className="fas fa-user-circle"></i>
                          <span>Reported by: {report.reported_by_name}</span>
                        </div>
                        <p className="bangla-preview">
                          <strong>বিবরণ:</strong> {report.description_bn}
                        </p>
                      </div>

                      <div className="report-card-footer">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenDetails(report)}
                        >
                          <i className="fas fa-eye"></i> View Details
                        </button>
                        {report.status === 'Resolved' ? (
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={() => handleOpenDetails(report)}
                          >
                            <i className="fas fa-check"></i> View Results
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenResolve(report)}
                          >
                            <i className="fas fa-wrench"></i> Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* View 2: All Reports History (Figma node-id=1-55958) */}
        {currentView === 'history' && (
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Safety Incidents Complete History Ledger</h2>
              <span className="badge badge-info">
                {reportsList.length} Incidents
              </span>
            </div>
            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Report Code</th>
                    <th>Incident Title</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsList.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.report_code}</strong>
                      </td>
                      <td>{r.title}</td>
                      <td>{r.incident_date}</td>
                      <td>{r.category}</td>
                      <td>
                        <span
                          className={`badge ${r.severity === 'Critical' ? 'badge-danger' : 'badge-warning'}`}
                        >
                          {r.severity}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${r.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenDetails(r)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 3: Resolve History (Figma node-id=1-55945) */}
        {currentView === 'resolve-history' && (
          <div className="attendance-table-card">
            <div className="table-header-row">
              <h2>Safety Incidents Resolved History & Audit Trail</h2>
              <span className="badge badge-success">
                {resolvedReports.length} Resolved Cases
              </span>
            </div>
            <div className="table-responsive">
              <table className="c2s-table">
                <thead>
                  <tr>
                    <th>Report Code</th>
                    <th>Hazard Title</th>
                    <th>Date Resolved</th>
                    <th>Mitigation Notes (বাংলা)</th>
                    <th>Audit Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedReports.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.report_code}</strong>
                      </td>
                      <td>{r.title}</td>
                      <td>{r.incident_date}</td>
                      <td>{r.resolution_notes || 'মেরামত সম্পন্ন হয়েছে'}</td>
                      <td>
                        <span className="badge badge-success">
                          Audited & Closed
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenDetails(r)}
                        >
                          View Results
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

      {/* Modal 1: Report Details View (Figma node-id=1-55883) */}
      {showDetailsModal && selectedReport && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>নিরাপত্তা প্রতিবেদনের বিস্তারিত (Safety Incident Details)</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="c2s-modal-body">
              <div className="dossier-grid">
                <div className="dossier-item">
                  <span className="dossier-label">Tracking Code</span>
                  <span className="dossier-val">
                    {selectedReport.report_code}
                  </span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Incident Date</span>
                  <span className="dossier-val">
                    {selectedReport.incident_date}
                  </span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Severity</span>
                  <span
                    className={`badge ${selectedReport.severity === 'Critical' ? 'badge-danger' : 'badge-warning'}`}
                  >
                    {selectedReport.severity}
                  </span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Location</span>
                  <span className="dossier-val">{selectedReport.location}</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  backgroundColor: '#fef3c7',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #fde68a',
                }}
              >
                <h4 style={{ color: '#92400e', marginBottom: '0.25rem' }}>
                  শ্রমিকের ভাষায় বিবরণ (Bengali Report):
                </h4>
                <p
                  style={{ color: '#78350f', fontSize: 'var(--font-size-sm)' }}
                >
                  {selectedReport.description_bn}
                </p>
              </div>

              {selectedReport.description_en && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    backgroundColor: 'var(--color-neutral-50)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <h4
                    style={{
                      color: 'var(--color-neutral-700)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    English Translation:
                  </h4>
                  <p
                    style={{
                      color: 'var(--color-neutral-600)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {selectedReport.description_en}
                  </p>
                </div>
              )}

              {selectedReport.resolution_notes && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    backgroundColor: '#ecfdf5',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  <h4 style={{ color: '#065f46', marginBottom: '0.25rem' }}>
                    সমাধানের রেকর্ড (Resolution Notes):
                  </h4>
                  <p
                    style={{
                      color: '#047857',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {selectedReport.resolution_notes}
                  </p>
                </div>
              )}
            </div>
            <div className="c2s-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              {selectedReport.status !== 'Resolved' && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleOpenResolve(selectedReport);
                  }}
                >
                  <i className="fas fa-wrench"></i> Proceed to Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Resolve Report (Figma node-id=1-55930) */}
      {showResolveModal && selectedReport && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>
                নিরাপত্তা ত্রুটি প্রতিকার (Resolve Incident:{' '}
                {selectedReport.report_code})
              </h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowResolveModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleConfirmResolve}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">Incident</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedReport.title}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    সমাধান ও প্রতিকারমূলক কাজের বিবরণ (বাংলা)
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={resolveForm.resolution_notes_bn}
                    onChange={(e) =>
                      setResolveForm({
                        ...resolveForm,
                        resolution_notes_bn: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Engineering Mitigation Notes (English)
                  </label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={resolveForm.resolution_notes_en}
                    onChange={(e) =>
                      setResolveForm({
                        ...resolveForm,
                        resolution_notes_en: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowResolveModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-check-double"></i> Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Submit New Report (Bengali First) */}
      {showNewReportModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>নতুন নিরাপত্তা অভিযোগ / ত্রুটি দাখিল (New Safety Hazard)</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowNewReportModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateReport}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">বিষয় / শিরোনাম (Title)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="যেমন: সুইং লাইনে খোলা তার বা পিচ্ছিল মেঝে"
                    value={newReportForm.title}
                    onChange={(e) =>
                      setNewReportForm({
                        ...newReportForm,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">বিভাগ / স্থান (Location)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="যেমন: লাইন ৩, পূর্ব পাশের সিঁড়ি"
                    value={newReportForm.location}
                    onChange={(e) =>
                      setNewReportForm({
                        ...newReportForm,
                        location: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    ঝুঁকির মাত্রা (Severity Level)
                  </label>
                  <select
                    className="form-control"
                    value={newReportForm.severity}
                    onChange={(e) =>
                      setNewReportForm({
                        ...newReportForm,
                        severity: e.target.value,
                      })
                    }
                  >
                    <option value="Minor">Minor (সাধারণ)</option>
                    <option value="Major">Major (গুরুত্বপূর্ণ)</option>
                    <option value="Critical">Critical (জরুরী বিপজ্জনক)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    সমস্যার বিস্তারিত বিবরণ (বাংলায় লিখুন)
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="কী ধরনের ঝুঁকি বা ত্রুটি দেখেছেন তা নিজের ভাষায় লিখুন..."
                    value={newReportForm.description_bn}
                    onChange={(e) =>
                      setNewReportForm({
                        ...newReportForm,
                        description_bn: e.target.value,
                      })
                    }
                    required
                  ></textarea>
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewReportModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-paper-plane"></i> দাখিল করুন (Submit
                  Report)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WorkerReporting;
