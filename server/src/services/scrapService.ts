import { Browser, BrowserContext, BrowserContextOptions, chromium, Page } from 'playwright';

export class ScrapService {
  private _page: Page | null = null;
  private _browser: Browser | null = null;
  private _browserContext: BrowserContext | null = null;
  private readonly browserContextOptions: BrowserContextOptions = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' + ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
  };

  constructor() {
    this.initBrowser();
  }

  async initBrowser(): Promise<void> {
    this._browser = await chromium.launch();
    this._browserContext = await this.browser.newContext(this.browserContextOptions);
  }

  async closeBrowser(): Promise<void> {
    await this.browser.close();
    this._browser = null;
    this._browserContext = null;
    this._page = null;
  }

  async goToPage(url: string): Promise<Page> {
    this._page = await this.browserContext.newPage();
    await this.page.goto(url);

    return this.page;
  }

  get page(): Page {
    if (!this._page) {
      throw new Error('Page not initialized');
    }

    return this._page;
  }

  get browser(): Browser {
    if (!this._browser) {
      throw new Error('Browser not initialized');
    }

    return this._browser;
  }

  get browserContext(): BrowserContext {
    if (!this._browserContext) {
      throw new Error('Browser context not initialized');
    }

    return this._browserContext;
  }

  async scrap(url: string, selector: string): Promise<string> {
    await this.initBrowser();
    await this.goToPage(url);
    const text = (await this.page.$eval(selector, (el: any) => el.textContent)) as string;
    await this.closeBrowser();

    return text;
  }
}
