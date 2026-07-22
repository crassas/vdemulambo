import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    localStorage.setItem('dummyUser', JSON.stringify({ uid: 'dummy-admin', nome: 'Mentora O Altar', email: 'mentora@altar.com', role: 'admin' }));
  });
  
  await page.reload({ waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 4000));
  
  // Click COMPREENDI
  try {
     await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const compreendiBtn = btns.find(b => b.innerText.includes('COMPREENDI'));
        if (compreendiBtn) compreendiBtn.click();
     });
     console.log("Clicked Compreendi");
  } catch (e) {
     console.log("Could not click compreendi");
  }
  
  await new Promise(r => setTimeout(r, 2000));
  console.log("Done");
  
  await browser.close();
})();
