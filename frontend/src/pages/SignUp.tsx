import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRegisterMutation } from '@/app/features/auth/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/error';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerMutation, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to create account.');
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[430px]">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
            <p className="text-gray-500">Join us to start shortening links</p>
          </div>

          <form
            className="space-y-3"
            onSubmit={handleSubmit(handleRegisterSubmit)}
          >
            <div className="space-y-1">
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="h-10"
                {...register('name')}
              />
              {errors.name ? (
                <p className="text-xs text-red-600 h-2">
                  {errors.name.message}
                </p>
              ) : (
                <p className="h-2"></p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-10"
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
                  placeholder="Create a password"
                  className="h-10 pr-10"
                  {...register('password')}
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

              {errors.password ? (
                <p className="text-xs text-red-600 h-2">
                  {errors.password.message}
                </p>
              ) : (
                <p className="h-2"></p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="h-10 pr-10"
                  {...register('confirmPassword')}
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
              {errors.confirmPassword ? (
                <p className="text-xs text-red-600 h-2">
                  {errors.confirmPassword.message}
                </p>
              ) : (
                <p className="h-2"></p>
              )}
            </div>

            <Button
              size="lg"
              variant="primary"
              className="w-full mt-2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{' '}
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

export default SignUp;
