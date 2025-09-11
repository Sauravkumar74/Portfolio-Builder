// routes/pdfRoutes.js
import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.post('/download', async (req, res) => {
  try {
    const { html, fileName = 'portfolio.pdf' } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'Missing HTML content' });
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Wrapping content inside full HTML and <base target="_blank"> to ensure clickable links
  await page.setContent(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <base target="_blank">
      <style>
        a {
          color: #1a0dab;
          text-decoration: underline;
          pointer-events: auto !important;
        }
        /* Disable any PDF-specific styles that might break links */
        @page {
          size: auto;
          margin: 0mm;
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
  </html>
`, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '30px', bottom: '30px', left: '20px', right: '20px' },
      displayHeaderFooter: false
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
