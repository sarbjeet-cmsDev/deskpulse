'use client';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/Form/Button';
import { Input } from '@/components/Form/Input';
import { H3 } from '@/components/Heading/H3';
import AuthService from '@/service/auth.service';
import { signIn } from '@/store/slices/authSlice';

export default function AuthLoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    // setApiError('');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setApiError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const data = await AuthService.login(formData);

       const { access_token, user } = data;
       const role = user.role[0];

      localStorage.setItem('token', access_token);
      localStorage.setItem('type', user.role);

      dispatch(signIn({ id: user.id, email: user.email, role: user.role }));
      
      if (role === 'admin') {
        router.push('/admin');
      }else if (redirect) {
        router.push(`/${redirect}`);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      // setApiError(error?.response?.data?.message || error.message || 'Login failed');
      console.log('error in login page',error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className='w-full'>
        <H3 className="text-sm flex items-center justify-center text-gray-500">Sign In</H3>
        </div>
        <p className="text-center text-sm text-gray-500">
          Give credential to sign in your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={emailRef}
            name="email"
            type="email"
            placeholder="Type your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

          <div className="relative">
            <Input
              name="password"
              placeholder="Type your password"
              type='password'
              value={formData.password}
              onChange={handleChange}
            />

          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}

