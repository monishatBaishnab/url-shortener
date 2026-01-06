import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLoginMutation } from '@/app/features/auth/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/error';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignIn = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'monishat.baishnab@example.com',
      password: '12345678',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      navigate('/');
      toast.success('Login success.');
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[430px]">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                disabled={isLoading}
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email ? (
                <p className="text-xs text-red-600 h-2">
                  {errors.email.message}
                </p>
              ) : (
                <p className="h-2"></p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className=" pr-10"
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600 h-2">
                  {errors.password.message}
                </p>
              ) : (
                <p className="h-2"></p>
              )}
            </div>

            {errors.root && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                {errors.root.message}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant={'link'}
                className='p-0 h-5 -mt-4! -mb-2!'
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Button>
            </div>
            <Button
              size="lg"
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?{' '}
          <Button
            variant="link"
            className="text-cornflower-blue-400"
            onClick={() => navigate('/sign-up')}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
