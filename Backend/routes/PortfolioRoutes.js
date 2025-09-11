import express from "express";
import multer from "multer";
import Portfolio from "../models/portfolio.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper function to generate HTML from portfolio data
function generatePortfolioHTML(portfolio) {
  const sections = portfolio.sections;
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <base target="_blank">
        <style>
          a {
            color: #1a0dab;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; font-family: Arial, sans-serif;">
  `;

  // Hero Section
  if (sections.hero) {
    html += `
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #4f46e5; padding-bottom: 30px;">
        ${sections.hero.imageUrl ? `<img src="${sections.hero.imageUrl}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 3px solid #4f46e5;">` : ''}
        <h1 style="margin: 10px 0; color: #4f46e5; font-size: 2.5em;">${sections.hero.title || ''}</h1>
        <h2 style="margin: 10px 0; font-weight: normal; color: #666; font-size: 1.5em;">${sections.hero.subtitle || ''}</h2>
      </div>
    `;
  }

  // About Me
  if (sections.about?.content?.trim()) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">About Me</h2>
        <div style="font-size: 1.1em;">${formatText(sections.about.content)}</div>
      </div>
    `;
  }

  // Skills
  if (sections.skills?.length > 0) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">Skills</h2>
    `;
    sections.skills.forEach(skill => {
      if (!skill.name) return;
      html += `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;">
            <span>${skill.name}</span>
            <span>${skill.level || 80}%</span>
          </div>
          <div style="height: 10px; background: #eee; border-radius: 5px;">
            <div style="width: ${skill.level || 80}%; height: 100%; background: #4f46e5; border-radius: 5px;"></div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  // Experience
  if (sections.experience?.content?.trim()) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">Experience</h2>
        <div style="font-size: 1.1em;">${formatText(sections.experience.content)}</div>
      </div>
    `;
  }

  // Projects
  if (sections.projects?.length > 0) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">Projects</h2>
    `;
    sections.projects.forEach(project => {
      if (!project.title) return;
      html += `
        <div style="margin-bottom: 30px;">
          <h3 style="margin-bottom: 10px; color: #4f46e5;">${project.title}</h3>
          ${project.thumbnail && !project.thumbnail.includes('placeholder') ? `<img src="${project.thumbnail}" style="max-width: 100%; height: auto; margin-bottom: 10px;">` : ''}
          <p>${formatText(project.description)}</p>
          <div style="margin-top: 10px;">
            ${project.demoUrl ? `<a href="${formatUrl(project.demoUrl)}" target="_blank" rel="noopener noreferrer" style="margin-right: 20px;">🔗 Live Demo</a>` : ''}
            ${project.githubUrl ? `<a href="${formatUrl(project.githubUrl)}" target="_blank" rel="noopener noreferrer">📁 GitHub</a>` : ''}
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  // Education
  if (sections.education?.content?.trim()) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">Education</h2>
        <div style="font-size: 1.1em;">${formatText(sections.education.content)}</div>
      </div>
    `;
  }

  // Contact
  const { email, phone, linkedin, github } = sections.contact || {};
  if (email || phone || linkedin || github) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">Contact</h2>
        <div style="font-size: 1.1em; display: flex; flex-direction: column; gap: 10px;">
          ${email ? `<div><strong>Email:</strong> <a href="mailto:${email}">${email}</a></div>` : ''}
          ${phone ? `<div><strong>Phone:</strong> ${phone}</div>` : ''}
          ${linkedin ? `<div><strong>LinkedIn:</strong> <a href="${formatUrl(linkedin)}" target="_blank">${formatUrl(linkedin)}</a></div>` : ''}
          ${github ? `<div><strong>GitHub:</strong> <a href="${formatUrl(github)}" target="_blank">${formatUrl(github)}</a></div>` : ''}
        </div>
      </div>
    `;
  }

  html += `
        </div>
      </body>
    </html>
  `;
  return html;
}



// Helper function to format text
function formatText(text) {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const formattedText = text.replace(urlRegex, url => {
    return `<a href="${formatUrl(url)}" target="_blank" style="color: #0000EE; text-decoration: underline;">${url}</a>`;
  });
  return formattedText.replace(/\n/g, '<br>');
}
// Save portfolio
router.post("/save", upload.single('image'), async (req, res) => {
  try {
    const { name, email, sections, template, font, background } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const portfolio = await Portfolio.create({
      name,
      email,
      sections: JSON.parse(sections),
      imageUrl,
      template,
      font,
      background,
      createdAt: new Date()
    });

    res.status(201).json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving portfolio" });
  }
});

// Get user's portfolios
router.get("/user/:email", async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: "Error fetching portfolios" });
  }
});

// Get single portfolio
router.get("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: "Not found" });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: "Error fetching portfolio" });
  }
});

// Update portfolio
router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    const { name, email, sections, template, font, background } = req.body;
    const updateData = {
      name,
      email,
      sections: JSON.parse(sections),
      template,
      font,
      background,
      updatedAt: new Date()
    };

    if (req.file) {
      // Delete old image if exists
      const oldPortfolio = await Portfolio.findById(req.params.id);
      if (oldPortfolio.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', oldPortfolio.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!portfolio) return res.status(404).json({ error: "Not found" });
    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating portfolio" });
  }
});
// Get portfolio data for PDF generation
router.get("/pdf-data/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: "Not found" });
    res.json(portfolio);
  } catch (err) {
    console.error('Error fetching portfolio data:', err);
    res.status(500).json({ error: "Error fetching portfolio data" });
  }
});

// Generate PDF for saved portfolio
router.get("/generate-pdf/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: "Portfolio not found" });

    const html = generatePortfolioHTML(portfolio);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-background-graphics',
        '--print-background'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Read CSS file and inject it
    const cssPath = path.join(__dirname, '../public/style.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Update the HTML generation to handle gradient backgrounds
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&family=Roboto:wght@400;500&family=Montserrat:wght@400;500&family=Open+Sans:wght@400;500&family=Lato:wght@400;500&family=Raleway:wght@400;500&family=Nunito:wght@400;500&family=Merriweather:wght@400;500&family=Playfair+Display:wght@400;500&family=Georgia&family=Courier+New&display=swap' rel='stylesheet'>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    ${cssContent}
    
    /* Additional PDF-specific styles */
    body {
      margin: 0;
      padding: 40px;
      font-family: ${portfolio.font || "'Inter', sans-serif"};
      line-height: 1.6;
      color: var(--text);
      background: ${portfolio.template === 'creative-gradient' ?
        'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' :
        'white'};
    }
    
    a {
      color: var(--primary);
      text-decoration: underline;
    }
    
    .pdf-background {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('${portfolio.background ? `file://${path.resolve('Backend/public/' + portfolio.background)}` : ''}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.1;
      z-index: -1;
    }
  </style>
</head>
<body class="template-${portfolio.template || 'black-white'}">
  ${portfolio.background ? '<div class="pdf-background"></div>' : ''}
  ${html}
</body>
</html>`;

    await page.setContent(fullHTML, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });

    // Wait a bit more for fonts and images to load
    await page.waitForTimeout(2000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '30px', bottom: '30px', left: '20px', right: '20px' },
      displayHeaderFooter: false,
      preferCSSPageSize: false
    });

    await browser.close();

    const fileName = `${portfolio.name.replace(/[^a-zA-Z0-9]/g, '_')}_portfolio.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: "Error generating PDF" });
  }
});


// Add this route to PortfolioRoutes.js
router.delete("/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ error: "Not found" });

    // Delete the associated image file if it exists
    if (portfolio.imageUrl) {
      const imagePath = path.join(__dirname, '..', portfolio.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    res.json({ message: "Portfolio deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting portfolio" });
  }
});


function formatUrl(url) {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}




export default router;