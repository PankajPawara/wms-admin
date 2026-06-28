import React, { useState } from 'react';
import { Search, Eye, Filter, Calendar } from 'lucide-react';

const dummyHistory = [
  { id: 1, memo: 'MEMO-2026-0080', customer: 'Global Spares', items: 15, status: 'checked', date: '2026-06-24 10:30' },
  { id: 2, memo: 'MEMO-2026-0081', customer: 'Apex Motors', items: 8, status: 'checked', date: '2026-06-24 11:15' },
  { id: 3, memo: 'MEMO-2026-0082', customer: 'City Garage', items: 42, status: 'cancelled', date: '2026-06-24 14:05' },
];

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Order History</h1>
        <button className="btn btn-secondary">
          <Calendar size={18} />
          Last 30 Days
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search memo or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Memo No</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Completed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyHistory.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.memo}</td>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td>
                    {order.status === 'checked' && <span className="badge badge-success">Completed</span>}
                    {order.status === 'cancelled' && <span className="badge badge-danger">Cancelled</span>}
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{order.date}</td>
                  <td>
                    <button className="icon-btn" style={{ width: '32px', height: '32px' }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
