const puppeteer = require('puppeteer-core');
const dotenv = require('dotenv');

async function run() {
   let browser;
   try {
    browser = await puppeteer.connect({
        browserWSEndpoint: `wss://brd-customer-hl\_9abdd8da-zone-scrap:kjnov0ffu7ox@brd.superproxy.io:9222`
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 68 * 1000);

     // Navigate to the website
     await page.goto('https://www.stjude.org/treatment/patient-resources/caregiver-resources/medicines/a-z-list-of-medicines/abacavir.html');

     // Extract information about the medicine
     const medicineInfo = await page.evaluate(() => {
        const info = {};
        
        // Extract medicine name
        info['Medicine Name'] = document.querySelector('h1').innerText.trim();

        // Extract description
        const description = Array.from(document.querySelectorAll('section.entry-content div.mobile-scale > p'));
        info['Description'] = description.map(p => p.textContent.trim()).join('\n');

        // Extract possible side effects
        const sideEffectsList = Array.from(document.querySelectorAll('section.entry-content div.mobile-scale > ul li'));
        info['Possible Side Effects'] = sideEffectsList.map(li => li.textContent.trim());

        return info;
    });

    console.log(medicineInfo);
    
   } catch (e) {
    console.error('scrape failed',e);
   } 
   finally {
    await browser?.close();
   }
}

dotenv.config();

run();
