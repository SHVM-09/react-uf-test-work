/**
 * E2E Tests for App Navigation and Loading
 * Tests for app loading, main content rendering, and console error monitoring
 */

import { test, expect } from '@playwright/test';

test.describe('App Navigation and Loading', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test('should load the application successfully', async ({ page }) => {
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that the page title is defined
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Verify the page is not showing an error state
    const errorElement = await page.$('[role="alert"]');
    expect(errorElement).toBeNull();
  });

  test('should render main content correctly', async ({ page }) => {
    // Wait for the main content to be visible
    await page.waitForSelector('main', { timeout: 5000 }).catch(() => {
      // If main selector doesn't exist, check for common content containers
      return page.waitForSelector('[role="main"], body > div', { timeout: 5000 });
    });
    
    // Verify main content is visible
    const mainContent = await page.locator('main, [role="main"]').first();
    await expect(mainContent).toBeVisible();
    
    // Check that the app container has rendered
    const appContainer = await page.locator('body > div').first();
    expect(appContainer).toBeDefined();
  });

  test('should not have console errors on app load', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    // Listen for console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });
    
    // Wait for the app to fully load
    await page.waitForLoadState('networkidle');
    
    // Give additional time for any runtime errors to appear
    await page.waitForTimeout(2000);
    
    // Filter out non-critical warnings
    const criticalErrors = consoleErrors.filter(
      (error) => !error.includes('ResizeObserver') && !error.includes('Non-Error promise rejection')
    );
    
    // Assert no critical console errors
    expect(criticalErrors).toEqual([]);
  });

  test('should monitor and report uncaught exceptions', async ({ page }) => {
    const uncaughtErrors: string[] = [];
    
    // Listen for uncaught exceptions
    page.on('pageerror', (error) => {
      uncaughtErrors.push(error.message);
    });
    
    // Load the app
    await page.waitForLoadState('networkidle');
    
    // Give time for any errors to occur
    await page.waitForTimeout(1000);
    
    // Assert no uncaught exceptions
    expect(uncaughtErrors).toEqual([]);
  });

  test('should have correct DOM structure', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for common app structure elements
    const htmlElement = await page.$('html');
    expect(htmlElement).toBeDefined();
    
    const bodyElement = await page.$('body');
    expect(bodyElement).toBeDefined();
    
    // Verify body has children (rendered React app)
    const bodyChildren = await page.$$('body > *');
    expect(bodyChildren.length).toBeGreaterThan(0);
  });

  test('should handle navigation without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    // Wait for initial load
    await page.waitForLoadState('networkidle');
    
    // Attempt to interact with the page
    const links = await page.$$('a');
    
    // If there are clickable links, try clicking one
    if (links.length > 0) {
      const href = await links[0].getAttribute('href');
      if (href && !href.startsWith('javascript:')) {
        await page.click('a').catch(() => {
          // Link click might not always succeed
        });
      }
    }
    
    await page.waitForTimeout(1000);
    
    // Filter non-critical errors
    const criticalErrors = errors.filter(
      (error) => !error.includes('ResizeObserver') && !error.includes('Non-Error promise rejection')
    );
    
    expect(criticalErrors).toEqual([]);
  });
});
