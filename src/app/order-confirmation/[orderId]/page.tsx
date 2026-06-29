"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { resolveMediaUrl } from '@/config/api';
import { useOrderStore } from '@/store/orderStore';
import './orderConfirmation.css';
import Image from 'next/image';
import { toast } from 'react-toastify';

// Import icons/images (using placeholders or mapping from assets)
import transportIcon from 'assets/icons/ui/transporticon.png';
import sareeImageFallback from 'assets/images/silk/collection1.png';

const formatIndianTime = (dateInput: string | Date | null | undefined) => {
  if (!dateInput) return '-';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    return '-';
  }
};

const formatIndianDate = (dateInput: string | Date | null | undefined) => {
  if (!dateInput) return '-';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return '-';
  }
};

const OrderConfirmationPage = () => {
  const params = useParams();
  const orderId = params?.orderId as string;
  const router = useRouter();
  
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  const { currentOrder, loading, error, fetchOrderDetails, cancelOrder } = useOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, fetchOrderDetails]);

  if (loading) {
    return (
      <div className="order-conf-wrapper">
        <div className="text-center">
          <div className="spinner-border text-maroon" role="status" style={{ color: '#800000' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3" style={{ fontFamily: 'Jost', color: '#5A413D' }}>Fetching your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="order-conf-wrapper">
        <div className="text-center p-5 bg-white rounded shadow-sm" style={{ maxWidth: '500px' }}>
          <h2 style={{ fontFamily: 'Jost', color: '#800000' }}>{error ? 'Oops!' : 'Order Not Found'}</h2>
          <p style={{ fontFamily: 'Jost', color: '#5A413D' }}>{error || 'We could not find the details for this order.'}</p>
          <button 
            className="order-conf-btn-track mt-3" 
            onClick={() => router.push('/collections/products')}
            style={{ width: 'auto', padding: '0 32px', margin: '0 auto' }}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Parse shipping address if it's a string
  const address = typeof currentOrder.shipping_address === 'string' 
    ? JSON.parse(currentOrder.shipping_address) 
    : currentOrder.shipping_address;

  // Calculate dynamic GST breakdown (5% inclusive GST)
  const totalAmount = parseFloat(String(currentOrder.total_amount || '0'));
  const taxableAmount = parseFloat((totalAmount / 1.05).toFixed(2));
  const totalGst = parseFloat((totalAmount - taxableAmount).toFixed(2));
  const cgst = parseFloat((totalGst / 2).toFixed(2));
  const sgst = parseFloat((totalGst - cgst).toFixed(2));

  const orderStatus = (currentOrder.status || '').toUpperCase();
  const isCancellable = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(orderStatus);

  const handleCancelOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      toast.error('Please enter a cancellation reason.');
      return;
    }
    setIsCancelling(true);
    try {
      const result = await cancelOrder(currentOrder.order_id, cancelReason.trim());
      if (result.success) {
        toast.success(result.message || 'Order cancelled successfully!');
        setIsCancelModalOpen(false);
        setCancelReason('');
      } else {
        toast.error(result.message || 'Failed to cancel order.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="order-conf-wrapper">
      <div className="order-conf-container">
        <div className="order-conf-inner-layout">
          
          {/* Cancellation Warning/Audit Banner */}
          {orderStatus === 'CANCELLED' && (
            <div className="order-conf-cancelled-banner p-4 text-start" style={{
              background: '#fdf2f2',
              border: '1px solid #fde8e8',
              borderLeft: '5px solid #dc2626',
              borderRadius: '12px',
              fontFamily: 'Jost, sans-serif',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ color: '#dc2626', fontSize: '18px' }}></i>
                <h4 style={{ margin: 0, color: '#991b1b', fontWeight: 700, fontSize: '16px' }}>This order has been CANCELLED</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px', color: '#7f1d1d' }}>
                <div><strong>Cancelled On:</strong> {formatIndianTime(currentOrder.cancelled_at)}</div>
                <div><strong>Cancelled By:</strong> {currentOrder.cancelled_by === 'USER' ? 'Customer' : 'Store Administrator'}</div>
                <div><strong>Reason:</strong> {currentOrder.cancel_reason || 'No reason provided'}</div>
                <div><strong>Refund Status:</strong> 
                  <span style={{
                    marginLeft: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    backgroundColor: currentOrder.refund_status === 'PENDING' ? '#fef3c7' : '#e2e8f0',
                    color: currentOrder.refund_status === 'PENDING' ? '#b45309' : '#475569'
                  }}>
                    {currentOrder.refund_status || 'NOT_REQUIRED'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status Header */}
          <header className="order-conf-status-header">
            <div className="order-conf-checkmark-box" style={{
              backgroundColor: orderStatus === 'CANCELLED' ? '#fee2e2' : '#e6f7ed'
            }}>
              <div className="order-conf-checkmark-inner" style={{
                backgroundColor: orderStatus === 'CANCELLED' ? '#ef4444' : '#2ecc71'
              }}>
                <i className={`bi ${orderStatus === 'CANCELLED' ? 'bi-x-lg' : 'bi-check-lg'}`} style={{ fontSize: '24px', color: '#fff' }}></i>
              </div>
            </div>
            <h1 className="order-conf-title">
              {orderStatus === 'CANCELLED' ? 'Order Cancelled' : 'Order Confirmed!'}
            </h1>
            <p className="order-conf-subtext">
              {orderStatus === 'CANCELLED' 
                ? `Order #${currentOrder.order_number} has been cancelled successfully.`
                : `Thank you for your purchase. Your order #${currentOrder.order_number} has been successfully placed and is being prepared for transit.`}
            </p>
          </header>

          {/* Content Grid */}
          <main className="order-conf-content-grid">
            
            {/* Left Column: Order Summary & Product */}
            <div className="order-conf-left-column">
              <div className="order-conf-summary-box">
                <h2 className="order-conf-summary-title">Order Summary</h2>
                
                <div className="order-conf-summary-row">
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">ORDER ID</span>
                    <div className="order-conf-item-value">#{currentOrder.order_number}</div>
                  </div>
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">ORDER DATE</span>
                    <div className="order-conf-item-value">{formatIndianDate(currentOrder.created_at)}</div>
                  </div>
                </div>

                <div className="order-conf-summary-row">
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">PAYMENT METHOD</span>
                    <div className="order-conf-item-value" style={{ textTransform: 'uppercase' }}>{currentOrder.payment_method}</div>
                  </div>
                  <div className="order-conf-summary-item">
                    <span className="order-conf-item-label">TOTAL AMOUNT</span>
                    <div className="order-conf-item-value order-conf-total-value">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                </div>

                {/* GST Details Breakdown */}
                <div className="order-conf-gst-breakdown mt-3 pt-3" style={{ borderTop: '1px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#800000', letterSpacing: '0.5px', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Tax Invoice / GST Details (5% Inclusive)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                      <span>Taxable Amount (Base Price)</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                      <span>Includes GST (5%)</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', paddingLeft: '12px', borderLeft: '2px solid #cbd5e1' }}>
                      <span>CGST (2.5%)</span>
                      <span style={{ fontWeight: 500, color: '#1e293b' }}>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', paddingLeft: '12px', borderLeft: '2px solid #cbd5e1' }}>
                      <span>SGST (2.5%)</span>
                      <span style={{ fontWeight: 500, color: '#1e293b' }}>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Display items */}
              {currentOrder.items?.map((item: any, idx: number) => (
                <div className="order-conf-product-box" key={idx} style={{ marginBottom: '15px' }}>
                  <div className="order-conf-product-image-container">
                    <img 
                      src={item.image_url ? resolveMediaUrl(item.image_url) : sareeImageFallback.src} 
                      alt={item.name} 
                      className="img-fluid" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="order-conf-product-info">
                    <span className="order-conf-product-badge">Silk Saree</span>
                    <h3 className="order-conf-product-name">{item.name}</h3>
                    {item.variant_name && <div className="order-conf-product-qty text-muted">{item.variant_name}</div>}
                    <div className="order-conf-product-qty">Quantity: {item.quantity}</div>
                    <div className="order-conf-product-price">₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Delivery Details */}
            <div className="order-conf-right-column">
              <div className="order-conf-delivery-box">
                <div className="order-conf-delivery-header">
                  <h2 className="order-conf-delivery-title">Delivery Details</h2>
                  <Image src={transportIcon} alt="Transport" className="order-conf-transport-icon" width={22} height={15} />
                </div>

                <div className="order-conf-delivery-body">
                  <div className="order-conf-customer-name" style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>{address?.full_name}</div>
                  <div className="order-conf-customer-address" style={{ fontSize: '13.5px', color: '#475569', marginBottom: '6px', lineHeight: '1.5' }}>
                    <strong>Address: </strong>
                    {(() => {
                      const parts = [
                        address?.address_line1,
                        address?.address_line2,
                        address?.city,
                        address?.state
                      ].filter(Boolean);
                      if (parts.length === 0) return '-';
                      let addrStr = parts.join(', ');
                      if (address?.postal_code) {
                        addrStr += ` - ${address.postal_code}`;
                      }
                      return addrStr;
                    })()}
                  </div>
                  <div className="order-conf-customer-phone" style={{ fontSize: '13.5px', color: '#475569' }}>
                    <strong>Phone: </strong>{address?.phone || '-'}
                  </div>
                </div>

                <div className="order-conf-arrival-section">
                  <span className="order-conf-arrival-label">ORDER STATUS</span>
                  <div className="order-conf-arrival-date" style={{ textTransform: 'uppercase', color: orderStatus === 'CANCELLED' ? '#dc2626' : '#1e293b' }}>
                    {orderStatus}
                  </div>
                </div>

                {orderStatus !== 'CANCELLED' && (
                  <div className="order-conf-shipping-info mt-3 p-3" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#800000', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>🚚 SHIPMENT INFORMATION</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Shipment Status</span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          textTransform: 'capitalize',
                          backgroundColor: 
                            currentOrder.shipment_status?.toLowerCase() === 'delivered' ? '#dcfce7' :
                            currentOrder.shipment_status?.toLowerCase() === 'shipped' ? '#fef3c7' :
                            currentOrder.shipment_status?.toLowerCase() === 'out for delivery' ? '#e0f2fe' :
                            currentOrder.shipment_status?.toLowerCase() === 'packed' ? '#f3e8ff' : '#f1f5f9',
                          color: 
                            currentOrder.shipment_status?.toLowerCase() === 'delivered' ? '#15803d' :
                            currentOrder.shipment_status?.toLowerCase() === 'shipped' ? '#b45309' :
                            currentOrder.shipment_status?.toLowerCase() === 'out for delivery' ? '#0369a1' :
                            currentOrder.shipment_status?.toLowerCase() === 'packed' ? '#6b21a8' : '#475569',
                        }}>
                          {currentOrder.shipment_status || 'Pending'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Courier Name</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{currentOrder.courier_name || 'Not assigned yet'}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Tracking ID</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{currentOrder.tracking_id || 'Not available yet'}</span>
                      </div>

                      {currentOrder.shipped_at && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>Shipped At</span>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>
                            {formatIndianTime(currentOrder.shipped_at)}
                          </span>
                        </div>
                      )}

                      {currentOrder.estimated_delivery_date && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '13px', color: '#64748b' }}>Est. Delivery</span>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>
                            {formatIndianDate(currentOrder.estimated_delivery_date)}
                          </span>
                        </div>
                      )}

                      <button 
                        disabled={!currentOrder.tracking_id}
                        onClick={() => {
                          if (currentOrder.tracking_id) {
                            window.open(currentOrder.tracking_url || `https://shiprocket.co/tracking/${currentOrder.tracking_id}`, '_blank');
                          }
                        }}
                        style={{
                          marginTop: '6px',
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: currentOrder.tracking_id ? '#800000' : '#e2e8f0',
                          color: currentOrder.tracking_id ? '#fff' : '#94a3b8',
                          fontWeight: 600,
                          fontSize: '12px',
                          cursor: currentOrder.tracking_id ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {currentOrder.tracking_id ? 'Open Shiprocket Tracking ↗' : 'Track Order (Available once shipped)'}
                      </button>

                    </div>
                  </div>
                )}

                {/* Tracking Timeline */}
                {currentOrder.timeline?.length > 0 && (
                  <div className="order-conf-timeline mt-4">
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#800000', marginBottom: '15px' }}>TRACKING TIMELINE</div>
                    <div className="tracking-steps" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {currentOrder.timeline.map((step: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', gap: '15px', position: 'relative' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ 
                              width: '12px', height: '12px', borderRadius: '50%', 
                              background: idx === currentOrder.timeline.length - 1 ? '#800000' : '#dee2e6',
                              zIndex: 2 
                            }} />
                            {idx !== currentOrder.timeline.length - 1 && (
                              <div style={{ width: '2px', flex: 1, background: '#dee2e6', position: 'absolute', top: '12px' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>{step.status}</div>
                            <div style={{ fontSize: '11px', color: '#6c757d' }}>{step.message}</div>
                            <div style={{ fontSize: '10px', color: '#adb5bd' }}>{formatIndianTime(step.created_at)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!currentOrder.user_id && orderStatus !== 'CANCELLED' && (
                  <div className="mt-4 p-3 rounded" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#800000', marginBottom: '8px' }}>📋 GUEST CHECKOUT INFO</div>
                    <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                      Since you completed checkout as a guest, please save these details to track your order:
                    </p>
                    <div className="mt-2" style={{ fontSize: '12.5px', color: '#1e293b' }}>
                      <strong>Order Number:</strong> #{currentOrder.order_number}<br />
                      <strong>Phone Number:</strong> {address?.phone}
                    </div>
                    <button
                      onClick={() => router.push(`/track-order?orderId=${currentOrder.order_number}&phone=${address?.phone}`)}
                      className="btn btn-sm mt-3 w-100 py-2 text-white fw-bold"
                      style={{ background: '#800000', borderRadius: '6px', fontSize: '12px', border: 'none' }}
                    >
                      Go to Live Tracking Page ↗
                    </button>
                  </div>
                )}

                <div className="order-conf-note-box mt-4">
                  <i className="bi bi-shield-check order-conf-note-icon"></i>
                  <p className="order-conf-note-text">
                    {orderStatus === 'CANCELLED'
                      ? 'This order has been cancelled and stocks have been restored safely.'
                      : 'Your heritage silk is being packed with extra care to preserve its quality during transit.'}
                  </p>
                </div>
              </div>

              <div className="order-conf-action-buttons">
                {isCancellable && (
                  <button 
                    className="order-conf-btn-cancel" 
                    onClick={() => setIsCancelModalOpen(true)}
                    style={{
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fca5a5',
                      color: '#991b1b',
                      fontWeight: 600,
                      width: '100%',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      marginBottom: '15px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      fontFamily: 'Jost, sans-serif'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                  >
                    <i className="bi bi-x-circle-fill"></i> CANCEL ORDER
                  </button>
                )}

                <button className="order-conf-btn-track" onClick={() => router.push('/collections/products')}>
                  VIEW MORE PRODUCTS <i className="bi bi-arrow-right ms-2"></i>
                </button>
                <button className="order-conf-btn-continue" onClick={() => router.push('/')}>
                  BACK TO HOME
                </button>
              </div>
            </div>

          </main>

        </div>
      </div>

      {/* Cancellation Form Modal */}
      {isCancelModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          fontFamily: 'Jost, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#800000', letterSpacing: '0.5px' }}>Cancel Your Order</h3>
              <button 
                onClick={() => setIsCancelModalOpen(false)} 
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCancelOrderSubmit}>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                We are sorry to see you cancel your order. Please let us know the reason so we can improve our services.
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Reason for Cancellation <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Changed my mind, found a better price elsewhere..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#1e293b',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'Jost, sans-serif'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={isCancelling}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Jost, sans-serif'
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isCancelling ? '#94a3b8' : '#800000',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isCancelling ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Jost, sans-serif'
                  }}
                >
                  {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
