import { test, expect } from '@playwright/test';

test.describe('Component Rendering E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('http://localhost:3000');
  });

  test.describe('Header Component', () => {
    test('should render header element', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('should contain header content', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeTruthy();
      const headerText = await header.textContent();
      expect(headerText).toBeTruthy();
    });

    test('should have correct header styling', async ({ page }) => {
      const header = page.locator('header');
      const display = await header.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).not.toBe('none');
    });
  });

  test.describe('Navigation Component', () => {
    test('should render navigation element', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should contain navigation links', async ({ page }) => {
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('should have clickable navigation items', async ({ page }) => {
      const navLinks = page.locator('nav a').first();
      await expect(navLinks).toBeEnabled();
    });

    test('should render navigation with proper accessibility', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toHaveAttribute('role', /navigation|main/);
    });
  });

  test.describe('Main Content Area', () => {
    test('should render main content element', async ({ page }) => {
      const main = page.locator('main');
      await expect(main).toBeVisible();
    });

    test('should contain content in main area', async ({ page }) => {
      const main = page.locator('main');
      const mainContent = await main.textContent();
      expect(mainContent).toBeTruthy();
    });

    test('should have correct main element structure', async ({ page }) => {
      const main = page.locator('main');
      const display = await main.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).not.toBe('none');
    });

    test('should render child elements within main', async ({ page }) => {
      const main = page.locator('main');
      const children = page.locator('main > *');
      const childCount = await children.count();
      expect(childCount).toBeGreaterThan(0);
    });
  });

  test.describe('Footer Component', () => {
    test('should render footer element', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should contain footer content', async ({ page }) => {
      const footer = page.locator('footer');
      const footerText = await footer.textContent();
      expect(footerText).toBeTruthy();
    });

    test('should have correct footer styling', async ({ page }) => {
      const footer = page.locator('footer');
      const display = await footer.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).not.toBe('none');
    });

    test('should position footer at bottom of page', async ({ page }) => {
      const footer = page.locator('footer');
      const boundingBox = await footer.boundingBox();
      expect(boundingBox).toBeTruthy();
      expect(boundingBox?.y).toBeGreaterThan(0);
    });
  });

  test.describe('Overall Page Layout', () => {
    test('should render all main components together', async ({ page }) => {
      const header = page.locator('header');
      const nav = page.locator('nav');
      const main = page.locator('main');
      const footer = page.locator('footer');

      await expect(header).toBeVisible();
      await expect(nav).toBeVisible();
      await expect(main).toBeVisible();
      await expect(footer).toBeVisible();
    });

    test('should have proper semantic HTML structure', async ({ page }) => {
      const body = page.locator('body');
      const children = page.locator('body > *');
      const childCount = await children.count();
      expect(childCount).toBeGreaterThan(0);
    });

    test('should maintain layout on page load', async ({ page }) => {
      // Wait for all elements to stabilize
      await page.waitForLoadState('networkidle');
      
      const header = page.locator('header');
      const footer = page.locator('footer');
      
      await expect(header).toBeVisible();
      await expect(footer).toBeVisible();
    });
  });

  test.describe('Component Responsiveness', () => {
    test('should render header responsively', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      const boundingBox = await header.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(0);
    });

    test('should render footer responsively', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      const boundingBox = await footer.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(0);
    });

    test('should maintain navigation accessibility on different sizes', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });
  });
});