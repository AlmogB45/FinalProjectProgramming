import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase/config';
import { collection, query, where, getDoc, getDocs, deleteDoc, updateDoc, doc, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        totalItems: 0,
        totalUsers: 0,
        totalReports: 0,
        pendingReports: 0
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    // Checks if user is admin (as designated in Firebase)
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    toast.error('Please log in first');
                    navigate('/');
                    return;
                }

                const userDocRef = doc(db, 'Users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    toast.error('User document not found');
                    navigate('/mainpage');
                    return;
                }

                const userData = userDoc.data();

                if (!userData.isAdmin) {
                    navigate('/mainpage');
                    return;
                }

                console.log("Admin check passed!");
                setLoading(false);

            } catch (error) {
                console.error('Error checking admin status:', error);
                toast.error('Error checking admin status');
            }
        };

        checkAdmin();
    }, [navigate]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Starting to fetch counts...");

                // Get counts
                const usersCount = await getCountFromServer(collection(db, 'Users'));
                const itemsCount = await getCountFromServer(collection(db, 'Items'));
                const reportsCount = await getCountFromServer(collection(db, 'reports'));
                const pendingReportsCount = await getCountFromServer(query(
                    collection(db, 'reports'),
                    where('status', '==', 'pending')
                ));

                // Fetch the reports
                const reportsQuery = query(
                    collection(db, 'reports'),
                    orderBy('timestamp', 'desc'),
                    limit(50)  // Limit to most recent 50 reports
                );

                const reportsSnapshot = await getDocs(reportsQuery);
                const reportsData = reportsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setReports(reportsData);
                setStats({
                    totalUsers: usersCount.data().count,
                    totalItems: itemsCount.data().count,
                    totalReports: reportsCount.data().count,
                    pendingReports: pendingReportsCount.data().count
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handles the report actions (Delete, Resolve, Dismiss)
    const handleReportAction = async (reportId, action) => {
        try {
            if (action === 'delete') {
                // Add confirmation before deletion
                if (window.confirm('Are you sure you want to delete this report?')) {
                    await deleteDoc(doc(db, 'reports', reportId));

                    // Remove from local state
                    setReports(reports.filter(report => report.id !== reportId));

                    // Update the stats
                    setStats(prev => ({
                        ...prev,
                        totalReports: prev.totalReports - 1,
                        pendingReports: prev.pendingReports - (reports.find(r => r.id === reportId)?.status === 'pending' ? 1 : 0)
                    }));

                    toast.success('Report deleted successfully');
                }
            } else {
                const reportRef = doc(db, 'reports', reportId);
                await updateDoc(reportRef, {
                    status: action,
                    resolvedBy: auth.currentUser.email,
                    resolvedAt: new Date().toISOString()
                });

                // Update local state
                setReports(reports.map(report =>
                    report.id === reportId
                        ? { ...report, status: action }
                        : report
                ));

                toast.success(`Report ${action} successfully`);
            }
        } catch (error) {
            console.error('Error updating report:', error);
            toast.error('Failed to update report');
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading dashboard...</div>;
    }

    // Renders the overview window
    const renderOverview = () => (
        <div className="overview-grid">
            <div className="stat-card">
                <h3>Total Items</h3>
                <p>{stats.totalItems}</p>
            </div>
            <div className="stat-card">
                <h3>Total Users</h3>
                <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
                <h3>Total Reports</h3>
                <p>{stats.totalReports}</p>
            </div>
            <div className="stat-card">
                <h3>Pending Reports</h3>
                <p>{stats.pendingReports}</p>
            </div>
        </div>
    );

    // Renders the report cards
    const renderReports = () => (
        <div className="reports-container">
            <h2>Recent Reports</h2>
            <div className="reports-grid">
                {reports.map(report => (
                    <div key={report.id} className={`report-card ${report.status}`}>
                        <h3>Report #{report.id.slice(0, 6)}</h3>
                        <p><strong>Item:</strong> {report.itemTitle}</p>
                        <p><strong>Item ID:</strong>
                            <Link
                                to={`/item/${report.itemId}`}
                                className="item-link"
                            >
                                {report.itemId}
                            </Link>
                        </p>
                        <p><strong>Reason:</strong> {report.reason}</p>
                        <p><strong>Status:</strong> {report.status}</p>
                        <p><strong>Reported by:</strong> {report.reporterEmail}</p>
                        <p><strong>Description:</strong> {report.description}</p>
                        {report.status === 'pending' && (
                            <div className="report-actions">
                                <button
                                    onClick={() => handleReportAction(report.id, 'resolved')}
                                    className="resolve-btn"
                                >
                                    Resolve
                                </button>
                                <button
                                    onClick={() => handleReportAction(report.id, 'dismissed')}
                                    className="dismiss-btn"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => handleReportAction(report.id, 'delete')}
                            className="delete-btn"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <Navbar />
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="tab-navigation">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={activeTab === 'reports' ? 'active' : ''}
                        onClick={() => setActiveTab('reports')}
                    >
                        Reports
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' ? renderOverview() : renderReports()}
            </div>
        </div>
    );
};

export default AdminDashboard;