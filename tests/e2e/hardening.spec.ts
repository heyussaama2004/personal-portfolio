import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

const keyRoutes = [
  "/en",
  "/en/projects",
  "/en/projects/hrnexus",
  "/en/privacy",
  "/en/os",
  "/en/quote",
]

async function setTheme(page: Page, theme: "dark" | "light") {
  await page.addInitScript((value) => {
    window.localStorage.setItem("ol-theme", value)
  }, theme)
}

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast"]) // checked separately by visual review; keep signal stable
    .analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
}

for (const locale of ["en", "fr", "ar"] as const) {
  for (const theme of ["dark", "light"] as const) {
    test(`axe: ${locale} home ${theme}`, async ({ page }) => {
      await setTheme(page, theme)
      await page.goto(`/${locale}`)
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme)
      await expectNoAxeViolations(page)
    })
  }
}

for (const route of keyRoutes) {
  test(`axe: route ${route}`, async ({ page }) => {
    await page.goto(route)
    await expectNoAxeViolations(page)
  })
}

test("keyboard: skip link and primary nav", async ({ page }) => {
  await page.goto("/en")
  await page.keyboard.press("Tab")
  const skip = page.getByRole("link", { name: "Skip to content" })
  await expect(skip).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#main")).toBeFocused()
})

test("rtl: arabic layout and logical alignment", async ({ page }) => {
  await page.goto("/ar")
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
  await expect(page.locator("html")).toHaveAttribute("lang", "ar")
  const main = page.locator("main#main")
  await expect(main).toBeVisible()
})
