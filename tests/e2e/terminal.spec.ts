import { expect, test } from "@playwright/test"

test.describe("terminal and command palette", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.clear()
      window.localStorage.removeItem("ol-os-windows")
    })
    await page.goto("/en/os")
    await page.getByRole("button", { name: "Skip" }).click()
  })

  test("terminal runs commands and suggests close matches", async ({ page }) => {
    const dock = page.getByRole("navigation", { name: "Dock" })
    const terminalButton = page.getByRole("button", { name: "Terminal" }).first()
    if (await dock.isVisible()) {
      await dock.getByRole("button", { name: "Terminal" }).click()
    } else {
      await terminalButton.click()
    }

    const terminal = page.getByRole("region", { name: "Terminal" })
    const input = terminal.getByRole("textbox")

    await input.fill("help")
    await input.press("Enter")
    await expect(terminal.getByText("Show commands")).toBeVisible()

    await input.fill("projcts")
    await input.press("Enter")
    await expect(terminal.getByText("Unknown command: projcts")).toBeVisible()
    await expect(terminal.getByText("Did you mean projects?")).toBeVisible()

    await input.fill("theme dark")
    await input.press("Enter")
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  })

  test("command palette opens with Ctrl+K and launches projects", async ({ page }) => {
    await page.keyboard.press("Control+k")

    const combobox = page.getByRole("combobox", { name: /Search projects/ })
    await expect(combobox).toBeFocused()
    await combobox.fill("hrn")
    await expect(page.getByRole("option", { name: "HRNexus" })).toBeVisible()
    await page.getByRole("option", { name: "HRNexus" }).click()

    await expect(page.getByRole("region", { name: "Projects" })).toBeVisible()
  })

  test("terminal opens a targeted project", async ({ page }) => {
    const dock = page.getByRole("navigation", { name: "Dock" })
    const terminalButton = page.getByRole("button", { name: "Terminal" }).first()
    if (await dock.isVisible()) {
      await dock.getByRole("button", { name: "Terminal" }).click()
    } else {
      await terminalButton.click()
    }
    const input = page.getByRole("region", { name: "Terminal" }).getByRole("textbox")
    await input.fill("open hrnexus")
    await input.press("Enter")

    const projects = page.getByRole("region", { name: "Projects" })
    await expect(projects.locator('[aria-current="true"]')).toContainText("HRNexus")
  })

  test("palette is a modal dialog that traps focus", async ({ page }) => {
    await page.keyboard.press("Control+k")

    const dialog = page.getByRole("dialog")
    await expect(dialog).toHaveAttribute("aria-modal", "true")
    await page.keyboard.press("Shift+Tab")

    const focusInsideDialog = await page.evaluate(() =>
      Boolean(document.activeElement?.closest('[role="dialog"]')),
    )
    expect(focusInsideDialog).toBe(true)
  })

  test("palette language action switches locale", async ({ page }) => {
    await page.keyboard.press("Control+k")
    const combobox = page.getByRole("combobox", { name: /Search projects/ })
    await combobox.fill("français")
    await page.getByRole("option", { name: "Français" }).click()

    await expect(page).toHaveURL(/\/fr\/os/)
  })
})
