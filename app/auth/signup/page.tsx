'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Sun, Moon, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { CircleInLogo } from '@/components/ui';
import { useTheme } from '@/components/providers/theme-provider';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accessCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    if (email.length > 0) {
      setEmailValid(validateEmail(email));
    } else {
      setEmailValid(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    if (formData.confirmPassword.length > 0) {
      setPasswordsMatch(password === formData.confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    if (confirmPassword.length > 0) {
      setPasswordsMatch(formData.password === confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        accessCode: formData.accessCode,
        name: formData.name,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Account created successfully! Welcome to CircleIn!');
        router.push('/setup/flat-number');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[hsl(var(--success))]">
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <CircleInLogo className="w-12 h-12" />
              <span className="text-2xl font-serif text-white">CircleIn</span>
            </div>
            
            <h1 className="font-serif text-4xl xl:text-5xl text-white mb-6 leading-tight">
              Join your<br />
              <span className="text-white/80">community today</span>
            </h1>
            
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Get your access code from your community administrator and start booking amenities in minutes.
            </p>
          </motion.div>
          
          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 space-y-3"
          >
            <div className="flex items-center gap-3 text-sm text-white/60">
              <Shield className="w-4 h-4" />
              <span>Invite-only communities</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <CheckCircle2 className="w-4 h-4" />
              <span>Quick setup process</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <CheckCircle2 className="w-4 h-4" />
              <span>Secure and private</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col bg-background transition-colors duration-300">
        {/* Header with theme toggle */}
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <CircleInLogo className="w-8 h-8" />
            <span className="text-lg font-serif text-foreground">
              CircleIn
            </span>
          </Link>
          
          <div className="lg:ml-auto">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-[10px] bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[400px]"
          >
            {/* Mobile heading */}
            <div className="text-center mb-6 lg:hidden">
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground mb-2">
                Create account
              </h1>
              <p className="text-muted-foreground text-sm">
                Join your community
              </p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-6">
              <h2 className="font-serif text-2xl text-foreground mb-2">
                Create your account
              </h2>
              <p className="text-muted-foreground">
                Fill in your details to get started
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Access Code Field */}
              <div className="space-y-2">
                <Label htmlFor="accessCode" className="text-sm font-medium text-foreground">
                  Access Code <span className="text-[hsl(var(--destructive))]">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Key className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      focusedField === 'accessCode' 
                        ? 'text-[hsl(var(--warning))]' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <Input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    value={formData.accessCode}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('accessCode')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your access code"
                    className="h-12 pl-11 pr-4"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Provided by your community administrator
                </p>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      focusedField === 'name' 
                        ? 'text-[hsl(var(--accent))]' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your full name"
                    className="h-12 pl-11 pr-4"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      focusedField === 'email' 
                        ? 'text-[hsl(var(--accent))]' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="name@example.com"
                    className="h-12 pl-11 pr-11"
                    required
                  />
                  <AnimatePresence>
                    {emailValid === true && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
                      </motion.div>
                    )}
                    {emailValid === false && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      >
                        <AlertCircle className="w-5 h-5 text-[hsl(var(--destructive))]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      focusedField === 'password' 
                        ? 'text-[hsl(var(--accent))]' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a password"
                    className="h-12 pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className={`w-[18px] h-[18px] transition-colors duration-200 ${
                      focusedField === 'confirmPassword' 
                        ? 'text-[hsl(var(--accent))]' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    className="h-12 pl-11 pr-20"
                    required
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <AnimatePresence>
                      {passwordsMatch === true && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
                        </motion.div>
                      )}
                      {passwordsMatch === false && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <AlertCircle className="w-5 h-5 text-[hsl(var(--destructive))]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-[18px] h-[18px]" />
                      ) : (
                        <Eye className="w-[18px] h-[18px]" />
                      )}
                    </button>
                  </div>
                </div>
                {passwordsMatch === false && (
                  <p className="text-xs text-[hsl(var(--destructive))]">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="font-medium text-[hsl(var(--accent))] hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 text-center">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground transition-colors">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
