"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import Logo from '@/assets/images/logo/Logo-SareeEcom.png';
import '../auth.css';
import { toast } from 'react-toastify';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signup, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        const result = await signup(data);
        setIsLoading(false);
        if (result.success) {
            toast.success('Successfully created your account!');
            router.push(redirectTo);
        } else {
            toast.error(result.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-page-wrapper">
            {/* Left Side: Heritage Image */}
            <div className="auth-image-side">
                <div className="auth-image-overlay">
                    <div className="auth-image-content">
                        <h2>Join Our Heritage</h2>
                        <p>Become a part of our exclusive community and celebrate the timeless elegance of Kanchipuram silk.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="auth-form-side">
                <div className="auth-form-container">
                    <div className="auth-brand-logo">
                        <Link href="/">
                            <Image src={Logo} alt="SareeEcom" width={100} height={70} style={{ objectFit: 'contain' }} />
                        </Link>
                    </div>

                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Register now for a personalized experience.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-wrapper has-icon">
                                <User className="input-icon" size={18} />
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="Enter your full name"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.name && <span className="error-message">{errors.name.message}</span>}
                        </div>

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

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-wrapper has-icon">
                                <Phone className="input-icon" size={18} />
                                <input
                                    {...register('phone')}
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper has-icon">
                                <Lock className="input-icon" size={18} />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a secure password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <span className="error-message">{errors.password.message}</span>}
                        </div>

                        <button type="submit" className="auth-button" disabled={isLoading}>
                            {isLoading ? <div className="spinner"></div> : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="already-have-account">
                            Already have an account? <Link href="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="auth-page-wrapper d-flex align-items-center justify-content-center">
                <div className="spinner"></div>
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}
