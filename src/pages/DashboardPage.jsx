import React from 'react';
import { Package, ShoppingCart, Users, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import '../styles/pages.css';

const data = [
  { name: 'Mon', orders: 40, picked: 24 },
  { name: 'Tue', orders: 30, picked: 13 },
  { name: 'Wed', orders: 20, picked: 98 },
  { name: 'Thu', orders: 27, picked: 39 },
  { name: 'Fri', orders: 18, picked: 48 },
  { name: 'Sat', orders: 23, picked: 38 },
  { name: 'Sun', orders: 34, picked: 43 },
];

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <div className="date-picker-placeholder">
          <button className="btn btn-secondary">This Week</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon-wrapper purple">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Inventory</h3>
            <div className="stat-value">24,592</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper blue">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Orders</h3>
            <div className="stat-value">156</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Completed Today</h3>
            <div className="stat-value">48</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper orange">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Pickers</h3>
            <div className="stat-value">12</div>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="card chart-card">
          <h3>Order Volume vs Picked</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPicked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
              />
              <Area type="monotone" dataKey="orders" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorOrders)" />
              <Area type="monotone" dataKey="picked" stroke="var(--color-success)" fillOpacity={1} fill="url(#colorPicked)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h3>Recent Activity</h3>
          <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '50%', color: 'var(--color-text-secondary)' }}>
                  <Clock size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Order <strong>#MEMO-00{i}</strong> was checked</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
