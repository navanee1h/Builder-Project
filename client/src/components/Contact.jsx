import React, { useState } from 'react';
import { Send, Phone } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            service: '',
            area: '',
            message: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string()
                .matches(/^[0-9]+$/, "Must be only digits")
                .min(10, 'Must be exactly 10 digits')
                .max(10, 'Must be exactly 10 digits')
                .required('Phone number is required'),
            service: Yup.string().required('Service is required'),
            area: Yup.string().required('Area is required'),
            message: Yup.string()
        }),
        onSubmit: async (values, { resetForm }) => {
            const phoneNumber = "918606093213";
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            // 1. Prepare data for Backend
            const leadData = {
                name: values.name,
                phone: values.phone,
                serviceType: values.service,
                location: values.area,
                message: values.message
            };

            // 2. Save to Database (Backend)
            try {
                const response = await fetch(`${API_URL}/api/leads`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(leadData),
                });

                const data = await response.json();
                if (data.success) {
                    console.log('Lead saved successfully:', data.data);

                    // 3. Open WhatsApp (Only on success)
                    const waMessage = `
Hello,
I need ${values.service} service.
Location: ${values.area}
Name: ${values.name}
Phone: ${values.phone}
Message: ${values.message}
`;
                    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
                    window.open(url, "_blank");

                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 5000);
                    resetForm();
                } else {
                    console.error('Failed to save lead:', data.message);
                    alert('Failed to submit enquiry: ' + data.message);
                }
            } catch (error) {
                console.error('Error saving lead:', error);
                alert('Error submitting enquiry. Please try again.');
            }
        },
    });

    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                    <div className="md:w-1/2 bg-primary p-10 text-white flex flex-col justify-center relative overflow-hidden">
                        <h2 className="text-3xl font-bold mb-6 relative z-10">Get In Touch</h2>
                        <p className="mb-8 relative z-10 text-gray-300">
                            Ready to start your project? Fill out the form or give us a call. We offer free consultations and estimates.
                        </p>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-3 rounded-full">
                                    <Phone className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Call Us</p>
                                    <p className="font-bold text-lg">+91 8606093213</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary rounded-full opacity-20"></div>
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full opacity-10"></div>
                    </div>

                    <div className="md:w-1/2 p-10">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                                <p className="text-gray-600">We have received your enquiry and will contact you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={formik.handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        {...formik.getFieldProps('name')}
                                        className={`w-full px-4 py-3 rounded-lg border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition`}
                                        placeholder="John Doe"
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        {...formik.getFieldProps('phone')}
                                        className={`w-full px-4 py-3 rounded-lg border ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition`}
                                        placeholder="+91 8606093213"
                                    />
                                    {formik.touched.phone && formik.errors.phone && (
                                        <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                                        <select
                                            name="service"
                                            {...formik.getFieldProps('service')}
                                            className={`w-full px-4 py-3 rounded-lg border ${formik.touched.service && formik.errors.service ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-white`}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Construction">Construction</option>
                                            <option value="Plumbing">Plumbing</option>
                                            <option value="Electrical">Electrical</option>
                                            <option value="Carpentry">Carpentry</option>
                                            <option value="Painting">Painting</option>
                                            <option value="Renovation">Renovation</option>
                                        </select>
                                        {formik.touched.service && formik.errors.service && (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.service}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                                        <select
                                            name="area"
                                            {...formik.getFieldProps('area')}
                                            className={`w-full px-4 py-3 rounded-lg border ${formik.touched.area && formik.errors.area ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition bg-white`}
                                        >
                                            <option value="">Select...</option>
                                            <option value="Payyanur">Payyanur</option>
                                            <option value="Taliparamba">Taliparamba</option>
                                            <option value="Kannur">Kannur</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {formik.touched.area && formik.errors.area && (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.area}</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        {...formik.getFieldProps('message')}
                                        className={`w-full px-4 py-3 rounded-lg border ${formik.touched.message && formik.errors.message ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition`}
                                        placeholder="Tell us about your project..."
                                    ></textarea>
                                    {formik.touched.message && formik.errors.message && (
                                        <div className="text-red-500 text-xs mt-1">{formik.errors.message}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
                                >
                                    Send Enquiry
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
