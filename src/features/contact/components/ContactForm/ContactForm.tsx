"use client";

import React, { useState } from 'react';
import './ContactForm.css';

interface ContactFormProps {
    section?: {
        is_enabled?: boolean;
        section_title?: string;
        section_subtitle?: string;
        submit_button_text?: string;
        fields?: Array<{
            name: string;
            label: string;
            placeholder?: string;
            type: string;
            options?: string[];
            required?: boolean;
        }>;
    };
}

const ContactForm = ({ section }: ContactFormProps) => {
    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        // Handle form submission logic here
    };

    if (section?.is_enabled === false) return null;

    if (!section) return null;

    const fields = section.fields || [];
    const getField = (name: string) => fields.find((f) => f.name === name);

    return (
        <section className="contact-form-section">
            <div className="contact-form-card">
                <div className="contact-form__header">
                    <h2 className="contact-form__title">{section.section_title || ''}</h2>
                    <p className="contact-form__subtitle">
                        {section.section_subtitle || ''}
                    </p>
                </div>

                <form className="contact-form__inner" onSubmit={handleSubmit}>
                    <div className="row g-md-5 g-0">
                        <div className="col-md-6">
                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="full_name">{getField('full_name')?.label || ''}</label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    className="form-input"
                                    placeholder={getField('full_name')?.placeholder || ''}
                                    value={formData.full_name || ''}
                                    onChange={handleChange}
                                    required={getField('full_name')?.required !== false}
                                />
                            </div>

                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="email">{getField('email')?.label || ''}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder={getField('email')?.placeholder || ''}
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    required={getField('email')?.required !== false}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="phone">{getField('phone')?.label || ''}</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-input"
                                    placeholder={getField('phone')?.placeholder || ''}
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    required={getField('phone')?.required !== false}
                                />
                            </div>

                            <div className="form-group mb-4 mb-md-5">
                                <label className="form-label" htmlFor="enquiry_type">{getField('enquiry_type')?.label || ''}</label>
                                <select
                                    id="enquiry_type"
                                    name="enquiry_type"
                                    className="form-select"
                                    value={formData.enquiry_type || ''}
                                    onChange={handleChange}
                                    required={getField('enquiry_type')?.required !== false}
                                >
                                    <option value="" disabled aria-hidden="true" hidden>{getField('enquiry_type')?.placeholder || ''}</option>
                                    {(getField('enquiry_type')?.options || []).map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label" htmlFor="message">{getField('message')?.label || ''}</label>
                        <textarea
                            id="message"
                            name="message"
                            className="form-textarea"
                            placeholder={getField('message')?.placeholder || ''}
                            rows={1}
                            value={formData.message || ''}
                            onChange={handleChange}
                            required={getField('message')?.required !== false}
                        ></textarea>
                    </div>

                    <div className="contact-form__submit-container">
                        <button type="submit" className="contact-form__submit-btn">
                            {section.submit_button_text || ''}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
