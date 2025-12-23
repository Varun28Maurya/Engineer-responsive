import React, { useState, useRef } from 'react';
import details from "../data/details.json";

import {
    HardHat,
    User,
    Phone,
    ArrowRight,
    Building2,
    LockKeyhole,
    Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConstructionAuthIndia = () => {
    const otpRef = useRef(null);
    const otpTimerRef = useRef(null);
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState('FORM'); // 'FORM' or 'OTP'
    const [role, setRole] = useState('');
    // Form State
    const [mobile, setMobile] = useState('');
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [otp, setOtp] = useState('');
    // Error State
    const [error, setError] = useState('');
    // Handlers
    const handleNameChange = (e) => {
        // Only allow letters and spaces
        const val = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(val)) {
            setFullName(val);
        }
    };
    const findUserByPhone = (phone) => {
  const owner = details.owners.find(o => o.phone === phone);
  if (owner) return owner;

  const engineer = details.engineers.find(e => e.phone === phone);
  if (engineer) return engineer;

  return null;
};

    const handleSubmit = (e) => {
  e.preventDefault();
  setError("");

  if (mobile.length !== 10) {
    setError("Please enter a valid 10-digit mobile number.");
    return;
  }

  const existingUser = findUserByPhone(mobile);

  // 🚫 Login but user not found
  if (isLogin && !existingUser) {
    setError("Number not registered. Please sign up.");
    return;
  }

  // 🚫 Signup but user already exists
  if (!isLogin && existingUser) {
    setError("User already exists. Please log in.");
    return;
  }

  // ✅ Proceed to OTP
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  otpRef.current = generatedOtp;

  console.log("OTP:", generatedOtp);
  alert(`Your OTP is ${generatedOtp}`);

  otpTimerRef.current = setTimeout(() => {
    otpRef.current = null;
  }, 20000);

  setStep("OTP");
};



    const handleVerify = (e) => {
  e.preventDefault();
  setError("");

  if (!otpRef.current) {
    setError("OTP expired. Please try again.");
    return;
  }

  if (otp !== otpRef.current) {
    setError("Invalid OTP.");
    return;
  }

  clearTimeout(otpTimerRef.current);
  otpRef.current = null;

  const existingUser = findUserByPhone(mobile);
  let user;

  // ✅ LOGIN
  if (isLogin) {
    user = existingUser;
  }
  // ✅ SIGNUP
  else {
    if (!role) {
      setError("Please select a role.");
      return;
    }

    user = {
      id: `${role.toLowerCase()}-${Date.now()}`,
      name: fullName,
      phone: mobile,
      role
    };

    // simulate DB write
    const db = JSON.parse(localStorage.getItem("users")) || [];
    db.push(user);
    localStorage.setItem("users", JSON.stringify(db));
  }

  localStorage.setItem("authUser", JSON.stringify(user));
  setShowSuccess(true);
};


    const handleContinue = () => {
  setShowSuccess(false);

  const user = JSON.parse(localStorage.getItem("authUser"));

  if (user.role === "OWNER") {
    navigate("/owner");
  } else {
    navigate("/engineer");
  }
};

    const switchMode = (mode) => {
        setIsLogin(mode);
        setStep('FORM');
        setError('');
        setOtp('');
    };

    return (

        // 3. Off-White / Light Background (#F4F4F5)
        <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4 font-sans text-[#111827]">
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center animate-in zoom-in duration-200">

                        <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-green-100">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-lg font-bold text-[#111827]">
                            {isLogin ? 'Login Successful' : 'Account Created'}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            {isLogin
                                ? 'You have successfully logged in.'
                                : 'Your account has been created successfully.'}
                        </p>

                        <button
                            onClick={handleContinue}
                            className="mt-6 w-full bg-[#0B3C5D] hover:bg-[#1E40AF] text-white font-bold py-3 rounded-xl transition-all"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
            <div className="bg-[#FFFFFF] w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">

                {/* Header */}
                <div className="text-center mb-8">
                    {/* 1. Deep Industrial Blue Background (#0B3C5D) */}
                    <div className="inline-block bg-[#0B3C5D] p-3 rounded-xl mb-3 shadow-lg shadow-[#0B3C5D]/20">
                        <HardHat size={32} className="text-white" />
                    </div>
                    {/* 4. Charcoal / Dark Text (#111827) */}
                    <h1 className="text-2xl font-bold text-[#111827]">SiteSetu</h1>
                    {/* 4. Secondary Text (#374151) */}
                    <p className="text-[#374151] text-sm mt-1">Construction Field Management</p>
                </div>

                {/* STEP 1: INPUT FORM */}
                {step === 'FORM' && (
                    <>
                        {/* Toggle Switch */}
                        <div className="flex p-1 bg-[#F4F4F5] rounded-lg mb-6">
                            <button
                                onClick={() => switchMode(true)}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${isLogin ? 'bg-white shadow-sm text-[#0B3C5D]' : 'text-[#374151] hover:text-[#111827]'}`}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => switchMode(false)}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${!isLogin ? 'bg-white shadow-sm text-[#0B3C5D]' : 'text-[#374151] hover:text-[#111827]'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-[#374151] uppercase mb-1 ml-1">Full Name <span className="text-[#DC2626]">*</span></label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={handleNameChange}
                                                placeholder="Rahul Sharma"
                                                // 2. Safety Orange Focus Ring (#F97316) for emphasis
                                                className="w-full pl-10 pr-4 py-3 bg-[#F4F4F5] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition-all text-[#111827]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#374151] uppercase mb-1 ml-1">Site / Company Name <span className="text-[#DC2626]">*</span></label>
                                        <div className="relative">
                                            <Building2 size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="ABC Constructions"
                                                className="w-full pl-10 pr-4 py-3 bg-[#F4F4F5] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition-all text-[#111827]"
                                            />
                                        </div>
                                    </div>
                                    {/* Role Selection */}
                                    <div>
                                        <label className="block text-xs font-bold text-[#374151] uppercase mb-2 ml-1">
                                            Your Role *
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setRole('OWNER')}
                                                className={`py-3 rounded-xl border font-bold transition-all ${role === 'OWNER'
                                                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                                                    : 'bg-[#F4F4F5] border-gray-200 text-[#374151] hover:border-[#0B3C5D]'
                                                    }`}
                                            >
                                                Owner / Manager
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setRole('ENGINEER')}
                                                className={`py-3 rounded-xl border font-bold transition-all ${role === 'ENGINEER'
                                                    ? 'bg-[#0B3C5D] text-white border-[#0B3C5D]'
                                                    : 'bg-[#F4F4F5] border-gray-200 text-[#374151] hover:border-[#0B3C5D]'
                                                    }`}
                                            >
                                                Site Engineer
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}


                            <div>
                                <label className="block text-xs font-bold text-[#374151] uppercase mb-1 ml-1">Mobile Number <span className="text-[#DC2626]">*</span></label>
                                <div className="flex">
                                    <span className="flex items-center justify-center px-4 bg-[#F4F4F5] border border-gray-200 border-r-0 rounded-l-xl text-[#374151] font-bold">
                                        +91
                                    </span>
                                    <div className="relative flex-1">
                                        <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setMobile(val);
                                            }}
                                            placeholder="98765 43210"
                                            className="w-full pl-10 pr-4 py-3 bg-[#F4F4F5] border border-gray-200 rounded-r-xl border-l-0 focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition-all font-bold tracking-widest text-lg text-[#111827]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 6. Error Red (#DC2626) */}
                            {error && <p className="text-[#DC2626] text-xs font-semibold ml-1">{error}</p>}

                            {/* 1. Primary Blue Button (#0B3C5D) with Hover (#1E40AF) */}
                            <button className="w-full bg-[#0B3C5D] hover:bg-[#1E40AF] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0B3C5D]/30 transition-all mt-6">
                                {isLogin ? 'Get OTP' : 'Create Account'}
                                <ArrowRight size={20} />
                            </button>
                        </form>
                    </>
                )}

                {/* STEP 2: OTP VERIFICATION */}
                {step === 'OTP' && (
                    <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleVerify}>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-[#111827]">Verify Mobile</h3>
                            <div className="flex items-center justify-center gap-2 mt-2 text-[#374151] text-sm">
                                <span>Sent to +91 {mobile}</span>
                                {/* 2. Safety Orange (#F97316) for Highlights/Actions */}
                                <button
                                    type="button"
                                    onClick={() => setStep('FORM')}
                                    className="text-[#F97316] font-bold hover:underline flex items-center gap-1"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#374151] uppercase mb-1 ml-1 text-center">Enter 4-Digit OTP</label>
                            <div className="relative max-w-[200px] mx-auto">
                                <LockKeyhole size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={otp}
                                    maxLength={4}
                                    autoFocus
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setOtp(val);
                                    }}
                                    placeholder="• • • •"
                                    // Orange Focus Ring for OTP input
                                    className="w-full pl-10 pr-4 py-3 bg-[#F4F4F5] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition-all font-bold text-2xl tracking-[0.5em] text-center text-[#111827]"
                                />
                            </div>
                        </div>

                        {error && <p className="text-[#DC2626] text-xs font-semibold text-center">{error}</p>}

                        <button className="w-full bg-[#0B3C5D] hover:bg-[#1E40AF] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0B3C5D]/30 transition-all">
                            Verify & Proceed
                        </button>

                        <div className="text-center">
                            <button type="button" className="text-xs font-bold text-gray-400 hover:text-[#0B3C5D]">
                                Resend OTP in 30s
                            </button>
                        </div>
                    </form>
                )}

                {step === 'FORM' && (
                    <p className="text-center text-xs text-gray-400 mt-4">
                        By continuing, you agree to our Terms & Conditions.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ConstructionAuthIndia;