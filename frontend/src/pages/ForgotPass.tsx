/* eslint-disable react-hooks/set-state-in-effect */
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from '@/app/features/auth/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/error';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const emailSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 4 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
});

const passwordSchema = z
  .object({
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

const ForgotPass = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(
    Number(localStorage.getItem('forgot-pass-step') || 1),
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Initialize timer based on step
  const getInitialTime = () => {
    const currentStep = Number(localStorage.getItem('forgot-pass-step') || 1);
    if (currentStep === 2) {
      const storedTime = localStorage.getItem('forgot-pass-timer');
      return storedTime ? parseInt(storedTime) : 300; // 5 minutes = 300 seconds
    }
    return 0;
  };

  const [timeLeft, setTimeLeft] = useState<number>(getInitialTime);

  const [forgotPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation();
  const [verifyOtpMutation, { isLoading: isVerifyingOtp }] =
    useVerifyOtpMutation();
  const [resetPasswordMutation, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { new_password: '', confirm_password: '' },
  });

  // Format time as HH:MM
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Update timer when step changes
  useEffect(() => {
    if (step === 2) {
      const storedTime = localStorage.getItem('forgot-pass-timer');
      const initialTime = storedTime ? parseInt(storedTime) : 300;
      setTimeLeft(initialTime);
    } else {
      setTimeLeft(0);
    }
  }, [step]);

  // Timer countdown effect
  useEffect(() => {
    let interval: number;

    if (step === 2 && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('forgot-pass-timer', String(newTime));
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timeLeft]);

  // Save step and timer to localStorage
  useEffect(() => {
    if (step) {
      localStorage.setItem('forgot-pass-step', String(step));
    }
    return () => {
      localStorage.removeItem('forgot-pass-step');
      localStorage.removeItem('forgot-pass-timer');
    };
  }, [step]);

  // Separate submitter functions with try-catch
  const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      toast.success('OTP sent to your email.');
      setStep(2);
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Failed to send OTP. Please try again.',
      );
      toast.error(message);
      console.error('Forgot password email error:', error);
    }
  };

  const handleOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      const email = emailForm.getValues('email');
      await verifyOtpMutation({ email, otp: data.otp }).unwrap();
      toast.success('OTP verified successfully.');
      // Reset timer on successful verification
      setTimeLeft(0);
      localStorage.removeItem('forgot-pass-timer');
      setStep(3);
    } catch (error) {
      const message = getErrorMessage(error, 'Invalid OTP. Please try again.');
      toast.error(message);
      console.error('OTP verification error:', error);
    }
  };

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      const email = emailForm.getValues('email');
      await resetPasswordMutation({
        email,
        new_password: data.new_password,
      }).unwrap();
      toast.success('Password reset successfully.');
      localStorage.removeItem('forgot-pass-step');
      navigate('/sign-in');
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Failed to reset password. Please try again.',
      );
      toast.error(message);
      console.error('Reset password error:', error);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <form
          className="space-y-4"
          onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
        >
          <div className="space-y-1 pt-1">
            <Input
              id="resetEmail"
              type="email"
              placeholder="Enter your registered email"
              className="h-10"
              {...emailForm.register('email')}
            />
            {emailForm.formState.errors.email ? (
              <p className="text-xs text-red-600 h-3">
                {emailForm.formState.errors.email.message}
              </p>
            ) : (
              <p className="h-3"></p>
            )}
          </div>
          <Button
            className="w-full"
            size="lg"
            type="submit"
            variant={'primary'}
            disabled={isSendingEmail}
          >
            {isSendingEmail ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      );
    }

    if (step === 2) {
      return (
        <form
          className="space-y-4"
          onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
        >
          <div className="text-center text-sm text-gray-600 mb-4">
            Enter the 4-digit code sent to your email
          </div>
          <div className="space-y-1 pt-1">
            <Controller
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <div className="flex justify-center">
                  <div className="w-80 shrink-0">
                    <InputOTP
                      id="otp"
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={6}
                      containerClassName="justify-center"
                      className="w-full"
                    >
                      <InputOTPGroup className="w-full flex justify-between">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <InputOTPSlot
                            key={idx}
                            index={idx}
                            className="h-10 w-10 border border-gray-300 text-base rounded-md data-[active=true]:border-blue-500 data-[active=true]:ring-2 data-[active=true]:ring-blue-100 transition-all"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              )}
            />
            {otpForm.formState.errors.otp ? (
              <p className="text-xs text-red-600 h-3 text-center">
                {otpForm.formState.errors.otp.message}
              </p>
            ) : (
              <p className="h-3"></p>
            )}
            {timeLeft > 0 ? (
              <p className="text-xs text-gray-600 text-center mt-2">
                Time remaining:{' '}
                <span className="font-medium text-blue-600">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <p className="text-xs text-red-600 text-center mt-2">
                Time expired. Please request a new OTP.
              </p>
            )}
          </div>
          <Button
            className="w-full"
            size="lg"
            type="submit"
            variant={'primary'}
            disabled={isVerifyingOtp || timeLeft === 0}
          >
            {isVerifyingOtp
              ? 'Verifying...'
              : timeLeft === 0
              ? 'OTP Expired'
              : 'Verify OTP'}
          </Button>

          {timeLeft === 0 && (
            <Button
              className="w-full mt-2"
              size="default"
              variant="ghost"
              onClick={async () => {
                try {
                  // Reset timer
                  setTimeLeft(300);
                  localStorage.setItem('forgot-pass-timer', '300');

                  // Resend OTP
                  const email = emailForm.getValues('email');
                  await forgotPassword({ email }).unwrap();
                  toast.success('OTP sent to your email.');
                } catch (error) {
                  const message = getErrorMessage(
                    error,
                    'Failed to resend OTP.',
                  );
                  toast.error(message);
                }
              }}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? 'Resending...' : 'Resend OTP'}
            </Button>
          )}
        </form>
      );
    }

    return (
      <form
        className="space-y-2"
        onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
      >
        <div className="space-y-1">
          <Label htmlFor="new_password" className="text-sm font-medium">
            New password
          </Label>
          <div className="relative">
            <Input
              id="new_password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              className="h-10 pr-10"
              {...passwordForm.register('new_password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {passwordForm.formState.errors.new_password ? (
            <p className="text-xs text-red-600 h-3">
              {passwordForm.formState.errors.new_password.message}
            </p>
          ) : (
            <p className="h-3"></p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirm_password" className="text-sm font-medium">
            Confirm new password
          </Label>
          <div className="relative">
            <Input
              id="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              className="h-10 pr-10"
              {...passwordForm.register('confirm_password')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {passwordForm.formState.errors.confirm_password ? (
            <p className="text-xs text-red-600 h-3">
              {passwordForm.formState.errors.confirm_password.message}
            </p>
          ) : (
            <p className="h-3"></p>
          )}
        </div>

        <Button
          className="w-full mt-2 btn-primary"
          size="lg"
          type="submit"
          variant={'primary'}
          disabled={isResettingPassword}
        >
          {isResettingPassword ? 'Resetting password...' : 'Change password'}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[430px]">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Forgot password
            </h1>
            <p className="text-gray-500">
              Reset your password in three simple steps
            </p>
          </div>

          <div className="flex justify-center gap-2 text-xs font-medium text-gray-600">
            <div
              className={`px-3 py-1 rounded-full ${
                step === 1
                  ? 'bg-cornflower-blue-50 text-cornflower-blue-400'
                  : 'bg-gray-100'
              }`}
            >
              1. Email
            </div>
            <div
              className={`px-3 py-1 rounded-full ${
                step === 2
                  ? 'bg-cornflower-blue-50 text-cornflower-blue-400'
                  : 'bg-gray-100'
              }`}
            >
              2. Verify OTP
            </div>
            <div
              className={`px-3 py-1 rounded-full ${
                step === 3
                  ? 'bg-cornflower-blue-50 text-cornflower-blue-400'
                  : 'bg-gray-100'
              }`}
            >
              3. New password
            </div>
          </div>

          {renderStepContent()}
        </div>

        <div className="text-center text-sm text-gray-600 mt-5">
          Remembered your password?{' '}
          <Button
            onClick={() => navigate('/sign-in')}
            variant="link"
            className="text-cornflower-blue-400"
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
