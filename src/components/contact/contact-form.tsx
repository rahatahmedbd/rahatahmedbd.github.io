"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const EMPTY_VALUES: ContactFormValues = { name: "", email: "", message: "" };

/**
 * Contact form — saves messages to Supabase (public.contact_messages via
 * POST /api/contact). Additive: the existing mailto/WhatsApp/social links
 * remain alongside this form.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const validate = (next: ContactFormValues): FieldErrors => {
    const errors: FieldErrors = {};
    if (!next.name.trim()) {
      errors.name = "Please enter your name.";
    }
    if (!next.email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(next.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!next.message.trim()) {
      errors.message = "Please write a short message.";
    }
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setServerError("");

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        let message = "Something went wrong. Please try again.";
        try {
          const body = (await response.json()) as { error?: string };
          if (body.error) {
            message = body.error;
          }
        } catch {
          // Keep the generic message if the response is not JSON.
        }
        setServerError(message);
        setStatus("error");
        return;
      }

      setValues(EMPTY_VALUES);
      setFieldErrors({});
      setStatus("success");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const updateField = (field: keyof ContactFormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (fieldErrors[field]) {
      const nextErrors = { ...fieldErrors };
      delete nextErrors[field];
      setFieldErrors(nextErrors);
    }
    if (status === "error") {
      setStatus("idle");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-md)] sm:p-8"
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
          >
            Name
          </label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            className={fieldErrors.name ? "border-[var(--color-error)]" : undefined}
          />
          {fieldErrors.name ? (
            <p className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
          >
            Email
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            className={fieldErrors.email ? "border-[var(--color-error)]" : undefined}
          />
          {fieldErrors.email ? (
            <p className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-primary)]"
          >
            Message
          </label>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="Tell me about your project or question…"
            value={values.message}
            onChange={(e) => updateField("message", e.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
            className={fieldErrors.message ? "border-[var(--color-error)]" : undefined}
          />
          {fieldErrors.message ? (
            <p className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
              {fieldErrors.message}
            </p>
          ) : null}
        </div>

        {status === "success" ? (
          <div
            role="status"
            className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 p-4 text-sm text-[var(--color-text-primary)]"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 flex-none text-[var(--color-success)]"
              aria-hidden="true"
            />
            <p>
              <span className="font-semibold">Message sent successfully.</span> Thank you — I
              usually respond within 24 hours.
            </p>
          </div>
        ) : null}

        {status === "error" ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-4 text-sm text-[var(--color-text-primary)]"
          >
            <AlertCircle
              className="mt-0.5 h-5 w-5 flex-none text-[var(--color-error)]"
              aria-hidden="true"
            />
            <p>{serverError}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] px-8 text-base font-medium text-white shadow-[var(--shadow-md)] transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[var(--color-brand-primary-dark)] hover:shadow-[var(--shadow-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-5 w-5" aria-hidden="true" />
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );
}
