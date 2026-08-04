"use client";

import { useState } from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { contact } from "@/content/contact";
import { site, socials, shantichakraGroup } from "@/lib/site";
import { formspreeEndpoint } from "@/lib/site";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Container,
  Reveal,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const socialIcons: Record<string, typeof Facebook> = {
  facebook: Facebook,
  tiktok: MessageCircle,
  youtube: Youtube,
  instagram: Instagram,
};

type Status = "idle" | "sending" | "success" | "error" | "unconfigured";

export function Contact() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const endpoint = formspreeEndpoint();

    if (!endpoint) {
      setStatus("unconfigured");
      toast({
        title: t(contact.form.status.unconfigured),
        description: `${t({ en: "Email directly", bn: "সরাসরি ইমেইল করুন" })}: ${site.email}`,
        tone: "warning",
        duration: 7000,
      });
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        setStatus("success");
        toast({
          title: t({ en: "Message sent", bn: "বার্তা পাঠানো হয়েছে" }),
          description: t(contact.form.status.success),
          tone: "success",
          duration: 5500,
        });
      } else {
        setStatus("error");
        toast({ title: t(contact.form.status.error), tone: "error" });
      }
    } catch {
      setStatus("error");
      toast({ title: t(contact.form.status.error), tone: "error" });
    }
  }

  const methods: Array<{
    icon: typeof Mail;
    label: { bn: string; en: string };
    value: string;
    href?: string;
    copyValue?: string;
  }> = [
    { icon: Mail, label: { bn: "ইমেইল", en: "Email" }, value: site.email, href: `mailto:${site.email}`, copyValue: site.email },
    { icon: MessageCircle, label: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" }, value: site.phoneDisplay, href: site.whatsapp, copyValue: site.phoneDisplay },
    { icon: Phone, label: { bn: "ফোন করুন", en: "Call" }, value: site.phoneDisplay, href: `tel:${site.phoneHref}`, copyValue: site.phoneDisplay },
    { icon: MapPin, label: { bn: "অবস্থান", en: "Location" }, value: t(site.location), href: undefined },
  ];

  return (
    <Section id="contact" className="bg-canvas-subtle/60">
      <Container>
        <SectionHeading
          eyebrow={t(contact.eyebrow)}
          title={t(contact.title)}
          subtitle={t(contact.subtitle)}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: info */}
          <div className="flex flex-col gap-6">
            <Reveal direction="left">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
                  {t(contact.methodsTitle)}
                </h3>
                {methods.map((m) => {
                  const Icon = m.icon;
                  const inner = (
                    <>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-canvas-muted text-fg-soft transition-colors group-hover:bg-brand-500/12 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-fg-muted">
                          {t(m.label)}
                        </span>
                        <span className="block truncate text-sm font-semibold text-fg">
                          {m.value}
                        </span>
                      </span>
                    </>
                  );
                  const copyable = m.copyValue ? (
                    <CopyButton
                      value={m.copyValue}
                      className="shrink-0"
                      toastTitle={t({ en: "Copied", bn: "কপি হয়েছে" })}
                    />
                  ) : null;

                  /* The copy control is a sibling of the link, never nested
                     inside it — an interactive element inside an anchor is
                     invalid and breaks keyboard navigation. */
                  return (
                    <div
                      key={m.label.en}
                      className="group flex items-center gap-2 rounded-2xl border border-border/10 bg-surface/60 pr-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/25"
                    >
                      {m.href ? (
                        <a
                          href={m.href}
                          target={m.href.startsWith("http") ? "_blank" : undefined}
                          rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex min-w-0 flex-1 items-center gap-3 p-4"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="flex min-w-0 flex-1 items-center gap-3 p-4">{inner}</div>
                      )}
                      {copyable}
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal direction="left" delay={100}>
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-fg-muted">
                  {t(contact.socialTitle)}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {socials.map((s) => {
                    const Icon = socialIcons[s.key] ?? Facebook;
                    return (
                      <a
                        key={s.key}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-2xl border border-border/10 bg-surface/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/25"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas-muted text-fg-soft transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{s.name}</span>
                          <span className="block truncate text-xs text-fg-muted">{s.handle}</span>
                        </span>
                      </a>
                    );
                  })}
                </div>
                <a
                  href={shantichakraGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-1 flex items-center gap-3 rounded-2xl border border-brand-500/20 bg-brand-500/[0.06] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/40"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-lg">
                    🩸
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {t({ bn: "শান্তিচক্র ব্লাড সোসাইটি", en: "Shantichakra Blood Society" })}
                    </span>
                    <span className="block truncate text-xs text-fg-muted">
                      {t({ bn: "ফেসবুক গ্রুপে যোগ দিন", en: "Join Facebook Group" })}
                    </span>
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal direction="left" delay={160}>
              <div className="flex items-center gap-3 rounded-2xl border border-border/10 bg-surface/60 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-500">
                  ⚡
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{t(contact.response.title)}</div>
                  <div className="text-xs text-fg-muted">{t(contact.response.sub)}</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal direction="right">
            <div className="card-surface rounded-4xl p-7 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold tracking-tight">
                  {t(contact.form.title)}
                </h3>
                <p className="mt-1 text-sm text-fg-muted">
                  {t(contact.form.subtitle)}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="name"
                    label={t(contact.form.fields.name.label)}
                    placeholder={contact.form.fields.name.placeholder}
                    name="name"
                    required
                    autoComplete="name"
                  />
                  <Field
                    id="email"
                    type="email"
                    label={t(contact.form.fields.email.label)}
                    placeholder={contact.form.fields.email.placeholder}
                    name="email"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="phone"
                    type="tel"
                    label={t(contact.form.fields.phone.label)}
                    placeholder={contact.form.fields.phone.placeholder}
                    name="phone"
                    autoComplete="tel"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="subject" className="text-sm font-medium text-fg-soft">
                      {t(contact.form.fields.subject.label)}
                      <span className="text-brand-500"> *</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      defaultValue=""
                      className="h-11 rounded-xl border border-border/15 bg-canvas px-3.5 text-sm text-fg outline-none transition-colors focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="" disabled>
                        {t(contact.form.subjectPlaceholder)}
                      </option>
                      {contact.form.subjects.map((s) => (
                        <option key={s.value} value={s.value}>
                          {lang === "bn" ? s.bn : s.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-fg-soft">
                    {t(contact.form.fields.message.label)}
                    <span className="text-brand-500"> *</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    placeholder={t(contact.form.fields.message.placeholder)}
                    className="resize-y rounded-xl border border-border/15 bg-canvas px-3.5 py-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted/70 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
                  />
                  <span className="text-xs text-fg-muted">
                    {t(contact.form.fields.message.helper)}
                  </span>
                </div>

                {/* Honeypot + subject line for Formspree */}
                <input type="hidden" name="_subject" value="New Contact from Rahat Ahmed Portfolio" />
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />

                <Button type="submit" size="lg" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {status === "sending"
                    ? t(contact.form.status.sending)
                    : t(contact.form.submit)}
                </Button>

                {status !== "idle" && status !== "sending" && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium",
                      status === "success" && "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
                      status === "error" && "bg-brand-500/12 text-brand-600 dark:text-brand-400",
                      status === "unconfigured" && "bg-amber-500/12 text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {t(contact.form.status[status])}
                  </p>
                )}

                <p className="text-center text-xs text-fg-muted">
                  {t(contact.form.privacy)}
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg-soft">
        {label}
        {props.required && <span className="text-brand-500"> *</span>}
      </label>
      <input
        id={id}
        className="h-11 rounded-xl border border-border/15 bg-canvas px-3.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted/70 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
        {...props}
      />
    </div>
  );
}
