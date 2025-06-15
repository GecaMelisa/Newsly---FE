import { Builder, By, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { createDriver } from "../setup";

jest.setTimeout(90000); // Extend timeout for UI tests

describe("System Test: Registration", () => {
  let driver: WebDriver;
  const BASE_URL = "https://newsly-fe.onrender.com";
  // Test data for registration
  const TEST_NAME = "Test User";
  const TEST_EMAIL = `test${Date.now()}@example.com`;
  const TEST_PASSWORD = "testPassword123";

  beforeAll(async () => {
    // Use the shared driver setup function
    driver = await createDriver();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("User can access registration page and submit form", async () => {
    try {
      await driver.get(BASE_URL);
      await driver.sleep(5000);

      // Try to find the register link by href attribute
      const registerButton = await driver.findElement(
        By.css("a[href='/register']")
      );

      // Click the register button to navigate to registration page
      await registerButton.click();

      // Wait for page transition
      await driver.sleep(5000);

      // Find form elements
      const nameField = await driver.findElement(By.css("input[type='text']"));
      const emailField = await driver.findElement(
        By.css("input[type='email']")
      );
      const passwordField = await driver.findElement(
        By.css("input[type='password']")
      );
      const submitButton = await driver.findElement(
        By.css("button[type='submit']")
      );

      await nameField.clear();
      await emailField.clear();
      await passwordField.clear();

      // Enter registration details
      await nameField.sendKeys(TEST_NAME);
      await emailField.sendKeys(TEST_EMAIL);
      await passwordField.sendKeys(TEST_PASSWORD);

      // Submit form
      await submitButton.click();

      // Wait for form submission to complete
      await driver.sleep(5000);

      // Get the current URL after submission
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes("/login")) {
        // Case 1: Successful registration
        console.log("Registration successful - redirected to login page");

        // Verify we're on the login page by finding login form elements
        const loginEmailField = await driver.findElement(
          By.css("input[type='email']")
        );
        const loginPasswordField = await driver.findElement(
          By.css("input[type='password']")
        );

        expect(await loginEmailField.isDisplayed()).toBe(true);
        expect(await loginPasswordField.isDisplayed()).toBe(true);
      } else if (currentUrl.includes("/register")) {
        // Case 2: Still on registration page (likely due to validation error or email already in use)
        console.log(
          "Registration form submitted but remained on register page - checking for error messages"
        );

        const formStillVisible = await nameField.isDisplayed();
        expect(formStillVisible).toBe(true);

        try {
          const errorMessage = await driver.findElement(
            By.css(".error, .alert, [role='alert']")
          );
          console.log("Registration error:", await errorMessage.getText());
        } catch (e) {
          console.log("No error message found, but form is still visible");
        }
      } else {
        throw new Error(`Unexpected redirect to: ${currentUrl}`);
      }
    } catch (error) {
      console.error("Test failed with error:", error);
      throw error;
    }
  });
});
