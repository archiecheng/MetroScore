"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import { MOCK_CITIES, PURPOSE_OPTIONS } from "@/lib/data/mock-cities";
import { ANALYTICS_EVENTS } from "@/lib/analytics";

const formSchema = z
  .object({
    cityA: z.string().min(1, "Select City A"),
    cityB: z.string().min(1, "Select City B"),
    purpose: z.enum(["move", "primary_home", "rental_investment", "long_term_investment"], {
      error: "Select a purpose",
    }),
    email: z.string().optional(),
  })
  .refine((d) => d.cityA !== d.cityB, {
    message: "Please choose two different cities",
    path: ["cityB"],
  });

type FormState = {
  cityA: string;
  cityB: string;
  purpose: string;
  email: string;
};

interface CityCompareFormProps {
  showEmail?: boolean;
  defaultCityA?: string;
  defaultCityB?: string;
  defaultPurpose?: string;
  submitLabel?: string;
}

export default function CityCompareForm({
  showEmail = false,
  defaultCityA = "",
  defaultCityB = "",
  defaultPurpose = "",
  submitLabel = "Generate My City Comparison",
}: CityCompareFormProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const [form, setForm] = useState<FormState>({
    cityA: defaultCityA,
    cityB: defaultCityB,
    purpose: defaultPurpose,
    email: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();

    const emailValidation = showEmail
      ? z.email("Please enter a valid email")
      : z.string().optional();

    const schema = formSchema.and(z.object({ email: emailValidation }));
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    posthog?.capture(ANALYTICS_EVENTS.CITY_PAIR_SELECTED, {
      city_a: form.cityA,
      city_b: form.cityB,
      purpose: form.purpose,
    });
    posthog?.capture(ANALYTICS_EVENTS.CHECKOUT_STARTED, {
      city_a: form.cityA,
      city_b: form.cityB,
    });

    const params = new URLSearchParams({
      cityA: form.cityA,
      cityB: form.cityB,
      purpose: form.purpose,
    });
    router.push(`/view?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* City A */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">City A</label>
        <SelectField
          value={form.cityA}
          onChange={(v) => set("cityA", v)}
          placeholder="Select a city…"
          error={errors.cityA}
        >
          {MOCK_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </SelectField>
        {errors.cityA && <FieldError message={errors.cityA} />}
      </div>

      {/* VS divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          vs
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* City B */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">City B</label>
        <SelectField
          value={form.cityB}
          onChange={(v) => set("cityB", v)}
          placeholder="Select a city…"
          error={errors.cityB}
        >
          {MOCK_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </SelectField>
        {errors.cityB && <FieldError message={errors.cityB} />}
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Purpose
        </label>
        <SelectField
          value={form.purpose}
          onChange={(v) => set("purpose", v)}
          placeholder="Why are you comparing?"
          error={errors.purpose}
        >
          {PURPOSE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>
        {errors.purpose && <FieldError message={errors.purpose} />}
      </div>

      {/* Email — only on full form */}
      {showEmail && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className={`w-full border rounded-lg px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition ${
              errors.email ? "border-red-400" : "border-input"
            }`}
          />
          {errors.email ? (
            <FieldError message={errors.email} />
          ) : (
            <p className="text-xs text-muted-foreground mt-1.5">
              We&apos;ll send your report here after payment.
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
      >
        {submitLabel}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        One-time payment of $19 · Instant delivery · No subscription
      </p>
    </form>
  );
}

function SelectField({
  value,
  onChange,
  placeholder,
  error,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition appearance-none pr-10 ${
          error ? "border-red-400" : "border-input"
        } ${!value ? "text-muted-foreground" : ""}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="text-xs text-red-600 mt-1">{message}</p>;
}
