import React, { useState } from 'react';
import { db, auth } from '../Firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../CSS/ReportModal.css'

const ReportModal = ({ itemId, itemTitle, isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!auth.currentUser) {
      toast.error('Please log in to submit a report');
      return;
    }

    setIsSubmitting(true);

    try {
      // Add reporter data and clean up the submission
      const reportData = {
        itemId,
        itemTitle,
        reason,
        description,
        timestamp: serverTimestamp(),
        status: 'pending',
        reporterId: auth.currentUser.uid,
        reporterEmail: auth.currentUser.email, // Admin reference
        // Basic item data for reference
        itemData: {
          id: itemId,
          title: itemTitle,
          reportedAt: new Date().toISOString()
        }
      };

      await addDoc(collection(db, 'reports'), reportData);

      toast.success('Report submitted successfully');
      setReason('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      // More specific error messages
      if (error.code === 'permission-denied') {
        toast.error('You do not have permission to submit reports. Please make sure you are logged in.');
      } else {
        toast.error('Failed to submit report. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add login check in the UI
  const renderContent = () => {
    if (!auth.currentUser) {
      return (
        <div className="modal-content">
          <div className="modal-header">
            <h2>Report Item</h2>
            <button onClick={onClose} className="close-button">&times;</button>
          </div>
          <div className="login-required-message">
            <p>Please log in to submit a report.</p>
            <button onClick={onClose} className="cancel-button">Close</button>
          </div>
        </div>
      );
    }

    return (
      <div className="report-modal">
        <div className="report-modal-content">
          <div className="report-modal-header">
            <h2>Report Item</h2>
            <button onClick={onClose} className="report-close-button">&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reason">Reason for Report:</label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="spam">Spam</option>
                <option value="scam">Potential Scam</option>
                <option value="offensive">Offensive Content</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Additional Details:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                placeholder="Please provide more details about your report..."
              />
            </div>
            <div className="report-modal-footer">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {renderContent()}
    </div>
  );
};

export default ReportModal;