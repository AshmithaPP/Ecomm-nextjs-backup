"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import './myOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { token } = useAuthStore();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!token) {
                    router.push('/login?redirect=/orders');
                    return;
                }
                const response = await fetch(`${API_BASE}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                console.log('📦 My Orders Response:', data);
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    if (loading) return <div className="orders-loading">Loading your orders...</div>;

    return (
        <div className="my-orders-container">
            <h1 className="orders-title">My Orders</h1>
            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <button onClick={() => router.push('/products')}>Start Shopping</button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.order_id} className="order-card" onClick={() => router.push(`/order-confirmation/${order.order_id}`)}>
                            <div className="order-header">
                                <span className="order-number">Order #{order.order_number}</span>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {order.shipment_status && order.shipment_status !== 'Pending' && (
                                        <span className="shipment-status-badge" style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: 
                                                order.shipment_status.toLowerCase() === 'delivered' ? '#dcfce7' :
                                                order.shipment_status.toLowerCase() === 'shipped' ? '#fef3c7' :
                                                order.shipment_status.toLowerCase() === 'out for delivery' ? '#e0f2fe' : '#f3e8ff',
                                            color: 
                                                order.shipment_status.toLowerCase() === 'delivered' ? '#15803d' :
                                                order.shipment_status.toLowerCase() === 'shipped' ? '#b45309' :
                                                order.shipment_status.toLowerCase() === 'out for delivery' ? '#0369a1' : '#6b21a8',
                                        }}>
                                            {order.shipment_status}
                                        </span>
                                    )}
                                    <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>{order.status}</span>
                                </div>
                            </div>
                            <div className="order-summary">
                                <span>Placed on: {new Date(order.created_at).toLocaleDateString()}</span>
                                <span>Total: ₹{order.total_amount}</span>
                                {order.tracking_id && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', marginTop: '6px', width: '100%' }}>
                                        <div><strong>Courier:</strong> {order.courier_name}</div>
                                        <div><strong>Tracking ID:</strong> {order.tracking_id}</div>
                                    </div>
                                )}
                            </div>
                            <div className="order-actions" style={{ marginTop: '10px' }}>
                                <button 
                                    className="btn-track"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (order.tracking_id) {
                                            window.open(order.tracking_url || 'https://www.stcourier.com/track/shipment', '_blank');
                                        } else {
                                            router.push(`/order-confirmation/${order.order_id}`);
                                        }
                                    }}
                                >
                                    {order.tracking_id ? 'Track Order ↗' : 'View Details'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
