import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye, Filter, Loader2 } from 'lucide-react';
import { getOrders } from '../api/orders.api';
import { formatDate } from '../utils/format';
import '../styles/pages.css';

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const orders = response?.data || [];
  
  // Filter for active orders
  const activeOrders = orders.filter(order => order.status !== 'completed');

  // Apply search filter
  const filtered = activeOrders.filter(order => 
    order.memo_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container page-enter">
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
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Showing {filtered.length} active orders
          </span>
        </div>

        <div className="table-container">
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <Loader2 size={24} className="spin" style={{ margin: '0 auto', display: 'block', marginBottom: '1rem' }} />
              Loading orders...
            </div>
          ) : isError ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-danger)' }}>
              Failed to load orders.
            </div>
          ) : (
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
                {filtered.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 500 }}>{order.memo_number}</td>
                    <td>{order.customer_name || 'N/A'}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>
                      {order.status === 'picking' && <span className="badge badge-warning">Picking</span>}
                      {order.status === 'pending_checking' && <span className="badge badge-info">Pending Checking</span>}
                      {order.status === 'draft' && <span className="badge" style={{backgroundColor: 'var(--color-border)', color: 'var(--color-text-primary)'}}>Draft</span>}
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(order.createdAt)}</td>
                    <td>
                      <button className="icon-btn" style={{ width: '32px', height: '32px' }} title="View Details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filtered.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No active orders found {searchTerm ? `matching "${searchTerm}"` : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
