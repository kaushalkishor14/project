import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    setError("");
  
    try {
      // Replace with your backend login API route
      const response = await fetch("http://localhost:5000/api/memories/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }
  
      // Store the token in localStorage for later use
      localStorage.setItem("token", result.token);

      // show success message
      toast.success("Login successful!");
      
      // Redirect to the dashboard after successful login
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="w-full lg:grid lg:grid-cols-2 h-screen bg-gray-900">
      <div className="flex items-center justify-center py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold text-white">Login</h1>
              <p className="text-gray-400">
                Enter your email below to log in to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-gray-400 font-semibold text-lg"
                >
                  Email
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-gray-400 font-semibold text-lg"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline text-orange-400 hover:text-orange-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            {error && <div className="mt-4 text-center text-red-500">{error}</div>}
            <div className="mt-4 text-center text-sm text-gray-400 font-semibold">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="underline text-orange-400 hover:text-orange-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <img src="/cover.png" alt="Cover" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default LoginPage;
