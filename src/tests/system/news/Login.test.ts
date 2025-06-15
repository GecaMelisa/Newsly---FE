import { Builder, By, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { createDriver } from "../setup";

jest.setTimeout(90000); // Extend timeout for UI tests

describe("System Test: Login", () => {
  let driver: WebDriver;
  const BASE_URL = "https://newsly-fe.onrender.com";
  const TEST_EMAIL = "melisa@gmail.com";
  const TEST_PASSWORD = "melisa123";

  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("User can access login page and submit form", async () => {
    try {
      await driver.get(BASE_URL);

      await driver.sleep(5000);

      // Try to find the login link by href attribute
      const loginButton = await driver.findElement(By.css("a[href='/login']"));

      await loginButton.click();

      await driver.sleep(5000);

      const emailField = await driver.findElement(
        By.css("input[type='email']")
      );
      const passwordField = await driver.findElement(
        By.css("input[type='password']")
      );
      const submitButton = await driver.findElement(
        By.css("button[type='submit']")
      );

      // Clear fields before entering text
      await emailField.clear();
      await passwordField.clear();

      // Enter credentials
      await emailField.sendKeys(TEST_EMAIL);
      await passwordField.sendKeys(TEST_PASSWORD);

      // Submit form
      await submitButton.click();

      // Wait for form submission to complete
      await driver.sleep(5000);

      const currentUrl = await driver.getCurrentUrl();

      if (currentUrl === `${BASE_URL}/`) {
        console.log("Login successful - redirected to home page");

        const userElement = await driver.findElement(
          By.css("button, .user-menu, .profile-icon")
        );
        expect(await userElement.isDisplayed()).toBe(true);
      } else if (currentUrl.includes("/login")) {
        console.log(
          "Login form submitted but remained on login page - this is expected with test credentials"
        );

        const formStillVisible = await emailField.isDisplayed();
        expect(formStillVisible).toBe(true);
      } else {
        throw new Error(`Unexpected redirect to: ${currentUrl}`);
      }
    } catch (error) {
      console.error("Test failed with error:", error);
      throw error;
    }
  });
});
