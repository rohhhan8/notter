"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError, createProfileClient } from "@notter/api-client";
import { profileSchema, type ProfileFormValues } from "@/features/onboarding/schemas/profile";
import { getApiBaseUrl } from "@/lib/env";
import { FormField } from "@/features/onboarding/components/form-field";
import { IntentPicker } from "@/features/onboarding/components/intent-picker";
import { PrimaryButton } from "@/features/onboarding/components/primary-button";

export function ProfileForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema) });

  async function onSubmit(values: ProfileFormValues) {
    setFormError(null);
    try {
      const client = createProfileClient({ baseUrl: getApiBaseUrl() });
      await client.create(values);
      router.push("/");
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
          id="fullName"
          label="Full name"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <FormField
          id="username"
          label="Username"
          autoComplete="username"
          placeholder="jane_doe"
          error={errors.username?.message}
          {...register("username")}
        />
        <Controller
          name="intent"
          control={control}
          render={({ field }) => (
            <IntentPicker value={field.value} onChange={field.onChange} error={errors.intent?.message} />
          )}
        />
      </div>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="mt-auto pb-8">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Continue"}
        </PrimaryButton>
      </div>
    </form>
  );
}
