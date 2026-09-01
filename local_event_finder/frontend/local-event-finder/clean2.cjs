const puppeteer = require("puppeteer-core");
(async () => {
  const browser = await puppeteer.launch({ executablePath: "/usr/bin/chromium", headless: "new", args: ["--no-sandbox","--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e)=>errors.push("PAGEERROR: "+e.message));
  await page.goto("http://localhost:5173/event", { waitUntil: "networkidle2" });
  await new Promise(r=>setTimeout(r,1800));
  const count = async () => page.$$eval(".event-card", e=>e.length).catch(()=>-1);
  const topBox = ".explore-search .search-input input";
  const botBox = ".events-search-bar input";

  // Clean isolation: reload between checks
  async function reload(){ await page.goto("http://localhost:5173/event", {waitUntil:"networkidle2"}); await new Promise(r=>setTimeout(r,1500)); }

  // BOTTOM only
  await reload();
  await page.focus(botBox);
  await page.type(botBox, "music", {delay:30});
  await new Promise(r=>setTimeout(r,1300));
  console.log("BOTTOM 'music' -> cards:", await count(), "topBox:", JSON.stringify(await page.$eval(topBox,i=>i.value)), "url:", await page.url());

  // TOP only
  await reload();
  await page.focus(topBox);
  await page.type(topBox, "music", {delay:30});
  await page.keyboard.press("Enter");
  await new Promise(r=>setTimeout(r,1300));
  console.log("TOP 'music'+Enter -> cards:", await count(), "botBox:", JSON.stringify(await page.$eval(botBox,i=>i.value)), "url:", await page.url());

  console.log("ERRORS:", errors);
  await browser.close();
})();
