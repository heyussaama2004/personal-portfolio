import { expect, test } from "@playwright/test"

test("landing renders with honest empty contact state", async ({ page }) => {
  await page.goto("/en")

  await expect(page.getByRole("heading", { level: 1, name: "Ussama" })).toBeVisible()
  await expect(page.getByRole("link", { name: /Developer OS/i }).first()).toBeVisible()
  await expect(page.getByText(/Direct submission isn't enabled yet/i).first()).toBeVisible()
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr")
})

test("arabic landing uses right-to-left layout", async ({ page }) => {
  await page.goto("/ar")

  await expect(page.locator("html")).toHaveAttribute("lang", "ar")
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
})

test("project detail page renders confirmed content", async ({ page }) => {
  await page.goto("/en/projects/hrnexus")

  await expect(page.getByRole("heading", { level: 1, name: "HRNexus" })).toBeVisible()
  await expect(page.getByText(/HR and payroll/i).first()).toBeVisible()
  await expect(page.getByRole("link", { name: /Developer OS/i })).toBeVisible()
})
