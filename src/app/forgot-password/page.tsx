"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import authService from '@/services/authService';
import Image from 'next/image';
import Logo from '@/assets/images/logo/Logo-SareeEcom.png';
import '../auth.css';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await authService.forgotPassword(data.email);
            if (response.success) {
                setIsSubmitted(true);
            } else {
                setErrorMessage(response.message || 'Something went wrong. Please try again.');
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to request password reset. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Left Side: Heritage Image */}
            <div className="auth-image-side">
                <div className="auth-image-overlay">
                    <div className="auth-image-content">
                        <h2>The Essence of Tradition</h2>
                        <p>Experience the finest handwoven Kanchipuram silk sarees, crafted with heritage and precision for over 25 years.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Forgot Password Form */}
            <div className="auth-form-side">
                <div className="auth-form-container">
                    <div className="auth-brand-logo">
                        <Link href="/">
                            <Image src={Logo} alt="SareeEcom" width={100} height={70} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>

                    <div className="auth-header">
                        <h1>Reset Password</h1>
                        <p>Enter your registered email and we will send you a secure password recovery link.</p>
                    </div>

                    {isSubmitted ? (
                        <div className="success-container animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div className="success-icon-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                                <CheckCircle2 size={56} color="#800020" style={{ opacity: 0.9 }} />
                            </div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' }}>Email Dispatched!</h2>
                            <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
                                If this email is registered in our system, you will receive a secure password reset link shortly. Please make sure to check your spam or promotions folder as well.
                            </p>
                            <Link href="/login" className="auth-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                Return to Sign In
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {errorMessage && (
                                <div className="error-banner mb-4" style={{ backgroundColor: '#fff5f5', borderLeft: '4px solid #A42829', padding: '12px', borderRadius: '4px', color: '#A42829', fontSize: '0.875rem' }}>
                                    {errorMessage}
                                </div>
                            )}

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper has-icon">
                                    <Mail className="input-icon" size={18} />
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="yourname@example.com"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && <span className="error-message">{errors.email.message}</span>}
                            </div>

                            <button type="submit" className="auth-button" style={{ marginTop: '10px' }} disabled={isLoading}>
                                {isLoading ? <div className="spinner"></div> : (
                                    <>
                                        Send Recovery Link <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="auth-footer" style={{ marginTop: '30px' }}>
                        <p className="already-have-account">
                            Remember your password? <Link href="/login" style={{ color: '#A42829', fontWeight: '600' }}>Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
