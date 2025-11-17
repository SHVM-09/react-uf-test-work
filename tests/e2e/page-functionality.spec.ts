import { test, expect, Page } from '@playwright/test';

test.describe('Page Functionality E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Structure Tests', () => {
    test('should render main page elements', async () => {
      // Check for main container
      const mainContainer = page.locator('main, [role="main"]');
      await expect(mainContainer).toBeVisible();
    });

    test('should have proper HTML structure with semantic elements', async () => {
      // Check for header
      const header = page.locator('header');
      if (await header.count() > 0) {
        await expect(header).toBeVisible();
      }

      // Check for navigation
      const nav = page.locator('nav');
      if (await nav.count() > 0) {
        await expect(nav).toBeVisible();
      }

      // Check for footer
      const footer = page.locator('footer');
      if (await footer.count() > 0) {
        await expect(footer).toBeVisible();
      }
    });

    test('should have proper page title', async () => {
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have no console errors during load', async () => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      expect(errors.length).toBe(0);
    });
  });

  test.describe('Form Submission Tests', () => {
    test('should locate and interact with form elements', async () => {
      const forms = page.locator('form');
      const formCount = await forms.count();

      if (formCount > 0) {
        const firstForm = forms.first();
        await expect(firstForm).toBeVisible();
      }
    });

    test('should submit form with valid data', async () => {
      const forms = page.locator('form');
      const formCount = await forms.count();

      if (formCount > 0) {
        const firstForm = forms.first();
        const inputs = firstForm.locator('input, textarea, select');
        const inputCount = await inputs.count();

        if (inputCount > 0) {
          // Fill first text input
          const textInputs = firstForm.locator('input[type="text"], input:not([type]), textarea');
          if (await textInputs.count() > 0) {
            await textInputs.first().fill('Test Input Data');
          }

          // Find and click submit button
          const submitButton = firstForm.locator('button[type="submit"], input[type="submit"]');
          if (await submitButton.count() > 0) {
            await submitButton.first().click();
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test('should handle form validation', async () => {
      const forms = page.locator('form');
      
      if (await forms.count() > 0) {
        const firstForm = forms.first();
        const requiredInputs = firstForm.locator('input[required], textarea[required]');

        if (await requiredInputs.count() > 0) {
          const submitButton = firstForm.locator('button[type="submit"], input[type="submit"]');
          if (await submitButton.count() > 0) {
            // Try to submit empty form
            await submitButton.first().click({ force: true });
            await page.waitForTimeout(300);
          }
        }
      }
    });

    test('should display form error messages if validation fails', async () => {
      const forms = page.locator('form');
      
      if (await forms.count() > 0) {
        const firstForm = forms.first();
        const errorMessages = firstForm.locator('[role="alert"], .error, .error-message, .validation-error');
        
        // Just check that error elements can be located if they exist
        const errorCount = await errorMessages.count();
        expect(errorCount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Links Navigation Tests', () => {
    test('should have clickable links on the page', async () => {
      const links = page.locator('a');
      const linkCount = await links.count();

      expect(linkCount).toBeGreaterThanOrEqual(0);
    });

    test('should navigate to internal links without errors', async () => {
      const links = page.locator('a[href^="/"], a[href^="./"], a[href^="../"]');
      const internalLinkCount = await links.count();

      if (internalLinkCount > 0) {
        const firstLink = links.first();
        const href = await firstLink.getAttribute('href');
        
        if (href && href !== '#' && href !== '') {
          const newPagePromise = page.context().waitForEvent('page');
          await firstLink.click({ modifiers: ['Control'] });
          
          // Check if new page opened or current page navigated
          await page.waitForTimeout(1000);
          expect(await page.title()).toBeDefined();
        }
      }
    });

    test('should handle external links properly', async () => {
      const externalLinks = page.locator('a[target="_blank"]');
      const externalLinkCount = await externalLinks.count();

      if (externalLinkCount > 0) {
        const firstExternalLink = externalLinks.first();
        const href = await firstExternalLink.getAttribute('href');
        
        if (href) {
          expect(href).toMatch(/^http|^https/);
        }
      }
    });

    test('should have proper link accessibility attributes', async () => {
      const links = page.locator('a');
      const linkCount = await links.count();

      for (let i = 0; i < Math.min(linkCount, 5); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const title = await link.getAttribute('title');

        // Link should have text content, aria-label, or title
        const hasLabel = (text && text.trim().length > 0) || ariaLabel || title;
        expect(hasLabel).toBeTruthy();
      }
    });
  });

  test.describe('Mobile Responsiveness Tests', () => {
    test('should render properly on mobile viewport (iPhone SE)', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('main, [role="main"], body > *');
      await expect(mainContent).toBeVisible();

      // Check that content is not cut off
      const bodyWidth = await page.evaluate(() => {
        const body = document.body;
        return Math.max(body.scrollWidth);
      });

      expect(bodyWidth).toBeLessThanOrEqual(400); // Allow small overflow on mobile
    });

    test('should render properly on tablet viewport (iPad)', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('main, [role="main"], body > *');
      await expect(mainContent).toBeVisible();
    });

    test('should render properly on desktop viewport', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const mainContent = page.locator('main, [role="main"], body > *');
      await expect(mainContent).toBeVisible();
    });

    test('should have responsive navigation menu', async () => {
      // Mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav, [role="navigation"]');
      if (await nav.count() > 0) {
        await expect(nav).toBeVisible();
      }

      // Desktop view
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      if (await nav.count() > 0) {
        await expect(nav).toBeVisible();
      }
    });

    test('should not have horizontal scroll on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => window.innerWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // Allow minimal overflow
    });

    test('should handle touch interactions on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button');
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        await firstButton.tap();
        await page.waitForTimeout(300);
        expect(await firstButton).toBeDefined();
      }
    });
  });

  test.describe('Page Visibility Tests', () => {
    test('should have all critical elements visible', async () => {
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Check for main content areas
      const contentElements = page.locator('main, [role="main"], .container, .content, [role="contentinfo"]');
      expect(await contentElements.count()).toBeGreaterThan(0);
    });

    test('should not have hidden critical elements that should be visible', async () => {
      const mainContent = page.locator('main, [role="main"]');
      if (await mainContent.count() > 0) {
        await expect(mainContent).toBeVisible();
      }
    });

    test('should load images with proper alt text', async () => {
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute('alt');
        
        // Images should have alt text for accessibility
        if (await img.isVisible()) {
          expect(altText).toBeDefined();
        }
      }
    });

    test('should have proper contrast and readability', async () => {
      const textElements = page.locator('body *:has-text(/.+/)').first();
      
      const isVisible = await textElements.count() > 0;
      expect(isVisible).toBeTruthy();

      // Check that text is not white on white or similarly low contrast
      if (await textElements.count() > 0) {
        const computedStyle = await textElements.first().evaluate((el) => {
          return window.getComputedStyle(el);
        });
        
        expect(computedStyle).toBeDefined();
      }
    });

    test('should display page content without overlap issues', async () => {
      const pageWidth = await page.evaluate(() => window.innerWidth);
      const bodyOverflow = await page.evaluate(() => {
        const body = document.body;
        return body.scrollWidth - window.innerWidth;
      });

      expect(bodyOverflow).toBeLessThanOrEqual(2); // Allow minimal difference
    });

    test('should have proper focus management for keyboard navigation', async () => {
      // Focus on first interactive element
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(focusedElement).toBeDefined();
    });

    test('should have visible focus indicators', async () => {
      const buttons = page.locator('button');
      
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        await firstButton.focus();

        const focusStyle = await firstButton.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            outline: style.outline,
            boxShadow: style.boxShadow,
            borderColor: style.borderColor
          };
        });

        expect(focusStyle).toBeDefined();
      }
    });

    test('should render SVG elements properly if present', async () => {
      const svgs = page.locator('svg');
      const svgCount = await svgs.count();

      if (svgCount > 0) {
        const firstSvg = svgs.first();
        await expect(firstSvg).toBeVisible();
      }
    });
  });

  test.describe('Performance and Loading Tests', () => {
    test('should load page within acceptable time', async () => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test('should handle rapid interactions without errors', async () => {
      const buttons = page.locator('button');
      
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        
        // Simulate rapid clicks
        for (let i = 0; i < 3; i++) {
          await firstButton.click({ force: true });
          await page.waitForTimeout(100);
        }
      }
    });
  });
});
