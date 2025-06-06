const puppeteer = require('puppeteer');
const path = require('path');

describe('Ruby Compiler page', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({args:['--no-sandbox']});
    page = await browser.newPage();
    const filePath = 'file://' + path.resolve(__dirname, '../index.html');
    await page.goto(filePath);
  });

  afterAll(async () => {
    if (browser) await browser.close();
  });

  test('executes simple ruby snippet', async () => {
    await page.waitForSelector('#editor');
    await page.evaluate(() => {
      ace.edit('editor').setValue('puts 1+1');
    });
    await page.click('#run-code');
    await page.waitForFunction(() => document.querySelector('#output').textContent.trim() !== '');
    const output = await page.$eval('#output', el => el.textContent.trim());
    expect(output).toBe('2');
  }, 30000);
});
