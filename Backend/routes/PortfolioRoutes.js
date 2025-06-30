import express from "express";
import multer from "multer";
import Portfolio from "../models/portfolio.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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

// Generate PDF
router.get("/generate-pdf/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ error: "Not found" });

    // Generate complete HTML for the PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @page { margin: 0; }
            body {
              font-family: ${portfolio.font || "'Arial', sans-serif"};
              margin: 0;
              padding: 20px;
              ${portfolio.background ? `background-image: url('${path.join(__dirname, '../public', portfolio.background)}'); background-size: cover;` : ''}
              background-repeat: no-repeat;
              background-position: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              ${portfolio.background ? 'background-color: rgba(255, 255, 255, 0.9);' : ''}
            }
            h1 { color: ${portfolio.template === 'black-white' ? '#000' : '#4f46e5'}; }
            img { max-width: 100%; height: auto; }
            a { color: #4f46e5; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="page">
            ${generatePortfolioHTML(portfolio)}
          </div>
        </body>
      </html>
    `;

    // Options for html2canvas
    const options = {
      scale: 2,
      logging: true,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794, // A4 width in pixels at 96dpi
      windowHeight: 1123 // A4 height in pixels at 96dpi
    };

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Convert HTML to canvas
    const canvas = await html2canvas(document.createElement('div'), {
      ...options,
      html: html
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Send the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${portfolio.name.replace(/ /g, '_')}_portfolio.pdf`);
    res.send(Buffer.from(pdf.output('arraybuffer')));
    
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: "Error generating PDF" });
  }
});

function generatePortfolioHTML(portfolio) {
  const { sections } = portfolio;
  
  return `
    <div class="portfolio-content">
      ${generateHeroSection(sections.hero)}
      ${sections.about ? generateAboutSection(sections.about) : ''}
      ${sections.skills ? generateSkillsSection(sections.skills) : ''}
      ${sections.experience ? generateExperienceSection(sections.experience) : ''}
      ${sections.projects ? generateProjectsSection(sections.projects) : ''}
      ${sections.education ? generateEducationSection(sections.education) : ''}
      ${sections.contact ? generateContactSection(sections.contact) : ''}
    </div>
  `;
}

function generateHeroSection(hero) {
  if (!hero) return '';
  return `
    <div class="section hero-section" style="text-align: center; margin-bottom: 30px;">
      ${hero.imageUrl ? `<img src="${path.join(__dirname, '../public', hero.imageUrl)}" alt="Profile" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px;">` : ''}
      <h1 style="margin: 10px 0; font-size: 2.5em;">${hero.title || 'Your Name'}</h1>
      <h2 style="margin: 10px 0; font-size: 1.5em; color: #666;">${hero.subtitle || 'Your Profession'}</h2>
      <p style="max-width: 600px; margin: 20px auto; font-size: 1.1em; line-height: 1.6;">${hero.bio || 'A brief introduction about yourself'}</p>
    </div>
  `;
}

function generateAboutSection(about) {
  if (!about || !about.content) return '';
  return `
    <div class="section about-section" style="margin-bottom: 30px;">
      <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin-bottom: 15px;">About Me</h2>
      <div style="line-height: 1.6; font-size: 1.1em;">${formatText(about.content)}</div>
    </div>
  `;
}

function generateSkillsSection(skills) {
  if (!skills || skills.length === 0) return '';
  let skillsHTML = `
    <div class="section skills-section" style="margin-bottom: 30px;">
      <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin-bottom: 15px;">Skills</h2>
  `;
  
  skills.forEach(skill => {
    skillsHTML += `
      <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span style="font-weight: 500;">${skill.name}</span>
          <span>${skill.level}%</span>
        </div>
        <div style="height: 10px; background: #f0f0f0; border-radius: 5px;">
          <div style="width: ${skill.level}%; height: 100%; background: #4f46e5; border-radius: 5px;"></div>
        </div>
      </div>
    `;
  });
  
  skillsHTML += '</div>';
  return skillsHTML;
}

function generateExperienceSection(experience) {
  if (!experience || !experience.content) return '';
  return `
    <div class="section experience-section" style="margin-bottom: 30px;">
      <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin-bottom: 15px;">Experience</h2>
      <div style="line-height: 1.6; font-size: 1.1em;">${formatText(experience.content)}</div>
    </div>
  `;
}

function generateProjectsSection(projects) {
  if (!projects || projects.length === 0) return '';
  let projectsHTML = `
    <div class="section projects-section" style="margin-bottom: 30px;">
      <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin-bottom: 15px;">Projects</h2>
  `;
  
  projects.forEach(project => {
    projectsHTML += `
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 15px 0 10px 0; font-size: 1.3em;">${project.title || 'Project Title'}</h3>
        ${project.thumbnail ? `<img src="${path.join(__dirname, '../public', project.thumbnail)}" alt="${project.title || 'Project'}" style="max-width: 100%; margin: 10px 0; border-radius: 5px; border: 1px solid #ddd;">` : ''}
        <p style="margin: 10px 0; line-height: 1.6;">${formatText(project.description || '')}</p>
        <div style="margin-top: 10px;">
          ${project.demoUrl ? `<a href="${project.demoUrl}" style="margin-right: 15px; color: #4f46e5;">Live Demo</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" style="color: #4f46e5;">GitHub</a>` : ''}
        </div>
      </div>
    `;
  });
  
  projectsHTML += '</div>';
  return projectsHTML;
}

function generateEducationSection(education) {
  if (!education || !education.content) return '';
  return `
    <div class="section education-section" style="margin-bottom: 30px;">
      <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin-bottom: 15px;">Education</h2>
      <div style="line-height: 1.6; font-size: 1.1em;">${formatText(education.content)}</div>
    </div>
  `;
}

function generateContactSection(contact) {
  if (!contact) return '';
  let contactHTML = `
    <div class="section contact-section" style="margin-bottom: 30px;">
      <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 5px; margin-bottom: 15px;">Contact</h2>
      <ul style="list-style: none; padding: 0;">
  `;
  
  if (contact.email) contactHTML += `<li style="margin-bottom: 10px;">Email: ${contact.email}</li>`;
  if (contact.phone) contactHTML += `<li style="margin-bottom: 10px;">Phone: ${contact.phone}</li>`;
  if (contact.linkedin) contactHTML += `<li style="margin-bottom: 10px;">LinkedIn: <a href="${contact.linkedin}" style="color: #4f46e5;">${contact.linkedin}</a></li>`;
  if (contact.github) contactHTML += `<li style="margin-bottom: 10px;">GitHub: <a href="${contact.github}" style="color: #4f46e5;">${contact.github}</a></li>`;
  
  contactHTML += '</ul></div>';
  return contactHTML;
}

function formatText(text) {
  if (!text) return '';
  return text.split('\n\n').map(paragraph => 
    `<p style="margin-bottom: 15px;">${paragraph.replace(/\n/g, '<br>')}</p>`
  ).join('');
}

export default router;