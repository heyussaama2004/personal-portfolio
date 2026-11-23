import { NextIntlClientProvider } from "next-intl";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuoteForm } from "@/components/contact/quote-form";
import messages from "@/i18n/messages/en.json";

const services = [
  { id: "website", title: "Website development" },
  { id: "api", title: "API development" },
];

function renderForm(enabled: boolean) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <QuoteForm enabled={enabled} services={services} />
    </NextIntlClientProvider>,
  );
}

function fillValidForm(container: HTMLElement) {
  const form = container.querySelector("form") as HTMLFormElement;
  fireEvent.change(form.querySelector("#quote-name") as HTMLInputElement, {
    target: { value: "Ussama" },
  });
  fireEvent.change(form.querySelector("#quote-email") as HTMLInputElement, {
    target: { value: "hello@example.com" },
  });
  fireEvent.change(form.querySelector("#quote-projectType") as HTMLSelectElement, {
    target: { value: "website" },
  });
  fireEvent.change(form.querySelector("#quote-message") as HTMLTextAreaElement, {
    target: { value: "I need a fast accessible website with a clear contact flow." },
  });
  fireEvent.click(form.querySelector("#quote-consent") as HTMLInputElement);
  return form;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("QuoteForm", () => {
  it("does not render a submittable form when delivery is unconfigured", () => {
    const { container } = renderForm(false);

    expect(container.querySelector("form")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Direct submission isn't enabled yet.");
  });

  it("blocks invalid submission and shows localized field errors", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { container } = renderForm(true);
    const form = container.querySelector("form") as HTMLFormElement;

    fireEvent.submit(form);

    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
    expect((await screen.findAllByText("This field is required.")).length).toBeGreaterThan(0);
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Please describe your project in at least 20 characters.")).toBeInTheDocument();
    expect(screen.getByText("Please confirm that we may contact you.")).toBeInTheDocument();
  });

  it("clears the success message after the form is edited again", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: "ok" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { container } = renderForm(true);
    const form = fillValidForm(container);

    fireEvent.submit(form);

    expect(await screen.findByText("Your request has been sent.")).toBeInTheDocument();

    fireEvent.change(form.querySelector("#quote-name") as HTMLInputElement, {
      target: { value: "New name" },
    });

    expect(screen.queryByText("Your request has been sent.")).not.toBeInTheDocument();
  });
});
