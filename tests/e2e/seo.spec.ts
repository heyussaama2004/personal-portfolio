import { expect, test } from "@playwright/test";

test("home exposes SEO metadata and security headers", async ({ page }) => {
  const response = await page.goto("/en");

  expect(response?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(response?.headers()["permissions-policy"]).toContain("camera=()");

  await expect(page).toHaveTitle(/Ussama/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en$/);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute("href", /\/en$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Ussama/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );

  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(jsonLd).toContain('"@type":"Person"');
  expect(jsonLd).toContain('"@type":"WebSite"');
});

test("project detail exposes breadcrumbs, image alt text and per-project Open Graph image", async ({
  page,
  request,
}) => {
  await page.goto("/en/projects/hrnexus");

  const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
  expect(jsonLd).toContain('"@type":"BreadcrumbList"');
  await expect(page.getByRole("img", { name: "HRNexus preview" })).toBeVisible();

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toBeTruthy();
  const imageResponse = await request.get(ogImage!);
  expect(imageResponse.ok()).toBeTruthy();
  expect(imageResponse.headers()["content-type"]).toContain("image/png");
});

test("Developer OS is marked noindex", async ({ page }) => {
  await page.goto("/en/os");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("privacy page explains real storage and contact behavior", async ({ page }) => {
  await page.goto("/en/privacy");

  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await expect(page.getByText(/Only non-personal preferences/i)).toBeVisible();
  await expect(page.getByText(/Analytics are disabled by default/i)).toBeVisible();
});

test("robots and sitemap expose locale alternates", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Sitemap:");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const body = await sitemap.text();
  expect(body).toContain("/en/projects/hrnexus");
  expect(body).toContain("xhtml:link");
  expect(body).not.toContain("/en/os");
  expect(body).not.toContain("/en/quote");
});
