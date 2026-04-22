import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const requests = [api.getOrders()];
        let itemsPromise: Promise<any[]> = Promise.resolve([]);
        if (api.getOrderItems) {
          itemsPromise = api.getOrderItems();
        }
        requests.push(itemsPromise as unknown as Promise<any[]>);

        const results = await Promise.all(requests);
        const allOrders = results[0] as any[];
        const items = results[1] as any[];

        const userOrders: any[] = [];
        for (let i = 0; i < allOrders.length; i += 1) {
          const order = allOrders[i];
          if (order.userId === user?.id) {
            userOrders.push(order);
          }
        }
        userOrders.reverse(); // Show newest first
        setOrders(userOrders);
        setOrderItems(items);
      } catch (e) {
        console.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="view">
        <div className="error">Please log in to view your orders</div>
        <Link to="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="view"><p>Loading orders...</p></div>;
  }

  const getOrderItems = (orderId: number) => {
    const matched: any[] = [];
    for (let i = 0; i < orderItems.length; i += 1) {
      const item = orderItems[i];
      if (item.orderId === orderId) {
        matched.push(item);
      }
    }
    return matched;
  };

  return (
    <div className="view">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't made any purchases. Start shopping now!</p>
          <Link to="/shop/all" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const items = getOrderItems(order.id);
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span className="order-label">Order</span>
                    <span className="order-number">#{order.id}</span>
                  </div>
                  <div className="order-status">
                    {(() => {
                      const isDone = !!order.status;
                      const statusClass = isDone ? 'completed' : 'pending';
                      const label = isDone ? '✓ Completed' : '⏱ Pending';
                      return (
                        <span className={`status-badge ${statusClass}`}>
                          {label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                <div className="order-body">
                  <div className="order-info">
                    <div className="info-row">
                      <span className="info-label">Date</span>
                      <span className="info-value">{new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Items</span>
                      <span className="info-value">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                    </div>
                  </div>
                  <div className="order-total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                {items.length > 0 && (
                  <div className="order-items">
                    <div className="items-label">Items in this order:</div>
                    <div className="items-grid">
                      {items.map((item: any) => (
                        <div key={item.id} className="item-summary">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-qty">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="orders-footer">
        <Link to="/shop/profile" className="btn-secondary">Back to Profile</Link>
        <Link to="/shop/all" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}
