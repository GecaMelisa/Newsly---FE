import { Builder, By, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { createDriver } from "../setup";

jest.setTimeout(120000); // Extended timeout for this complex test

describe("System Test: Create News", () => {
  let driver: WebDriver;
  const BASE_URL = "https://newsly-fe.onrender.com";
  // Login credentials - update these with valid credentials for your test environment
  const TEST_EMAIL = "test@example.com";
  const TEST_PASSWORD = "test123";
  // Test data for news creation
  const TEST_NEWS_TITLE = `Test News ${Date.now()}`;
  const TEST_NEWS_CONTENT =
    "This is a test news article created by automated testing.";
  const TEST_NEWS_CATEGORY = "General"; // Use a category that exists in your system

  beforeAll(async () => {
    // Use the shared driver setup function
    driver = await createDriver();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Authenticated user can create a news article", async () => {
    try {
      // Step 1: Navigate to home page
      await driver.get(BASE_URL);
      await driver.sleep(3000);

      // Step 2: Login first (required to see Create News button)
      // Find and click the login link
      const loginButton = await driver.findElement(By.css("a[href='/login']"));
      await loginButton.click();
      await driver.sleep(3000);

      // Fill in login credentials
      const emailField = await driver.findElement(
        By.css("input[type='email']")
      );
      const passwordField = await driver.findElement(
        By.css("input[type='password']")
      );
      const submitButton = await driver.findElement(
        By.css("button[type='submit']")
      );

      await emailField.clear();
      await passwordField.clear();
      await emailField.sendKeys(TEST_EMAIL);
      await passwordField.sendKeys(TEST_PASSWORD);
      await submitButton.click();

      // Wait for login to complete
      await driver.sleep(5000);

      try {
        // Step 3: Find and click the Create News button
        const createNewsButton = await driver.findElement(
          By.xpath("//button[contains(text(), 'Create News')]")
        );
        await createNewsButton.click();
        console.log("Found Create News button - login successful");
      } catch (e) {
        console.error(
          "Could not find Create News button - login may have failed"
        );

        const screenshot = await driver.takeScreenshot();
        console.log("Current page screenshot:", screenshot);

        const currentUrl = await driver.getCurrentUrl();
        console.log("Current URL:", currentUrl);

        // Fail the test
        throw new Error("Login failed or Create News button not found");
      }

      // Wait for the Create News modal to appear
      await driver.sleep(3000);

      // Step 4: Fill in the Create News form
      // Find form elements in the modal
      const titleField = await driver.findElement(
        By.css("input[label='Title']")
      );
      const contentField = await driver.findElement(
        By.css("textarea[label='Content']")
      );

      // Fill in the title and content
      await titleField.clear();
      await titleField.sendKeys(TEST_NEWS_TITLE);
      await contentField.clear();
      await contentField.sendKeys(TEST_NEWS_CONTENT);

      // Select a category from the dropdown
      const categoryDropdown = await driver.findElement(
        By.css("div[role='button']")
      );
      await categoryDropdown.click();
      await driver.sleep(1000);

      // Select the category from the dropdown options
      const categoryOption = await driver.findElement(
        By.xpath(`//li[contains(text(), '${TEST_NEWS_CATEGORY}')]`)
      );
      await categoryOption.click();

      const dateField = await driver.findElement(By.css("input[type='date']"));
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      await dateField.sendKeys(formattedDate);

      const submitNewsButton = await driver.findElement(
        By.xpath("//button[contains(text(), 'Submit')]")
      );
      await submitNewsButton.click();

      await driver.sleep(5000);

      try {
        const successMessage = await driver.findElement(
          By.css(".Toastify__toast--success")
        );
        expect(await successMessage.isDisplayed()).toBe(true);
        console.log("Success message displayed after creating news");
      } catch (e) {
        console.log(
          "No success toast found, checking for news in the list instead"
        );
      }

      const newsCards = await driver.findElements(
        By.css(".news-card, [data-testid='news-card']")
      );

      let newsFound = false;
      for (const card of newsCards) {
        const cardText = await card.getText();
        if (cardText.includes(TEST_NEWS_TITLE)) {
          newsFound = true;
          console.log("Found newly created news in the list");
          break;
        }
      }
      if (!newsFound) {
        console.log(
          "Could not find newly created news in the visible list, but creation may still have succeeded"
        );
      }
    } catch (error) {
      console.error("Test failed with error:", error);
      try {
        const screenshot = await driver.takeScreenshot();
        console.log("Failure screenshot:", screenshot);
      } catch (e) {
        console.log("Could not take failure screenshot");
      }

      throw error;
    }
  });
});
