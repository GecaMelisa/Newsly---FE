import { Builder, By, until, WebDriver } from "selenium-webdriver";

export async function createDriver(): Promise<WebDriver> {
  const driver = await new Builder().forBrowser("chrome").build();
  await driver.manage().setTimeouts({ implicit: 5000 });
  return driver;
}
