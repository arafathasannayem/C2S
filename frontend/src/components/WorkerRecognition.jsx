import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { workersAPI } from '../api';
import './WorkerRecognition.css';

const WorkerRecognition = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [rewardForm, setRewardForm] = useState({
    reward_type: 'bonus',
    title: 'Top Monthly Performer Award',
    bonus_amount: 5000,
    description:
      'Consistent zero-defect stitching performance on high-volume production line.',
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    setLoading(true);
    const res = await workersAPI.getWorkers();
    if (res.data?.success) {
      setWorkers(res.data.data);
    }
    setLoading(false);
  };

  const handleOpenReward = (worker) => {
    setSelectedWorker(worker);
    setShowRewardModal(true);
  };

  const handleConfirmReward = async (e) => {
    e.preventDefault();
    await workersAPI.awardRecognition({
      worker_id: selectedWorker?.id,
      ...rewardForm,
    });
    alert(
      `Reward granted to ${selectedWorker?.full_name}! Bonus amount: BDT ${rewardForm.bonus_amount}`,
    );
    setShowRewardModal(false);
  };

  return (
    <Layout>
      <div className="recognition-page">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Worker Recognition & Rewards</h1>
            <p className="page-subtitle">
              Motivate operators through transparent rating-based performance
              appraisals and incentive bonuses
            </p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => alert('Exporting Recognition Ledger...')}
            >
              <i className="fas fa-file-export"></i> Export Ledger
            </button>
          </div>
        </div>

        {/* Hero Highlights */}
        <div className="reward-stats-grid">
          <div className="reward-stat-card gold">
            <div className="reward-stat-icon">
              <i className="fas fa-crown"></i>
            </div>
            <div className="reward-stat-info">
              <span className="label">Monthly Leaderboard #1</span>
              <h3>Taskin Amir</h3>
              <p>95% Production Target Completion</p>
            </div>
          </div>

          <div className="reward-stat-card emerald">
            <div className="reward-stat-icon">
              <i className="fas fa-medal"></i>
            </div>
            <div className="reward-stat-info">
              <span className="label">Zero Defect Star</span>
              <h3>Riya Akter</h3>
              <p>30 Days Consecutive Defect-Free QC</p>
            </div>
          </div>

          <div className="reward-stat-card blue">
            <div className="reward-stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="reward-stat-info">
              <span className="label">Efficiency Champion</span>
              <h3>Hosain Masba</h3>
              <p>+20% Finishing Output Improvement</p>
            </div>
          </div>
        </div>

        {/* Worker Cards Grid */}
        <div className="worker-cards-section">
          <div className="section-title-row">
            <h2>Top Rated Operators & Nominees</h2>
            <span className="badge badge-info">
              {workers.length} Top Performers
            </span>
          </div>

          {loading ? (
            <div className="loading-state">Loading worker records...</div>
          ) : (
            <div className="recognition-grid">
              {workers.map((worker) => (
                <div key={worker.id} className="recognition-card">
                  <div className="card-top-header">
                    <div className="worker-avatar-large">
                      {worker.full_name?.charAt(0)}
                    </div>
                    <div className="score-pill">
                      <i
                        className="fas fa-star"
                        style={{ color: 'var(--color-accent-500)' }}
                      ></i>
                      <span>{worker.score}%</span>
                    </div>
                  </div>

                  <div className="card-worker-details">
                    <h3>{worker.full_name}</h3>
                    <div className="detail-tag">
                      {worker.employee_id} • {worker.department}
                    </div>
                    <div className="skill-indicator">
                      <span className="skill-label">Role:</span>{' '}
                      {worker.position} ({worker.skill_level})
                    </div>
                    <p className="achievement-quote">
                      <i className="fas fa-quote-left"></i> {worker.achievement}
                    </p>
                  </div>

                  <div className="card-action-bar">
                    <span
                      className={`badge ${worker.badge === 'PROMOTED' ? 'badge-warning' : 'badge-success'}`}
                    >
                      {worker.badge}
                    </span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenReward(worker)}
                    >
                      <i className="fas fa-gift"></i> Confer Award
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Award Modal */}
      {showRewardModal && (
        <div className="c2s-modal-overlay">
          <div className="c2s-modal-dialog">
            <div className="c2s-modal-header">
              <h2>Confer Reward to {selectedWorker?.full_name}</h2>
              <button
                className="c2s-modal-close"
                onClick={() => setShowRewardModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleConfirmReward}>
              <div className="c2s-modal-body">
                <div className="form-group">
                  <label className="form-label">Reward Category</label>
                  <select
                    className="form-control"
                    value={rewardForm.reward_type}
                    onChange={(e) =>
                      setRewardForm({
                        ...rewardForm,
                        reward_type: e.target.value,
                      })
                    }
                  >
                    <option value="bonus">Cash Incentive Bonus</option>
                    <option value="promotion">Role Promotion</option>
                    <option value="best_performer">
                      Best Performer of Month
                    </option>
                    <option value="zero_defect_award">Zero Defect Star</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Award Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={rewardForm.title}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bonus Amount (BDT)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={rewardForm.bonus_amount}
                    onChange={(e) =>
                      setRewardForm({
                        ...rewardForm,
                        bonus_amount: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Citation & Remarks</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={rewardForm.description}
                    onChange={(e) =>
                      setRewardForm({
                        ...rewardForm,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <div className="c2s-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRewardModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WorkerRecognition;
