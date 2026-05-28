"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import authService from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Logo from '@/assets/images/logo/Logo-SareeEcom.png';
import '../auth.css';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(4);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { logout } = useAuthStore();

    useEffect(() => {
        if (!token) {
            setErrorMessage('Security token is missing. Please request a new password reset link.');
        }
    }, [token]);

    // Countdown and automatic redirect on success
    useEffect(() => {
        if (isSuccess && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isSuccess && countdown === 0) {
            router.push('/login');
        }
    }, [isSuccess, countdown, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setErrorMessage('Cannot reset password without a valid reset token.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await authService.resetPassword(token, data.password);
            if (response.success) {
                // Clear any existing active user tokens from cookies / localStorage
                await logout();
                setIsSuccess(true);
            } else {
                setErrorMessage(response.message || 'Token is invalid or has expired.');
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Token is invalid or has expired. Please request a new link.');
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

            {/* Right Side: Reset Form */}
            <div className="auth-form-side">
                <div className="auth-form-container">
                    <div className="auth-brand-logo">
                        <Link href="/">
                            <Image src={Logo} alt="SareeEcom" width={100} height={70} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>

                    <div className="auth-header">
                        <h1>Create New Password</h1>
                        <p>Set a secure, strong password for your customer account.</p>
                    </div>

                    {isSuccess ? (
                        <div className="success-container animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div className="success-icon-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                                <CheckCircle2 size={56} color="#800020" style={{ opacity: 0.9 }} />
                            </div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' }}>Password Updated!</h2>
                            <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
                                Your password has been successfully updated. Redirecting you to the Sign In page in <strong>{countdown}</strong> seconds...
                            </p>
                            <Link href="/login" className="auth-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                Sign In Now
                            </Link>
                        </div>
                    ) : (errorMessage && (!token || errorMessage.toLowerCase().includes('expire') || errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('token'))) ? (
                        <div className="error-container animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div className="error-icon-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                                <XCircle size={56} color="#A42829" style={{ opacity: 0.9 }} />
                            </div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '10px' }}>Link Invalid or Expired</h2>
                            <p style={{ color: '#4a5568', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px' }}>
                                {errorMessage || 'This password reset link has expired. Please request a new link.'}
                            </p>
                            <Link href="/forgot-password" className="auth-button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', backgroundColor: '#800020' }}>
                                Request New Link
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {errorMessage && (
                                <div className="error-banner mb-4" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#fff5f5', borderLeft: '4px solid #A42829', padding: '12px', borderRadius: '4px', color: '#A42829', fontSize: '0.875rem' }}>
                                    <XCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="form-group">
                                <label>New Password</label>
                                <div className="input-wrapper has-icon">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 6 characters"
                                        disabled={isLoading || !token}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={!token}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password.message}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <div className="input-wrapper has-icon">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        {...register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Repeat new password"
                                        disabled={isLoading || !token}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={!token}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
                            </div>

                            <button type="submit" className="auth-button" style={{ marginTop: '10px' }} disabled={isLoading || !token}>
                                {isLoading ? <div className="spinner"></div> : (
                                    <>
                                        Update Password <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="auth-footer" style={{ marginTop: '30px' }}>
                        <p className="already-have-account">
                            Want to go back? <Link href="/login" style={{ color: '#A42829', fontWeight: '600' }}>Cancel</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="auth-page-wrapper d-flex align-items-center justify-content-center">
                <div className="spinner"></div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
