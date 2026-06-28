import React, { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';

const dummyOrders = [
  { id: 1, memo: 'MEMO-2026-0089', customer: 'Apex Motors', items: 12, status: 'picking', date: '2026-06-25 14:30' },
  { id: 2, memo: 'MEMO-2026-0090', customer: 'Global Spares', items: 5, status: 'pending_checking', date: '2026-06-25 15:10' },
  { id: 3, memo: 'MEMO-2026-0091', customer: 'City Garage', items: 28, status: 'draft', date: '2026-06-25 16:05' },
];

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Active Orders</h1>
        <button className="btn btn-secondary">
          <Filter size={18} />
          Filter
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
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.memo}</td>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td>
                    {order.status === 'picking' && <span className="badge badge-warning">Picking</span>}
                    {order.status === 'pending_checking' && <span className="badge badge-info">Pending Checking</span>}
                    {order.status === 'draft' && <span className="badge" style={{backgroundColor: 'var(--color-border)', color: 'var(--color-text-primary)'}}>Draft</span>}
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

export default OrdersPage;
