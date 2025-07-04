// routes/pdfRoutes.js
import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';

const router = express.Router();

router.post('/download', async (req, res) => {
  const { html, fileName = 'portfolio.pdf' } = req.body;

  if (!html) return res.status(400).json({ error: 'Missing HTML content' });

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--force-color-profile=srgb',
        '--enable-background-graphics',
        '--print-background'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.setContent(`<!DOCTYPE html>
<html>
<head>
  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&family=Roboto:wght@400;500&family=Montserrat:wght@400;500&display=swap' rel='stylesheet'>
  <style>
    ${fs.readFileSync('Backend/public/style.css', 'utf8')}
  </style>
</head>
<body>
  ${html}
</body>
</html>`, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '30px', bottom: '30px', left: '20px', right: '20px' },
      displayHeaderFooter: false
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${fileName}`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
