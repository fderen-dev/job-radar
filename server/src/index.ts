import { chromium } from "playwright";
import express from 'express';
import bodyParser from 'body-parser';

async function getPage(url: string): Promise<{ page: any, browser: any, context: any }> {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' + ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto(url);

  return { page, browser, context };
}


async function scrap(url: string, selector: string): Promise<string> {
  const { page, browser } = await getPage(url);
  const text = await page.$eval(selector, (el: any) => el.textContent) as string;
  await browser.close();

  return text;
}

// async function scrapUrls(pageUrl: string, listSelector: string): Promise<string[]> {
//   const { page, browser } = await getPage(pageUrl);
//   const urls = await page.$$eval(listSelector, (elements: any) => elements.map((el: any) => el.href));
//   await browser.close();

//   return urls;
// }

// (async () => {
//   try {
//     const urls = await scrapUrls('https://www.masterborn.com/career', 'main #positions a');
//     urls.forEach(async (url: string) => {
//       const position = await scrap(url, 'main h1');
//       const salary = await scrap(url, 'main #offer p:first-of-type + div h3');
//       console.log(position, salary); 
//     });
//   } catch (error) {
//     console.error(error);
//   }
// })(); 

// curl -X POST http://localhost:3000/api/scrap \
// -H "Content-Type: application/json" \
// -d '{"url": "https://www.masterborn.com/career", "selector": "main #positions a"}'

(async () => {
  const app = express();
  const port = 3000;

  app.use(bodyParser.json());
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  app.post('/api/scrap', async (req, res) => {
    const { url, selector } = req.body;

    if (!url || !selector) {
      res.status(400).send('Missing url or selector in request body');
      return;
    }

    try {
      const text = await scrap(url, selector);

      res.status(200).send(text);
    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  });
})(); 