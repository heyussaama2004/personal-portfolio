"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { quoteSchema } from "@/lib/contact/schema";

type ServiceOption = { id: string; title: string };

type FieldName = "name" | "email" | "projectType" | "budget" | "timeline" | "message" | "consent";

type FormState = Record<FieldName, string | boolean>;

const initialState: FormState = {
  name: "",
  email: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  consent: false,
};

function fieldId(name: FieldName) {
  return `quote-${name}`;
}

export function QuoteForm({
  enabled,
  services,
}: {
  enabled: boolean;
  services: ServiceOption[];
}) {
  const t = useTranslations("contact");
  const [form, setForm] = useState<FormState>(initialState);
  const [honeypot, setHoneypot] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusCode, setStatusCode] = useState<string>();

  function update(name: FieldName, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setStatus((current) => (current === "loading" ? current : "idle"));
    setStatusCode(undefined);
  }

  function describedBy(name: FieldName) {
    return errors[name] ? `${fieldId(name)}-error` : undefined;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});
    setStatusCode(undefined);

    const submission = {
      name: String(form.name),
      email: String(form.email),
      projectType: String(form.projectType),
      budget: String(form.budget) || undefined,
      timeline: String(form.timeline) || undefined,
      message: String(form.message),
      consent: form.consent === true,
      website: honeypot,
      startedAt,
    };
    const parsed = quoteSchema.safeParse(submission);
    if (!parsed.success) {
      const nextErrors: Partial<Record<FieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field !== "string") continue;
        if (field === "consent") nextErrors.consent = t("consentRequired");
        else if (field === "email") nextErrors.email = t("invalidEmail");
        else if (field === "message") nextErrors.message = t("minMessage");
        else if (field in initialState) nextErrors[field as FieldName] = t("required");
      }
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json().catch(() => ({}))) as {
        code?: string;
        fields?: Record<string, string>;
      };

      if (response.ok) {
        setStatus("success");
        setForm(initialState);
        setHoneypot("");
        setStartedAt(Date.now());
        return;
      }

      if (result.code === "invalid" && result.fields) {
        const mapped: Partial<Record<FieldName, string>> = {};
        for (const field of Object.keys(result.fields) as FieldName[]) {
          if (field === "consent") mapped.consent = t("consentRequired");
          else if (field === "email") mapped.email = t("invalidEmail");
          else if (field === "message") mapped.message = t("minMessage");
          else if (field in initialState) mapped[field] = t("required");
        }
        setErrors(mapped);
      }
      setStatusCode(result.code);
      setStatus("error");
    } catch {
      setStatusCode("network");
      setStatus("error");
    }
  }

  const fieldClass =
    "mt-2 h-11 w-full rounded-lg border border-line bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

  if (!enabled) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-dashed border-line bg-surface/60 p-6">
        <p role="status" className="text-sm text-muted">
          {t("unconfigured")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={status === "loading"}
        className="grid gap-5 rounded-2xl border border-line bg-surface/60 p-5 sm:p-7"
      >
        <div>
          <label htmlFor={fieldId("name")} className="text-sm font-medium">
            {t("name")}
          </label>
          <input
            id={fieldId("name")}
            name="name"
            required
            maxLength={80}
            value={String(form.name)}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={fieldClass}
          />
          {errors.name ? (
            <p id={`${fieldId("name")}-error`} role="alert" className="mt-1 text-xs text-danger">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("email")} className="text-sm font-medium">
            {t("email")}
          </label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            required
            maxLength={160}
            value={String(form.email)}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={fieldClass}
          />
          {errors.email ? (
            <p id={`${fieldId("email")}-error`} role="alert" className="mt-1 text-xs text-danger">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId("projectType")} className="text-sm font-medium">
            {t("projectType")}
          </label>
          <select
            id={fieldId("projectType")}
            name="projectType"
            required
            value={String(form.projectType)}
            onChange={(event) => update("projectType", event.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={describedBy("projectType")}
            className={fieldClass}
          >
            <option value="">—</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.projectType ? (
            <p
              id={`${fieldId("projectType")}-error`}
              role="alert"
              className="mt-1 text-xs text-danger"
            >
              {errors.projectType}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={fieldId("budget")} className="text-sm font-medium">
              {t("budget")}
            </label>
            <input
              id={fieldId("budget")}
              name="budget"
              maxLength={80}
              value={String(form.budget)}
              onChange={(event) => update("budget", event.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={fieldId("timeline")} className="text-sm font-medium">
              {t("timeline")}
            </label>
            <input
              id={fieldId("timeline")}
              name="timeline"
              maxLength={80}
              value={String(form.timeline)}
              onChange={(event) => update("timeline", event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor={fieldId("message")} className="text-sm font-medium">
            {t("message")}
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            required
            minLength={20}
            maxLength={4000}
            rows={6}
            value={String(form.message)}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            className="mt-2 w-full rounded-lg border border-line bg-surface p-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
          {errors.message ? (
            <p id={`${fieldId("message")}-error`} role="alert" className="mt-1 text-xs text-danger">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="quote-website">{t("honeypot")}</label>
          <input
            id="quote-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              id={fieldId("consent")}
              name="consent"
              type="checkbox"
              required
              checked={Boolean(form.consent)}
              onChange={(event) => update("consent", event.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={describedBy("consent")}
              className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
            />
            <span>{t("consent")}</span>
          </label>
          {errors.consent ? (
            <p
              id={`${fieldId("consent")}-error`}
              role="alert"
              className="mt-1 text-xs text-danger"
            >
              {errors.consent}
            </p>
          ) : null}
        </div>

        {status === "error" ? (
          <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm">
            {statusCode && statusCode !== "invalid"
              ? t(`status.${statusCode}`)
              : t("error")}
          </p>
        ) : null}
        {status === "success" ? (
          <p role="status" className="rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm">
            {t("success")}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  );
}
