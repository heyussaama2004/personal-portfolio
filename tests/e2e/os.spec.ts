import { expect, test } from "@playwright/test";

test.describe("developer OS", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.clear();
      window.localStorage.removeItem("ol-os-windows");
    });
  });

  test("boot can be skipped and windows can be opened and closed", async ({ page }) => {
    await page.goto("/en/os");

    await expect(page.getByRole("button", { name: "Skip" })).toBeVisible();
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page.getByRole("navigation", { name: "Dock" })).toBeVisible();

    const dock = page.getByRole("navigation", { name: "Dock" });
    await dock.getByRole("button", { name: "Projects" }).click();
    await expect(page.getByRole("region", { name: "Projects" })).toBeVisible();

    await page.getByRole("button", { name: "Close window" }).click();
    await expect(page.getByRole("region", { name: "Projects" })).toHaveCount(0);

    await page.reload();
    await expect(page.getByRole("button", { name: "Skip" })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Dock" })).toBeVisible();
  });

  test.describe("mobile", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("launcher opens a full-screen app and browser back returns", async ({ page }) => {
      await page.goto("/en/os");
      await page.getByRole("button", { name: "Skip" }).click();

      await page.getByRole("button", { name: "Skills" }).click();
      await expect(page.getByRole("button", { name: "Back to launcher" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Skills" })).toBeVisible();

      await page.goBack();
      await expect(page.getByRole("button", { name: "Back to launcher" })).toHaveCount(0);
    });
  });
});
