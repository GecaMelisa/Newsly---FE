import { createDriver } from "../system/setup";
import { Builder, By, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

jest.setTimeout(90000); // Extend timeout for UI tests

describe("Regression Test: Login flow still works", () => {
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

  test("User can still log in after changes to layout/backend", async () => {
    await driver.get(BASE_URL);
    await driver.sleep(5000);

    const loginButton = await driver.findElement(By.css("a[href='/login']"));
    await loginButton.click();
    await driver.sleep(4000);

    const emailField = await driver.findElement(By.css("input[type='email']"));
    const passwordField = await driver.findElement(
      By.css("input[type='password']")
    );
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    await emailField.sendKeys(TEST_EMAIL);
    await passwordField.sendKeys(TEST_PASSWORD);
    await submitButton.click();

    await driver.sleep(5000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe(`${BASE_URL}/`);

    const profileIcon = await driver.findElement(
      By.css("button, .user-menu, .profile-icon")
    );
    expect(await profileIcon.isDisplayed()).toBe(true);
  });
});
