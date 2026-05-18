"use client";

import React, { useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { IMAGE_BASE } from '@/config/api';
import sareeImageFallback from 'assets/images/silk/collection1.png';
import toast from 'react-hot-toast';
import Link from 'next/link';

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [trackData, setTrackData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { trackGuestOrder } = useOrderStore();

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim() || !phone.trim()) {
            toast.error('Please enter both Order ID and Phone Number.');
            return;
        }

        setLoading(true);
        setTrackData(null);
        
        const result = await trackGuestOrder(orderId.trim(), phone.trim());
        setLoading(false);

        if (result.success) {
            setTrackData(result.data);
            toast.success('Order status loaded!');
        } else {
            toast.error(result.message || 'Could not find a matching order.');
        }
    };

    return (
        <div className="container py-5" style={{ minHeight: '80vh', fontFamily: 'Jost, sans-serif' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {/* Track Form Card */}
                    <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px', background: '#fff' }}>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold" style={{ color: '#800000' }}>Track Your Order</h2>
                            <p className="text-muted">Enter your order details below to see real-time transit and shipment status.</p>
                        </div>

                        <form onSubmit={handleTrack} className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '0.9rem' }}>Order ID or Number</label>
                                <input
                                    type="text"
                                    className="form-control py-2 px-3"
                                    placeholder="e.g. ORD09504279626 or UUID"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ color: '#4a5568', fontSize: '0.9rem' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control py-2 px-3"
                                    placeholder="e.g. 09823456782"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                    required
                                />
                            </div>
                            <div className="col-12 mt-4 text-center">
                                <button
                                    type="submit"
                                    className="btn px-5 py-2 fw-semibold text-white"
                                    disabled={loading}
                                    style={{
                                        background: '#800000',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 12px rgba(128, 0, 0, 0.15)'
                                    }}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    Track Order
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Result Details Container */}
                    {trackData && (
                        <div className="fade-in animate-slide-up">
                            
                            {/* Summary / Delivery Header */}
                            <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px', background: '#fff' }}>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <div>
                                        <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>Order #{trackData.order_number}</h5>
                                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>ID: {trackData.order_id}</span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <span className="badge px-3 py-2 text-uppercase" style={{
                                            borderRadius: '20px',
                                            background: trackData.status?.toLowerCase() === 'delivered' ? '#dcfce7' : '#fef3c7',
                                            color: trackData.status?.toLowerCase() === 'delivered' ? '#15803d' : '#b45309',
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }}>
                                            Order: {trackData.status}
                                        </span>
                                        <span className="badge px-3 py-2 text-uppercase" style={{
                                            borderRadius: '20px',
                                            background: trackData.payment_status?.toLowerCase() === 'paid' ? '#dcfce7' : '#fee2e2',
                                            color: trackData.payment_status?.toLowerCase() === 'paid' ? '#15803d' : '#991b1b',
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }}>
                                            Payment: {trackData.payment_status}
                                        </span>
                                    </div>
                                </div>

                                <div className="row g-4">
                                    {/* Courier Details */}
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3" style={{ color: '#800000', fontSize: '0.9rem' }}>🚚 SHIPMENT & TRACKING</h6>
                                        <div className="p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Courier Name</span>
                                                <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{trackData.tracking?.courier || 'Pending shipment assignment'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Tracking ID</span>
                                                <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{trackData.tracking?.id || 'Not available'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="text-muted" style={{ fontSize: '0.85rem' }}>Shipment Status</span>
                                                <span className="badge px-2 py-1" style={{
                                                    fontSize: '0.75rem',
                                                    background: 
                                                        trackData.delivery_status?.toLowerCase() === 'delivered' ? '#dcfce7' :
                                                        trackData.delivery_status?.toLowerCase() === 'shipped' ? '#fef3c7' : '#e2e8f0',
                                                    color: 
                                                        trackData.delivery_status?.toLowerCase() === 'delivered' ? '#15803d' :
                                                        trackData.delivery_status?.toLowerCase() === 'shipped' ? '#b45309' : '#475569',
                                                }}>
                                                    {trackData.delivery_status || 'Pending'}
                                                </span>
                                            </div>

                                            {trackData.tracking?.id && (
                                                <button
                                                    onClick={() => window.open(trackData.tracking?.tracking_url || 'https://www.stcourier.com/track/shipment', '_blank')}
                                                    className="btn btn-sm w-100 py-2 text-white fw-bold"
                                                    style={{ background: '#800000', borderRadius: '6px' }}
                                                >
                                                    Track Order ↗
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3" style={{ color: '#800000', fontSize: '0.9rem' }}>📍 DELIVERY DETAILS</h6>
                                        <div className="p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', height: '100%' }}>
                                            <div className="fw-bold text-dark mb-1">{trackData.shipping_address?.full_name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                                {trackData.shipping_address?.address_line1}<br />
                                                {trackData.shipping_address?.address_line2 && `${trackData.shipping_address.address_line2}, `}
                                                {trackData.shipping_address?.city}, {trackData.shipping_address?.state} - {trackData.shipping_address?.postal_code}
                                            </div>
                                            <div className="fw-semibold text-dark mt-2" style={{ fontSize: '0.85rem' }}>Ph: {trackData.shipping_address?.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Timeline */}
                            {trackData.timeline && trackData.timeline.length > 0 && (
                                <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px', background: '#fff' }}>
                                    <h5 className="fw-bold mb-4" style={{ color: '#2d3748' }}>Tracking Timeline</h5>
                                    
                                    <div className="position-relative ps-4" style={{ borderLeft: '2px solid #e2e8f0', margin: '10px 0 10px 10px' }}>
                                        {trackData.timeline.map((step: any, idx: number) => (
                                            <div className="mb-4 position-relative" key={idx}>
                                                {/* Step dot */}
                                                <div 
                                                    className="position-absolute" 
                                                    style={{ 
                                                        left: '-23px', 
                                                        top: '3px',
                                                        width: '12px', 
                                                        height: '12px', 
                                                        borderRadius: '50%', 
                                                        background: idx === trackData.timeline.length - 1 ? '#800000' : '#dee2e6',
                                                        border: '2px solid #fff',
                                                        boxShadow: '0 0 0 2px ' + (idx === trackData.timeline.length - 1 ? '#fee2e2' : '#dee2e6')
                                                    }} 
                                                />
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '0.95rem', textTransform: 'capitalize' }}>
                                                        {step.status}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>{step.message || 'Status updated successfully'}</div>
                                                    <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>{new Date(step.created_at || step.date).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Items List */}
                            {trackData.items && trackData.items.length > 0 && (
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px', background: '#fff' }}>
                                    <h5 className="fw-bold mb-3" style={{ color: '#2d3748' }}>Ordered Items</h5>
                                    <div className="d-flex flex-column gap-3">
                                        {trackData.items.map((item: any, idx: number) => (
                                            <div className="d-flex align-items-center gap-3 p-2 rounded" key={idx} style={{ border: '1px solid #f1f5f9' }}>
                                                <img 
                                                    src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${IMAGE_BASE}${item.image_url}`) : sareeImageFallback.src} 
                                                    alt={item.product_name} 
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{item.product_name}</h6>
                                                    {item.variant_name && <span className="text-muted me-3" style={{ fontSize: '0.8rem' }}>Variant: {item.variant_name}</span>}
                                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Quantity: {item.quantity}</span>
                                                </div>
                                                <div className="fw-bold text-dark">
                                                    ₹{item.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;
