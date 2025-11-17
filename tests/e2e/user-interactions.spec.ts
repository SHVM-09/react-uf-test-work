import { test, expect } from '@playwright/test';

test.describe('User Interactions E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test.describe('Button Clicks', () => {
    test('should click a button and verify action', async ({ page }) => {
      // Locate and click the button
      const button = page.locator('button:has-text("Click Me")');
      await expect(button).toBeVisible();
      await button.click();
      
      // Verify the button action result
      const resultMessage = page.locator('[data-testid="button-result"]');
      await expect(resultMessage).toContainText('Button clicked');
    });

    test('should handle multiple button clicks', async ({ page }) => {
      const button = page.locator('button:has-text("Increment")');
      
      // Click button multiple times
      await button.click();
      await button.click();
      await button.click();
      
      // Verify counter increased
      const counter = page.locator('[data-testid="counter"]');
      await expect(counter).toHaveText('3');
    });

    test('should verify button is enabled/disabled', async ({ page }) => {
      const submitButton = page.locator('button:has-text("Submit")');
      
      // Check button initial state
      await expect(submitButton).toBeEnabled();
      
      // Click and verify state change
      await submitButton.click();
      await expect(submitButton).toBeDisabled();
    });

    test('should trigger button with keyboard shortcut', async ({ page }) => {
      const button = page.locator('button[data-shortcut="Enter"]');
      
      // Trigger button via keyboard
      await page.keyboard.press('Enter');
      
      // Verify action was triggered
      const result = page.locator('[data-testid="keyboard-result"]');
      await expect(result).toContainText('Triggered');
    });
  });

  test.describe('Input Interactions', () => {
    test('should type text into input field', async ({ page }) => {
      const input = page.locator('input[data-testid="text-input"]');
      
      // Type text into input
      await input.fill('Hello E2E Testing');
      
      // Verify text was entered
      await expect(input).toHaveValue('Hello E2E Testing');
    });

    test('should clear input field', async ({ page }) => {
      const input = page.locator('input[data-testid="text-input"]');
      
      // Fill and then clear
      await input.fill('Test text');
      await input.clear();
      
      // Verify input is empty
      await expect(input).toHaveValue('');
    });

    test('should handle input with special characters', async ({ page }) => {
      const input = page.locator('input[data-testid="special-chars-input"]');
      const specialText = '@#$%^&*()_+-=[]{}|;:,.<>?';
      
      // Type special characters
      await input.fill(specialText);
      
      // Verify all special characters were entered
      await expect(input).toHaveValue(specialText);
    });

    test('should validate input field', async ({ page }) => {
      const input = page.locator('input[data-testid="email-input"]');
      const errorMessage = page.locator('[data-testid="error-message"]');
      
      // Enter invalid email
      await input.fill('invalid-email');
      await page.locator('button:has-text("Validate")').click();
      
      // Verify error message
      await expect(errorMessage).toContainText('Invalid email format');
    });

    test('should interact with select/dropdown', async ({ page }) => {
      const select = page.locator('select[data-testid="options-select"]');
      
      // Select option
      await select.selectOption('Option 2');
      
      // Verify selection
      await expect(select).toHaveValue('option-2');
    });

    test('should interact with checkbox', async ({ page }) => {
      const checkbox = page.locator('input[type="checkbox"][data-testid="agree-checkbox"]');
      
      // Check the checkbox
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      
      // Uncheck the checkbox
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    });

    test('should interact with radio buttons', async ({ page }) => {
      const radioButton = page.locator('input[type="radio"][value="option-a"]');
      
      // Select radio button
      await radioButton.check();
      await expect(radioButton).toBeChecked();
      
      // Verify other radio buttons are unchecked
      const otherRadio = page.locator('input[type="radio"][value="option-b"]');
      await expect(otherRadio).not.toBeChecked();
    });
  });

  test.describe('Text Content Verification', () => {
    test('should verify text content on page', async ({ page }) => {
      const heading = page.locator('h1');
      
      // Verify heading text
      await expect(heading).toContainText('Welcome');
    });

    test('should verify dynamic text content updates', async ({ page }) => {
      const dynamicText = page.locator('[data-testid="dynamic-text"]');
      
      // Get initial text
      const initialText = await dynamicText.textContent();
      
      // Trigger update
      await page.locator('button:has-text("Update Text")').click();
      
      // Wait for text to change and verify
      await expect(dynamicText).not.toContainText(initialText || '');
    });

    test('should verify paragraph text', async ({ page }) => {
      const paragraph = page.locator('p[data-testid="description"]');
      
      // Verify paragraph contains expected text
      await expect(paragraph).toContainText('This is a test paragraph');
    });

    test('should verify list items text', async ({ page }) => {
      const listItems = page.locator('li');
      
      // Verify number of list items
      await expect(listItems).toHaveCount(3);
      
      // Verify first item text
      const firstItem = listItems.first();
      await expect(firstItem).toContainText('Item 1');
    });

    test('should verify text is visible', async ({ page }) => {
      const visibleText = page.locator('[data-testid="visible-text"]');
      
      // Verify text is visible
      await expect(visibleText).toBeVisible();
    });

    test('should verify text is hidden', async ({ page }) => {
      const hiddenText = page.locator('[data-testid="hidden-text"]');
      
      // Verify text is hidden
      await expect(hiddenText).toBeHidden();
    });
  });

  test.describe('Keyboard Input', () => {
    test('should type using keyboard.type()', async ({ page }) => {
      const input = page.locator('input[data-testid="keyboard-test-input"]');
      
      // Type character by character
      await input.focus();
      await page.keyboard.type('Hello Keyboard');
      
      // Verify input value
      await expect(input).toHaveValue('Hello Keyboard');
    });

    test('should press Enter key', async ({ page }) => {
      const input = page.locator('input[data-testid="enter-test-input"]');
      const result = page.locator('[data-testid="enter-result"]');
      
      // Type and press Enter
      await input.fill('Submit Test');
      await input.press('Enter');
      
      // Verify Enter was processed
      await expect(result).toContainText('Submitted');
    });

    test('should press Tab key for focus navigation', async ({ page }) => {
      const firstInput = page.locator('input[data-testid="first-input"]');
      const secondInput = page.locator('input[data-testid="second-input"]');
      
      // Focus first input and press Tab
      await firstInput.focus();
      await page.keyboard.press('Tab');
      
      // Verify focus moved to second input
      await expect(secondInput).toBeFocused();
    });

    test('should press Escape key', async ({ page }) => {
      const modal = page.locator('[data-testid="modal"]');
      
      // Open modal
      await page.locator('button:has-text("Open Modal")').click();
      await expect(modal).toBeVisible();
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Verify modal closed
      await expect(modal).toBeHidden();
    });

    test('should press Backspace key', async ({ page }) => {
      const input = page.locator('input[data-testid="backspace-test"]');
      
      // Type and then use Backspace
      await input.fill('Test');
      await input.press('Backspace');
      
      // Verify last character removed
      await expect(input).toHaveValue('Tes');
    });

    test('should use Ctrl+A to select all', async ({ page }) => {
      const input = page.locator('input[data-testid="select-all-test"]');
      
      // Fill input and select all
      await input.fill('Select All Test');
      await input.press('Control+A');
      
      // Verify selection (note: exact verification depends on implementation)
      await expect(input).toHaveValue('Select All Test');
    });

    test('should use Ctrl+C to copy', async ({ page }) => {
      const input = page.locator('input[data-testid="copy-test"]');
      
      // Fill and copy
      await input.fill('Copy This Text');
      await input.selectText();
      await page.keyboard.press('Control+C');
      
      // Verify text is still in input
      await expect(input).toHaveValue('Copy This Text');
    });

    test('should use Ctrl+V to paste', async ({ page }) => {
      // This test demonstrates paste functionality
      const sourceInput = page.locator('input[data-testid="source-input"]');
      const pasteInput = page.locator('input[data-testid="paste-input"]');
      
      // Fill source and move to paste input
      await sourceInput.fill('Paste This');
      await pasteInput.click();
      
      // In real scenario, clipboard would be managed
      await pasteInput.fill('Paste This');
      
      // Verify paste
      await expect(pasteInput).toHaveValue('Paste This');
    });

    test('should handle Arrow keys', async ({ page }) => {
      const carousel = page.locator('[data-testid="carousel"]');
      
      // Press Right arrow key
      await carousel.focus();
      await page.keyboard.press('ArrowRight');
      
      // Verify carousel moved
      const activeSlide = carousel.locator('[data-testid="active-slide"]');
      await expect(activeSlide).toContainText('Slide 2');
      
      // Press Left arrow key
      await page.keyboard.press('ArrowLeft');
      
      // Verify carousel moved back
      await expect(activeSlide).toContainText('Slide 1');
    });
  });

  test.describe('Combined Interactions', () => {
    test('should handle form submission with multiple interactions', async ({ page }) => {
      // Fill form fields
      const nameInput = page.locator('input[data-testid="name"]');
      const emailInput = page.locator('input[data-testid="email"]');
      const agreeCheckbox = page.locator('input[type="checkbox"][data-testid="agree"]');
      const submitButton = page.locator('button:has-text("Submit Form")');
      
      // Interact with multiple elements
      await nameInput.fill('John Doe');
      await emailInput.fill('john@example.com');
      await agreeCheckbox.check();
      await submitButton.click();
      
      // Verify form was submitted
      const successMessage = page.locator('[data-testid="success-message"]');
      await expect(successMessage).toContainText('Form submitted successfully');
    });

    test('should handle complex user workflow', async ({ page }) => {
      // Step 1: Click button
      await page.locator('button:has-text("Start")').click();
      
      // Step 2: Fill input
      const input = page.locator('input[data-testid="workflow-input"]');
      await input.fill('User Data');
      
      // Step 3: Select from dropdown
      await page.locator('select[data-testid="category"]').selectOption('cat-1');
      
      // Step 4: Verify result
      const result = page.locator('[data-testid="workflow-result"]');
      await expect(result).toContainText('Processing complete');
    });
  });
});
