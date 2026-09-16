import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { wasteAPI } from '../api';
import './WasteTracking.css';

const WasteTracking = () => {
  const [data, setData] = useState({ summary: {}, records: [] });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewWasteModal, setShowNewWasteModal] = useState(false);
  const [showPatternModal, setShowPatternModal] = useState(false);

  // Forms
  const [wasteForm, setWasteForm] = useState({
    line_id: 1,
    waste_type: 'Fabric Scraps',
    material: 'Denim 12oz',
    quantity_kg: 25,
    cost_usd: 100,
    reason: 'End-of-roll selvedge margin cut',
  });

  const [patternForm, setPatternForm] = useState({
    pattern_code: 'PAT-NEST-DENIM-04',
    fabric_type: 'Denim 12oz Stretch',
    nesting_yield_projected: 94.8,
    estimated_waste_reduction_kg: 45,
  });

  useEffect(() => {
    loadWasteData();
  }, []);

  const loadWasteData = async () => {
    setLoading(true);
    const res = await wasteAPI.getStats();
    if (res.data?.success) {
      setData(res.data.data);
    }
    setLoading(false);
  };

  const handleAddWaste = async (e) => {
    e.preventDefault();
    await wasteAPI.addWaste(wasteForm);
    alert('Waste log submitted successfully!');
    setShowNewWasteModal(false);
    loadWasteData();
  };

  const handleApplyPattern = async (e) => {
    e.preventDefault();
    await wasteAPI.applyPattern(patternForm);
    alert(
      `CAD Nesting Pattern "${patternForm.pattern_code}" applied to cutting floor! Projected yield: ${patternForm.nesting_yield_projected}%`,
    );
    setShowPatternModal(false);
  };

  return (
    <Layout>
      <div className="waste-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Waste Tracking & Sustainability</h1>
            <p className="page-subtitle">
              Monitor fabric cutting loss, material scrap valuation, and
              automated CAD pattern yield optimization
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowExportModal(true)}
            >
              <i className="fas fa-file-export"></i> Export Data
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowNewWasteModal(true)}
            >
              <i className="fas fa-plus"></i> New Waste
            </button>
            <button
              className="btn btn-accent"
              onClick={() => setShowPatternModal(true)}
            >
              <i className="fas fa-drafting-compass"></i> Apply New Pattern
            </button>
          </div>
        </div>

        {/* Waste Stats */}
        <div className="waste-stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Waste (Month)</span>
              <div className="stat-card-icon icon-red">
                <i className="fas fa-trash-alt"></i>
              </div>
            </div>
            <div className="stat-card-value">
              {data.summary?.total_waste_kg || 342.5} kg
            </div>
            <div className="stat-card-subtitle">-12.4% vs last month</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Estimated Cost Impact</span>
              <div className="stat-card-icon icon-yellow">
                <i className="fas fa-dollar-sign"></i>
              </div>
            </div>
            <div className="stat-card-value">
              ${data.summary?.total_cost_usd || 1370}
            </div>
            <div className="stat-card-subtitle">
              Scrap salvage offset active
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Recycling Diversion</span>
              <div className="stat-card-icon icon-green">
                <i className="fas fa-recycle"></i>
              </div>
            </div>
            <div className="stat-card-value">
              {data.summary?.recycling_rate_pct || 68.4}%
            </div>
            <div className="stat-card-subtitle">Sold to yarn re-spinners</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Fabric Yield Index</span>
              <div className="stat-card-icon icon-blue">
                <i className="fas fa-percentage"></i>
              </div>
            </div>
            <div className="stat-card-value">
              {data.summary?.fabric_utilization_pct || 89.2}%
            </div>
            <div className="stat-card-subtitle">Target &gt; 88%</div>
          </div>
        </div>

        {/* Waste Logs Table */}
        <div className="attendance-table-card">
          <div className="table-header-row">
            <h2>Floor Material Waste Ledger</h2>
            <span className="badge badge-info">
              {data.records?.length || 0} Entries
            </span>
          </div>

          <div className="table-responsive">
            <table className="c2s-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source Line</th>
                  <th>Waste Category</th>
                  <th>Material Type</th>
                  <th>Quantity (kg)</th>
                  <th>Est. Cost ($)</th>
                  <th>Scrap Reason</th>
                </tr>
              </thead>
              <tbody>
                {(data.records || []).map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.date}</td>
                    <td>
                      <span className="badge badge-info">{rec.line_name}</span>
                    </td>
                    <td>
                      <strong>{rec.waste_type}</strong>
                    </td>
                    <td>{rec.material}</td>
                    <td>{rec.quantity_kg} kg</td>
                    <td>${rec.cost_usd}</td>
                    <td>{rec.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal 1: Export Data / Export Report3 (Figma node-id=1-60274) */}
      {showExportModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Export Waste & Sustainability Report</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowExportModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="c2s-modal-body">
              <p className="modal-description">
                Configure format and parameters for export report3 dossier:
              </p>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Report Period</label>
                <select className="form-control">
                  <option>Current Month (September 2026)</option>
                  <option>Previous Quarter (Q2 2026)</option>
                  <option>Year to Date (2026)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Export Format</label>
                <div
                  style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <input type="radio" name="format" defaultChecked /> Excel
                    (.xlsx)
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <input type="radio" name="format" /> PDF Dossier (.pdf)
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <input type="radio" name="format" /> CSV (.csv)
                  </label>
                </div>
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
                  alert('Downloading export report3...');
                  setShowExportModal(false);
                }}
              >
                <i className="fas fa-file-download"></i> Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: New Waste / Export New Waste (Figma node-id=1-58781) */}
      {showNewWasteModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Log New Production Waste</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowNewWasteModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleAddWaste}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">Originating Line</label>
                  <select
                    className="form-control"
                    value={wasteForm.line_id}
                    onChange={(e) =>
                      setWasteForm({
                        ...wasteForm,
                        line_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="1">Line-A (Sewing)</option>
                    <option value="2">Line-B (Sewing)</option>
                    <option value="3">Line-C (Finishing)</option>
                    <option value="4">Line-D (Cutting & QC)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Waste Type</label>
                  <select
                    className="form-control"
                    value={wasteForm.waste_type}
                    onChange={(e) =>
                      setWasteForm({ ...wasteForm, waste_type: e.target.value })
                    }
                  >
                    <option value="Fabric Scraps">Fabric Scraps</option>
                    <option value="Yarn Waste">Yarn Waste</option>
                    <option value="Defective Trims">
                      Defective Trims / Zippers
                    </option>
                    <option value="Packaging Plastic">
                      Packaging Poly Bags
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Material Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={wasteForm.material}
                    onChange={(e) =>
                      setWasteForm({ ...wasteForm, material: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Scrap Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={wasteForm.quantity_kg}
                    onChange={(e) =>
                      setWasteForm({
                        ...wasteForm,
                        quantity_kg: Number(e.target.value),
                        cost_usd: Number(e.target.value) * 4,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason / Scrap Cause</label>
                  <input
                    type="text"
                    className="form-control"
                    value={wasteForm.reason}
                    onChange={(e) =>
                      setWasteForm({ ...wasteForm, reason: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowNewWasteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-check"></i> Submit Waste Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Apply New Pattern (Figma node-id=1-60479) */}
      {showPatternModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Apply New CAD Nesting Pattern</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowPatternModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleApplyPattern}>
              <div className="c2s-modal-body">
                <p className="modal-description">
                  Deploy AI-optimized pattern nesting layout to automated
                  cutting tables to maximize fabric utilization.
                </p>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Pattern Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={patternForm.pattern_code}
                    onChange={(e) =>
                      setPatternForm({
                        ...patternForm,
                        pattern_code: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fabric Specification</label>
                  <input
                    type="text"
                    className="form-control"
                    value={patternForm.fabric_type}
                    onChange={(e) =>
                      setPatternForm({
                        ...patternForm,
                        fabric_type: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Projected Nesting Yield (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={patternForm.nesting_yield_projected}
                    onChange={(e) =>
                      setPatternForm({
                        ...patternForm,
                        nesting_yield_projected: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Estimated Waste Reduction (kg/run)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={patternForm.estimated_waste_reduction_kg}
                    onChange={(e) =>
                      setPatternForm({
                        ...patternForm,
                        estimated_waste_reduction_kg: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPatternModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent">
                  <i className="fas fa-bolt"></i> Apply Pattern to Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WasteTracking;
