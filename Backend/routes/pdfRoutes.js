// routes/pdfRoutes.js
import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

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
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
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
