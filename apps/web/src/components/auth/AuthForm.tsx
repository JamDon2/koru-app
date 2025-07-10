"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { CheckCircle, Mail } from "lucide-react";

export default function AuthForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const onLoginSuccess = () => {
    router.push("/");
    login();
  };

  const onRegisterSuccess = () => {
    setRegistrationComplete(true);
  };

  if (registrationComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="z-10 w-full max-w-md">
          <Card className="border-neutral-800 bg-black/30 shadow-xl backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
              <div className="rounded-full bg-green-500/20 p-3">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                Registration Complete!
              </CardTitle>
              <div className="flex items-center justify-center gap-2 text-neutral-300">
                <Mail className="h-4 w-4" />
                <p>Confirmation email sent</p>
              </div>
              <p className="text-sm text-neutral-400">
                Please check your inbox and click the verification link to
                activate your account. You can close this tab now.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="z-10 w-full max-w-md">
        <Card className="border-neutral-800 bg-black/30 shadow-xl backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              {isLogin ? "Sign In" : "Register"}
            </CardTitle>
            <CardDescription className="text-center text-neutral-300">
              {isLogin
                ? "Enter your credentials to sign in to your account."
                : "Create a new account to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <LoginForm onSuccess={onLoginSuccess} />
            ) : (
              <RegisterForm onSuccess={onRegisterSuccess} />
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-neutral-800 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
