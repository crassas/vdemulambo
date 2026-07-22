import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    localStorage.setItem('dummyUser', JSON.stringify({ uid: 'dummy-admin', nome: 'Mentora O Altar', email: 'mentora@altar.com', role: 'admin' }));
  });
  
  await page.reload({ waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("TEXT ON PAGE:\n", text);
  
  await browser.close();
})();
