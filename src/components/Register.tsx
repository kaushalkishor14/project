import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'; // ✅ useNavigate instead of useHistory
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<RegisterForm>();
  const navigate = useNavigate(); // ✅ useNavigate for redirection

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/memories/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, name: `${data.firstName} ${data.lastName}` }),
      });

      // ✅ Try to parse JSON response only if content exists
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        responseData = null; // Handle cases where response is empty
      }

      if (!response.ok) {
        setError(responseData?.error || 'Registration failed');
      } else {
        toast.success('Registration successful!');
        reset();
        navigate('/login'); // ✅ Correct navigation method
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-screen bg-gray-900">
      <div className="flex items-center justify-center py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid w-[350px] gap-6">
          <h1 className="text-3xl font-bold text-white text-center">Register</h1>
          <p className="text-gray-400">Enter your email below to create an account</p>

          <div className="grid gap-4 py-4">
            <div className="grid  gap-4">
              <div className="grid gap-2 ">
                <Label htmlFor="first-name" className="text-gray-400 font-semibold text-lg ">
                  Name
                </Label>
                <Input {...register('firstName')} id="first-name" placeholder="Max" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-400 font-semibold text-lg">Email</Label>
              <Input {...register('email')} id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-400 font-semibold text-lg">Password</Label>
              <Input {...register('password')} id="password" type="password" required />
            </div>

            <Button type="submit" className="w-full bg-orange-400 hover:bg-orange-500" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create an account'}
            </Button>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>

          <div className="mt-4 text-center text-sm text-gray-400 font-semibold">
            Already have an account? <Link to="/login" className="underline">Sign in</Link>
          </div>
        </form>
      </div>

      <div className="hidden bg-muted lg:block">
        <img src="/peoples.png" alt="Image" className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}
