import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // click login button using mock accounts
  // ... let's just use the localStorage method, but maybe the crash is on render?
  await page.evaluate(() => {
    localStorage.setItem('dummyUser', JSON.stringify({ uid: 'dummy-admin', nome: 'Mentora O Altar', email: 'mentora@altar.com', role: 'admin' }));
  });
  
  await page.reload({ waitUntil: 'networkidle2' });
  
  // wait 2 seconds
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  console.log("HTML length:", content.length);
  
  await browser.close();
})();
