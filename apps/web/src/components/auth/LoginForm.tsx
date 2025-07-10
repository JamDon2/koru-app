"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getHcaptchaSitekeyOptions,
  passwordLoginMutation,
} from "api-client/react-query";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loginSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string(),
});

type LoginFormProps = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutateAsync: login,
    isPending,
    isError,
  } = useMutation(passwordLoginMutation());

  const hcaptchaSitekey = useQuery({
    ...getHcaptchaSitekeyOptions(),
    staleTime: Infinity,
  });
  const [hcaptchaToken, setHCaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = useRef<HCaptcha>(null);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      if (!hcaptchaToken) return;

      await login({
        body: {
          username: values.email,
          password: values.password,
        },
        headers: {
          "hcaptcha-token": hcaptchaToken,
        },
      });
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      hcaptchaRef.current?.resetCaptcha();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="border-neutral-800 bg-neutral-900/50 focus-visible:ring-violet-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="border-neutral-800 bg-neutral-900/50 focus-visible:ring-violet-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        {isError && (
          <div className="text-sm font-medium text-red-400">
            Invalid credentials. Please try again.
          </div>
        )}
        <div className="flex h-[78px] justify-center">
          {hcaptchaSitekey.isLoading ? (
            <Skeleton className="h-[78px] w-[300px] bg-neutral-800/50" />
          ) : (
            <HCaptcha
              sitekey={hcaptchaSitekey.data?.message || ""}
              onVerify={setHCaptchaToken}
              onExpire={() => setHCaptchaToken(null)}
              ref={hcaptchaRef}
              theme="dark"
            />
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          disabled={isPending || !hcaptchaToken}
        >
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
