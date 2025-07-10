"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getHcaptchaSitekeyOptions,
  registerMutation,
} from "api-client/react-query";
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
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const registerSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type RegisterFormProps = {
  onSuccess: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const {
    mutateAsync: register,
    isPending,
    isError,
  } = useMutation(registerMutation());

  const hcaptchaSitekey = useQuery({
    ...getHcaptchaSitekeyOptions(),
    staleTime: Infinity,
  });
  const [hcaptchaToken, setHCaptchaToken] = useState<string | null>(null);
  const hcaptchaRef = useRef<HCaptcha>(null);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      if (!hcaptchaToken) return;

      await register({
        body: {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    className="border-neutral-800 bg-neutral-900/50 focus-visible:ring-violet-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@example.com"
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
                  placeholder="Create a password"
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
            Registration failed. This email may already be in use.
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
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
