import { expect, test } from "@playwright/test"

test.describe("developer OS", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.clear()
      window.localStorage.removeItem("ol-os-windows")
    })
  })

  test("boot can be skipped and windows can be opened and closed", async ({ page }) => {
    await page.goto("/en/os")

    await expect(page.getByRole("button", { name: "Skip" })).toBeVisible()
    await page.getByRole("button", { name: "Skip" }).click()

    const desktop = page.getByRole("navigation", { name: "Dock" })
    const mobile = page.getByRole("button", { name: "Projects" }).first()
    if (await desktop.isVisible()) {
      await desktop.getByRole("button", { name: "Projects" }).click()
    } else {
      await mobile.click()
    }
    await expect(page.getByRole("region", { name: "Projects" })).toBeVisible()

    const closeWindow = page.getByRole("button", { name: "Close window" })
    if (await closeWindow.count()) {
      await closeWindow.click()
      await expect(page.getByRole("region", { name: "Projects" })).toHaveCount(0)
    } else {
      await page.getByRole("button", { name: "Back to launcher" }).click()
      await expect(page.getByRole("button", { name: "Back to launcher" })).toHaveCount(0)
    }

    await page.reload()
    await expect(page.getByRole("button", { name: "Skip" })).toHaveCount(0)
  })

  test.describe("mobile", () => {
    test.use({ viewport: { width: 390, height: 844 } })

    test("launcher opens a full-screen app and browser back returns", async ({ page }) => {
      await page.goto("/en/os")
      await page.getByRole("button", { name: "Skip" }).click()

      await page.getByRole("button", { name: "Skills" }).click()
      await expect(page.getByRole("button", { name: "Back to launcher" })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Skills" })).toBeVisible()

      await page.goBack()
      await expect(page.getByRole("button", { name: "Back to launcher" })).toHaveCount(0)
    })
  })
})
