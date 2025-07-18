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
let html = `<div style="width: 100%; height: 100%;">`;



  // Hero Section
  if (sections.hero) {
html += `
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid var(--primary); padding-bottom: 30px;">
    ${sections.hero.imageUrl ? `<img src="${sections.hero.imageUrl}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 3px solid var(--primary);">` : ''}
    <h1 style="margin: 10px 0; color: var(--primary); font-size: 2.5em;">${sections.hero.title || ''}</h1>
    <h2 style="margin: 10px 0; font-weight: normal; color: var(--text-light); font-size: 1.5em;">${sections.hero.subtitle || ''}</h2>
  </div>
`;
  }
  
  // About Section
  if (sections.about && sections.about.content && sections.about.content.trim()) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-bottom: 20px;">About Me</h2>
        <div style="font-size: 1.1em;">${formatText(sections.about.content)}</div>
      </div>
    `;
  }
  
  // Skills Section
  if (sections.skills && sections.skills.length > 0) {
    const validSkills = sections.skills.filter(skill => skill.name && skill.name.trim());
    if (validSkills.length > 0) {
      html += `
        <div style="margin-bottom: 40px;">
          <h2 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-bottom: 20px;">Skills</h2>
      `;
      
      validSkills.forEach(skill => {
        html += `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: 500;">${skill.name}</span>
              <span>${skill.level || 80}%</span>
            </div>
            <div style="height: 10px; background: #f0f0f0; border-radius: 5px;">
              <div style="width: ${skill.level || 80}%; height: 100%; background: var(--primary); border-radius: 5px;"></div>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    }
  }
  
  // Experience Section
  if (sections.experience && sections.experience.content && sections.experience.content.trim()) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-bottom: 20px;">Experience</h2>
        <div style="font-size: 1.1em;">${formatText(sections.experience.content)}</div>
      </div>
    `;
  }
  
  // Projects Section
  if (sections.projects && sections.projects.length > 0) {
    const validProjects = sections.projects.filter(project => project.title && project.title.trim());
    if (validProjects.length > 0) {
      html += `
        <div style="margin-bottom: 40px;">
          <h2 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-bottom: 20px;">Projects</h2>
      `;
      
      validProjects.forEach(project => {
        html += `
          <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: var(--primary);">${project.title}</h3>
            ${project.thumbnail && !project.thumbnail.includes('placeholder') ? `<img src="${project.thumbnail}" alt="${project.title}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px;">` : ''}
            <p style="margin: 10px 0;">${formatText(project.description || '')}</p>
            <div style="margin-top: 10px;">
              ${project.demoUrl ? `<a href="${project.demoUrl}" style="margin-right: 15px; color: var(--primary); text-decoration: none;">🔗 Live Demo</a>` : ''}
              ${project.githubUrl ? `<a href="${project.githubUrl}" style="color: var(--primary); text-decoration: none;">📁 GitHub</a>` : ''}
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    }
  }
  
  // Education Section
  if (sections.education && sections.education.content && sections.education.content.trim()) {
    html += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-bottom: 20px;">Education</h2>
        <div style="font-size: 1.1em;">${formatText(sections.education.content)}</div>
      </div>
    `;
  }
  
  // Contact Section
  if (sections.contact) {
    const { email, phone, linkedin, github } = sections.contact;
    if (email || phone || linkedin || github) {
      html += `
        <div style="margin-bottom: 40px;">
          <h2 style="color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 5px; margin-bottom: 20px;">Contact</h2>
          <div style="display: flex; flex-direction: column; gap: 10px;">
      `;
      
      if (email) {
        html += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">📧</span><span>${email}</span></div>`;
      }
      if (phone) {
        html += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">📞</span><span>${phone}</span></div>`;
      }
      if (linkedin) {
        html += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">💼</span><a href="${linkedin}" style="color: var(--primary);">LinkedIn Profile</a></div>`;
      }
      if (github) {
        html += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">🔗</span><a href="${github}" style="color: var(--primary);">GitHub Profile</a></div>`;
      }
      
      html += '</div></div>';
    }
  }
  
  html += '</div>';
  return html;
}

// Helper function to format text
function formatText(text) {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
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
    
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&family=Roboto:wght@400;500&family=Montserrat:wght@400;500&display=swap' rel='stylesheet'>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    ${cssContent}
    
    /* Additional PDF-specific styles */
    body {
      margin: 0;
      padding: 40px;
      font-family: ${portfolio.font || "'Inter', sans-serif"};
      line-height: 1.6;
      color: #333;
      background: white;
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





export default router;