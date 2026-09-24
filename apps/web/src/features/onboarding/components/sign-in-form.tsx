"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@notter/api-client";
import { signInSchema, type SignInFormValues } from "@/features/onboarding/schemas/auth";
import { useOnboardingClient } from "@/features/onboarding/api/onboarding-client";
import { FormField } from "@/features/onboarding/components/form-field";
import { PrimaryButton } from "@/features/onboarding/components/primary-button";
import { useOnboardingNavigate } from "@/features/onboarding/components/onboarding-flow";

export function SignInForm() {
  const navigate = useOnboardingNavigate();
  const client = useOnboardingClient();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInFormValues) {
    setFormError(null);
    try {
      await client.signIn(values);
      navigate("welcome-back");
    } catch (error) {
      if (error instanceof ApiError && typeof error.body === "object" && error.body && "error" in error.body) {
        setFormError(String((error.body as { error: unknown }).error));
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pb-8">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </PrimaryButton>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/onboarding/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
}
