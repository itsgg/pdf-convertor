"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");

(async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 750,
  });
  await page.emulateMediaType("screen");

  const html = fs.readFileSync(`${__dirname}/test.html`, "utf8");
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.evaluate(async () => {
    for (const iframe of Array.from(document.querySelectorAll("iframe"))) {
      iframe.scrollIntoView();
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
  });

  const pdf = await page.pdf({
    scale: 1,
    printBackground: true,
    margin: { bottom: 0 },
    path: "test.pdf",
  });

  await browser.close();
})();
