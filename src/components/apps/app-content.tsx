"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "@/i18n/navigation";
import type { OsData } from "@/lib/os/types";
import type { WindowAppId } from "@/lib/os/window-manager/types";

export function AppContent({
  appId,
  data,
  onReplayBoot,
  onResetWindows,
}: {
  appId: WindowAppId;
  data: OsData;
  onReplayBoot: () => void;
  onResetWindows: () => void;
}) {
  const os = useTranslations("os");
  const common = useTranslations("common");
  const levels = useTranslations("skills");
  const projectT = useTranslations("projects");

  if (appId === "projects") {
    return (
      <div>
        <h2 className="text-lg font-semibold">{os("projects")}</h2>
        {data.projects.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{common("empty")}</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.projects.map((project) => (
              <li key={project.slug} className="rounded-lg border border-line bg-surface p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{project.title}</h3>
                  {project.featured ? (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase text-muted">
                      {projectT("featured")}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-primary"
                >
                  {common("open")}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (appId === "skills") {
    return (
      <div>
        <h2 className="text-lg font-semibold">{os("skills")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.skills.map((group) => (
            <div key={group.id} className="rounded-lg border border-line bg-surface p-4">
              <h3 className="font-medium">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center justify-between gap-2 text-sm">
                    <span>{skill.name}</span>
                    <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                      {levels(skill.level)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (appId === "about") {
    return (
      <div>
        <h2 className="text-lg font-semibold">{os("about")}</h2>
        <p className="mt-3 text-sm font-medium text-primary">{data.owner.headline}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{data.owner.bio}</p>
        <p className="mt-2 text-xs text-muted">{data.owner.location}</p>
        <h3 className="mt-6 text-sm font-semibold">{levels("experience")}</h3>
        <ul className="mt-3 space-y-3">
          {data.experience.map((item) => (
            <li key={item.id} className="rounded-lg border border-line bg-surface p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-muted">{item.organization}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (appId === "terminal") {
    return (
      <div>
        <h2 className="text-lg font-semibold">{os("terminal")}</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{os("terminalSoon")}</p>
      </div>
    );
  }

  if (appId === "presence") {
    return (
      <div>
        <h2 className="text-lg font-semibold">{os("presence")}</h2>
        {data.presence.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{common("empty")}</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {data.presence.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm hover:text-primary"
                >
                  {link.label}
                  <ExternalLink aria-hidden="true" size={14} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (appId === "contact") {
    return (
      <div>
        <h2 className="text-lg font-semibold">{os("contact")}</h2>
        {data.contact.configured ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.contact.email ? (
              <a
                href={`mailto:${data.contact.email}`}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background"
              >
                {data.contact.email}
              </a>
            ) : null}
            {data.contact.whatsapp ? (
              <a
                href={`https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-line px-4 py-2 text-sm"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">{common("noDirectContact")}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">{os("settings")}</h2>
      <div className="mt-5 flex flex-wrap gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
        <button
          type="button"
          onClick={onReplayBoot}
          className="rounded-lg border border-line px-4 py-2 text-sm hover:text-primary"
        >
          {os("replayBoot")}
        </button>
        <button
          type="button"
          onClick={onResetWindows}
          className="rounded-lg border border-line px-4 py-2 text-sm hover:text-primary"
        >
          {os("resetWindows")}
        </button>
      </div>
    </div>
  );
}
