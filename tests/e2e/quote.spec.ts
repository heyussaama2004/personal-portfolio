import { expect, test, type Page } from "@playwright/test";

const contactEnabled = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);

async function fillQuoteForm(page: Page) {
  const form = page.locator("form");
  await form.getByLabel("Name").fill("Ussama");
  await form.getByLabel("Email").fill("hello@example.com");
  await form.getByLabel("Project type").selectOption({ label: "Website development" });
  await form
    .getByLabel("Message")
    .fill("I need a fast accessible website with a clear contact flow.");
  await form.getByLabel("I agree to be contacted about my request").check();
}

test.describe("quote form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/quote");
  });

  test("shows the unconfigured state without a submittable form", async ({ page }) => {
    test.skip(contactEnabled, "requires contact delivery to be unconfigured");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Open quote form");
    await expect(page.locator("form")).toHaveCount(0);
    await expect(
      page.getByText("Direct submission isn't enabled yet. Contact channels will appear here once configured."),
    ).toBeVisible();
  });

  test("shows localized validation errors before submitting", async ({ page }) => {
    test.skip(!contactEnabled, "requires contact delivery to be enabled");

    await page.locator("form").getByRole("button", { name: "Send request" }).click();

    await expect(page.locator("form").getByText("This field is required.").first()).toBeVisible();
    await expect(page.locator("form").getByText("Enter a valid email address.")).toBeVisible();
  });

  test("shows the success state", async ({ page }) => {
    test.skip(!contactEnabled, "requires contact delivery to be enabled");

    await page.route("**/api/quote", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ code: "ok" }),
      });
    });

    await fillQuoteForm(page);
    await page.locator("form").getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText("Your request has been sent.")).toBeVisible();
  });

  test("shows the error state", async ({ page }) => {
    test.skip(!contactEnabled, "requires contact delivery to be enabled");

    await page.route("**/api/quote", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ code: "disabled" }),
      });
    });

    await fillQuoteForm(page);
    await page.locator("form").getByRole("button", { name: "Send request" }).click();

    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Direct submission isn't enabled yet.",
    );
  });
});
