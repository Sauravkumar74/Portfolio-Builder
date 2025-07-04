// Global variables
let currentTemplate = 'black-white';
let currentFont = "'Inter', sans-serif";
let currentBackground = '';
let currentPortfolioId = null;
let currentPage = 0;
let pages = [];

// Page navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Auth functionality
document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userEmail', result.user.email);
      localStorage.setItem('userName', result.user.name);
      showPage('landing-page');
    } else {
      const error = await response.json();
      alert(error.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Network error. Please try again.');
  }
});

document.getElementById('register-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  if (!name || !email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    if (response.ok) {
      alert('Registration successful! Please login.');
      showPage('login-page');
    } else {
      const error = await response.json();
      alert(error.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Network error. Please try again.');
  }
});

// Navigation between auth pages
document.getElementById('show-register').addEventListener('click', function(e) {
  e.preventDefault();
  showPage('register-page');
});

document.getElementById('show-login').addEventListener('click', function(e) {
  e.preventDefault();
  showPage('login-page');
});

// Landing page functionality
document.getElementById('start-building').addEventListener('click', function() {
  showPage('builder-page');
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  showPage('login-page');
});

// Builder page functionality
function setupSectionNavigation() {
  const sectionItems = document.querySelectorAll('.section-item');
  
  sectionItems.forEach(item => {
    item.addEventListener('click', function() {
      sectionItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      document.querySelectorAll('.section-editor').forEach(editor => {
        editor.classList.add('hidden');
      });
      
      const sectionId = this.getAttribute('data-section') + '-section';
      document.getElementById(sectionId).classList.remove('hidden');
    });
  });
}

// Profile image upload
document.getElementById('upload-btn').addEventListener('click', function() {
  document.getElementById('profile-upload').click();
});

document.getElementById('profile-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('profile-preview').src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Project thumbnail upload
function setupProjectThumbnailUpload() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('project-upload-btn')) {
      const uploadInput = e.target.previousElementSibling;
      uploadInput.click();
    }
  });

  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('project-thumbnail-upload')) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const thumbnail = e.target.previousElementSibling;
          thumbnail.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  });
}

// Add new skill with percentage display
document.getElementById('add-skill-btn').addEventListener('click', function() {
  const skillsContainer = document.getElementById('skills-container');
  const newSkill = document.createElement('div');
  newSkill.className = 'skill-item';
  newSkill.innerHTML = `
    <div class="skill-input-group">
      <input type="text" class="skill-name" placeholder="Skill name (e.g. JavaScript)">
      <div class="skill-percentage-display">
        <span class="percentage-value">80%</span>
        <input type="range" min="1" max="100" value="80" class="skill-range">
      </div>
    </div>
    <button class="btn-remove-skill">×</button>
  `;
  skillsContainer.appendChild(newSkill);
  
  const rangeInput = newSkill.querySelector('.skill-range');
  const percentageValue = newSkill.querySelector('.percentage-value');
  
  rangeInput.addEventListener('input', function() {
    percentageValue.textContent = `${this.value}%`;
  });
});

// Remove skill
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-remove-skill')) {
    e.target.parentElement.remove();
  }
});

// Add new project
document.getElementById('add-project-btn').addEventListener('click', function() {
  const projectsContainer = document.getElementById('projects-container');
  const newProject = document.createElement('div');
  newProject.className = 'project-item';
  newProject.innerHTML = `
    <div class="form-group">
      <label>Project Title</label>
      <input type="text" class="project-title" placeholder="Project name">
    </div>
    <div class="form-group">
      <label>Project Description</label>
      <textarea class="project-description" rows="3" placeholder="Project description"></textarea>
    </div>
    <div class="form-group">
      <label>Project Thumbnail</label>
      <div class="project-thumbnail-container">
        <img src="https://via.placeholder.com/600x400?text=Project+Thumbnail" class="project-thumbnail" alt="Project thumbnail">
        <input type="file" class="project-thumbnail-upload hidden" accept="image/*">
        <button class="project-upload-btn">Upload Thumbnail</button>
      </div>
    </div>
    <div class="form-group">
      <label>Project Links</label>
      <div class="project-links">
        <input type="text" class="project-link-input" placeholder="Live Demo URL">
        <input type="text" class="project-link-input" placeholder="GitHub URL">
      </div>
    </div>
    <button class="btn-remove-project">Remove Project</button>
  `;
  projectsContainer.appendChild(newProject);
});

// Remove project
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-remove-project')) {
    e.target.parentElement.remove();
  }
});

// Template selection
function setupTemplateSelection() {
  const templateOptions = document.querySelectorAll('.template-option');
  
  templateOptions.forEach(option => {
    option.addEventListener('click', function() {
      templateOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      currentTemplate = this.getAttribute('data-template');
      document.body.className = `template-${currentTemplate}`;
    });
  });
}

// Font selection
document.getElementById('font-select').addEventListener('change', function() {
  currentFont = this.value;
  document.body.style.fontFamily = currentFont;
});

// Background selection
document.querySelectorAll('.background-option').forEach(option => {
  option.addEventListener('click', function() {
    currentBackground = this.getAttribute('data-bg');
    document.getElementById('portfolio-preview-pages').style.backgroundImage = `url('backgrounds/${currentBackground}')`;
  });
});

// Section icons mapping
const sectionIcons = {
  'hero': 'fa-user',
  'about': 'fa-address-card',
  'skills': 'fa-code',
  'experience': 'fa-briefcase',
  'projects': 'fa-project-diagram',
  'education': 'fa-graduation-cap',
  'contact': 'fa-envelope'
};

// Preview functionality
function generatePreview() {
  const previewPages = document.getElementById('portfolio-preview-pages');
  previewPages.innerHTML = '';
  
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator active';
  loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin fa-3x"></i>';
  previewPages.appendChild(loadingIndicator);
  
  const pageCreators = [
    createHeroPage,
    createAboutPage,
    createSkillsPage,
    createExperiencePage,
    createProjectsPage,
    createEducationPage,
    createContactPage
  ];
  
  pages = [];
  currentPage = 0;
  
  setTimeout(() => {
    pageCreators.forEach((creator, index) => {
      const pageContent = creator();
      if (pageContent) {
        const page = document.createElement('div');
        page.className = 'preview-page';
        page.dataset.page = index;
        page.innerHTML = pageContent;
        previewPages.appendChild(page);
        pages.push(page);
      }
    });
    
    if (loadingIndicator.parentNode) {
      loadingIndicator.remove();
    }
    
    if (pages.length > 0) {
      pages[0].classList.add('active');
      updatePageIndicator(0, pages.length);
      setupPreviewNavigation();
    } else {
      previewPages.innerHTML = '<p>No content available for preview.</p>';
    }
  }, 100);
}

function createHeroPage() {
  const heroTitle = document.getElementById('hero-title').value || 'Your Name';
  const heroSubtitle = document.getElementById('hero-subtitle').value || 'Your Profession';
  const heroBio = document.getElementById('hero-bio').value || 'A brief introduction about yourself';
  const profileImage = document.getElementById('profile-preview').src;
  
  return `
    <div class="preview-section" style="text-align: center; padding: 2rem 0;">
      <div class="section-icon"><i class="fas ${sectionIcons['hero']}"></i></div>
      <img src="${profileImage}" alt="Profile" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
      <h1 style="margin: 0.5rem 0; color: var(--primary);">${heroTitle}</h1>
      <h2 style="margin: 0.5rem 0; font-weight: normal; color: var(--text-light);">${heroSubtitle}</h2>
      <p style="max-width: 600px; margin: 1rem auto;">${heroBio}</p>
    </div>
  `;
}

function createAboutPage() {
  const aboutContent = document.getElementById('about-content').value;
  if (!aboutContent || aboutContent.trim() === '') return null;
  
  return `
    <div class="preview-section">
      <div class="section-icon"><i class="fas ${sectionIcons['about']}"></i></div>
      <h2>About Me</h2>
      <div>${formatPreviewText(aboutContent)}</div>
    </div>
  `;
}

function createSkillsPage() {
  const skills = Array.from(document.querySelectorAll('.skill-item')).map(skill => {
    const name = skill.querySelector('.skill-name').value;
    const level = skill.querySelector('.skill-range').value;
    return name.trim() ? { name, level } : null;
  }).filter(skill => skill !== null);
  
  if (skills.length === 0) return null;
  
  let skillsHTML = `
    <div class="preview-section">
      <div class="section-icon"><i class="fas ${sectionIcons['skills']}"></i></div>
      <h2>Skills</h2>
  `;
  
  skills.forEach(skill => {
    skillsHTML += `
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
          <span>${skill.name}</span>
          <span>${skill.level}%</span>
        </div>
        <div style="height: 8px; background: var(--light-gray); border-radius: 4px;">
          <div style="width: ${skill.level}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
        </div>
      </div>
    `;
  });
  
  skillsHTML += `</div>`;
  return skillsHTML;
}

function createExperiencePage() {
  const experienceContent = document.getElementById('experience-content').value;
  if (!experienceContent || experienceContent.trim() === '') return null;
  
  return `
    <div class="preview-section">
      <div class="section-icon"><i class="fas ${sectionIcons['experience']}"></i></div>
      <h2>Experience</h2>
      <div>${formatPreviewText(experienceContent)}</div>
    </div>
  `;
}

function createProjectsPage() {
  const projects = Array.from(document.querySelectorAll('.project-item')).map(project => {
    const title = project.querySelector('.project-title').value;
    if (!title || title.trim() === '') return null;
    
    return {
      title,
      description: project.querySelector('.project-description').value,
      thumbnail: project.querySelector('.project-thumbnail').src,
      demoUrl: project.querySelectorAll('.project-link-input')[0].value,
      githubUrl: project.querySelectorAll('.project-link-input')[1].value
    };
  }).filter(project => project !== null);
  
  if (projects.length === 0) return null;
  
  let projectsHTML = `
    <div class="preview-section">
      <div class="section-icon"><i class="fas ${sectionIcons['projects']}"></i></div>
      <h2>Projects</h2>
  `;
  
  projects.forEach(project => {
    projectsHTML += `
      <div style="margin-bottom: 2rem;">
        <h3 style="margin-bottom: 0.5rem;">${project.title}</h3>
        ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title}" style="max-width: 100%; height: auto; margin-bottom: 1rem; border-radius: 4px;">` : ''}
        <p style="margin-bottom: 0.5rem;">${formatPreviewText(project.description || '')}</p>
        <div style="display: flex; gap: 1rem;">
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" style="color: var(--primary);">Live Demo</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" style="color: var(--primary);">GitHub</a>` : ''}
        </div>
      </div>
    `;
  });
  
  projectsHTML += `</div>`;
  return projectsHTML;
}

function createEducationPage() {
  const educationContent = document.getElementById('education-content').value;
  if (!educationContent || educationContent.trim() === '') return null;
  
  return `
    <div class="preview-section">
      <div class="section-icon"><i class="fas ${sectionIcons['education']}"></i></div>
      <h2>Education</h2>
      <div>${formatPreviewText(educationContent)}</div>
    </div>
  `;
}

function createContactPage() {
  const contactEmail = document.getElementById('contact-email').value;
  const contactPhone = document.getElementById('contact-phone').value;
  const contactLinkedin = document.getElementById('contact-linkedin').value;
  const contactGithub = document.getElementById('contact-github').value;
  
  if (!contactEmail && !contactPhone && !contactLinkedin && !contactGithub) return null;
  
  let contactHTML = `
    <div class="preview-section">
      <div class="section-icon"><i class="fas ${sectionIcons['contact']}"></i></div>
      <h2>Contact</h2>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
  `;
  
  if (contactEmail) {
    contactHTML += `
      <div style="display: flex; align-items: center;">
        <i class="fas fa-envelope" style="margin-right: 0.5rem; color: var(--primary);"></i>
        <a href="mailto:${contactEmail}" style="color: var(--text);">${contactEmail}</a>
      </div>
    `;
  }
  
  if (contactPhone) {
    contactHTML += `
      <div style="display: flex; align-items: center;">
        <i class="fas fa-phone" style="margin-right: 0.5rem; color: var(--primary);"></i>
        <span>${contactPhone}</span>
      </div>
    `;
  }
  
  if (contactLinkedin) {
    contactHTML += `
      <div style="display: flex; align-items: center;">
        <i class="fab fa-linkedin" style="margin-right: 0.5rem; color: var(--primary);"></i>
        <a href="${contactLinkedin}" target="_blank" style="color: var(--text);">LinkedIn Profile</a>
      </div>
    `;
  }
  
  if (contactGithub) {
    contactHTML += `
      <div style="display: flex; align-items: center;">
        <i class="fab fa-github" style="margin-right: 0.5rem; color: var(--primary);"></i>
        <a href="${contactGithub}" target="_blank" style="color: var(--text);">GitHub Profile</a>
      </div>
    `;
  }
  
  contactHTML += `</div></div>`;
  return contactHTML;
}

function setupPreviewNavigation() {
  const nextBtn = document.getElementById('next-page-btn');
  const prevBtn = document.getElementById('prev-page-btn');
  
  nextBtn.replaceWith(nextBtn.cloneNode(true));
  prevBtn.replaceWith(prevBtn.cloneNode(true));
  
  const newNextBtn = document.getElementById('next-page-btn');
  const newPrevBtn = document.getElementById('prev-page-btn');
  
  newNextBtn.addEventListener('click', () => navigateToPage(currentPage + 1));
  newPrevBtn.addEventListener('click', () => navigateToPage(currentPage - 1));
  
  updateNavButtons();
}

function navigateToPage(newPage) {
  if (newPage < 0 || newPage >= pages.length) return;
  
  document.getElementById('next-page-btn').disabled = true;
  document.getElementById('prev-page-btn').disabled = true;
  
  const direction = newPage > currentPage ? 'next' : 'prev';
  
  pages[currentPage].classList.remove('active');
  pages[currentPage].classList.add(direction === 'next' ? 'prev' : 'next');
  
  pages[newPage].classList.remove('next', 'prev');
  pages[newPage].classList.add('active');
  
  currentPage = newPage;
  updatePageIndicator(currentPage, pages.length);
  
  setTimeout(() => {
    updateNavButtons();
  }, 500);
}

function updateNavButtons() {
  const nextBtn = document.getElementById('next-page-btn');
  const prevBtn = document.getElementById('prev-page-btn');
  
  nextBtn.disabled = currentPage >= pages.length - 1;
  prevBtn.disabled = currentPage <= 0;
}

function updatePageIndicator(current, total) {
  document.getElementById('page-indicator').textContent = `Page ${current + 1} of ${total}`;
}

function formatPreviewText(text) {
  if (!text) return '';
  return text.split('\n\n').map(paragraph => 
    `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
  ).join('');
}

// Get template colors
function getTemplateColors(template) {
  const templates = {
    'black-white': { primary: '#000000', secondary: '#808080', text: '#333333', bg: '#ffffff' },
    'beige-modern': { primary: '#d4a373', secondary: '#fefae0', text: '#5a3e2b', bg: '#f8f1e9' },
    'aesthetic': { primary: '#a5b4fc', secondary: '#c7d2fe', text: '#4b5563', bg: '#f9fafb' },
    'beige-gray': { primary: '#a8a29e', secondary: '#d6d3d1', text: '#44403c', bg: '#f5f5f4' },
    'memphis': { primary: '#f59e0b', secondary: '#fbbf24', text: '#1f2937', bg: '#fef3c7' }
  };
  return templates[template] || templates['black-white'];
}

// Generate PDF content with all styling and data
function generatePDFContent() {
  const heroTitle = document.getElementById('hero-title').value || 'Your Name';
  const heroSubtitle = document.getElementById('hero-subtitle').value || 'Your Profession';
  const heroBio = document.getElementById('hero-bio').value || 'A brief introduction about yourself';
  const profileImage = document.getElementById('profile-preview').src;
  
  const aboutContent = document.getElementById('about-content').value;
  const experienceContent = document.getElementById('experience-content').value;
  const educationContent = document.getElementById('education-content').value;
  
  const contactEmail = document.getElementById('contact-email').value;
  const contactPhone = document.getElementById('contact-phone').value;
  const contactLinkedin = document.getElementById('contact-linkedin').value;
  const contactGithub = document.getElementById('contact-github').value;
  
  const skills = Array.from(document.querySelectorAll('.skill-item')).map(skill => {
    const name = skill.querySelector('.skill-name').value;
    const level = skill.querySelector('.skill-range').value;
    return name.trim() ? { name, level } : null;
  }).filter(skill => skill !== null);
  
  const projects = Array.from(document.querySelectorAll('.project-item')).map(project => {
    const title = project.querySelector('.project-title').value;
    if (!title || title.trim() === '') return null;
    
    return {
      title,
      description: project.querySelector('.project-description').value,
      thumbnail: project.querySelector('.project-thumbnail').src,
      demoUrl: project.querySelectorAll('.project-link-input')[0].value,
      githubUrl: project.querySelectorAll('.project-link-input')[1].value
    };
  }).filter(project => project !== null);
  
  // Get template colors
  const colors = getTemplateColors(currentTemplate);
  
  let content = `
    <div style="padding: 40px; font-family: ${currentFont || "'Inter', sans-serif"}; line-height: 1.6; color: ${colors.text}; background-color: ${colors.bg}; min-height: 100vh; position: relative; ${currentBackground ? `background-image: url('backgrounds/${currentBackground}'); background-size: cover; background-position: center; background-repeat: no-repeat; background-attachment: fixed;` : ''}">
      <!-- Hero Section -->
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid ${colors.primary}; padding: 30px 0;">
        <img src="${profileImage}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 20px auto; display: block; border: 3px solid ${colors.primary};">
        <h1 style="margin: 10px 0; color: ${colors.primary}; font-size: 2.5em;">${heroTitle}</h1>
        <h2 style="margin: 10px 0; font-weight: normal; color: ${colors.text}; opacity: 0.7; font-size: 1.5em;">${heroSubtitle}</h2>
        <p style="max-width: 600px; margin: 20px auto; font-size: 1.1em; color: ${colors.text};">${heroBio}</p>
      </div>
  `;
  
  if (aboutContent && aboutContent.trim()) {
    content += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 5px; margin-bottom: 20px;">About Me</h2>
        <div style="font-size: 1.1em; color: ${colors.text};">${formatPreviewText(aboutContent)}</div>
      </div>
    `;
  }
  
  if (skills.length > 0) {
    content += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 5px; margin-bottom: 20px;">Skills</h2>
    `;
    
    skills.forEach(skill => {
      content += `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: 500; color: ${colors.text};">${skill.name}</span>
            <span style="color: ${colors.text};">${skill.level}%</span>
          </div>
          <div style="height: 10px; background: #f0f0f0; border-radius: 5px;">
            <div style="width: ${skill.level}%; height: 100%; background: ${colors.primary}; border-radius: 5px;"></div>
          </div>
        </div>
      `;
    });
    
    content += '</div>';
  }
  
  if (experienceContent && experienceContent.trim()) {
    content += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 5px; margin-bottom: 20px;">Experience</h2>
        <div style="font-size: 1.1em; color: ${colors.text};">${formatPreviewText(experienceContent)}</div>
      </div>
    `;
  }
  
  if (projects.length > 0) {
    content += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 5px; margin-bottom: 20px;">Projects</h2>
    `;
    
    projects.forEach(project => {
      content += `
        <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: white;">
          <h3 style="margin: 0 0 10px 0; color: ${colors.primary};">${project.title}</h3>
          ${project.thumbnail && !project.thumbnail.includes('placeholder') ? `<img src="${project.thumbnail}" alt="${project.title}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px;">` : ''}
          <p style="margin: 10px 0; color: ${colors.text};">${formatPreviewText(project.description || '')}</p>
          <div style="margin-top: 10px;">
            ${project.demoUrl ? `<a href="${project.demoUrl}" style="margin-right: 15px; color: ${colors.primary}; text-decoration: none;">🔗 Live Demo</a>` : ''}
            ${project.githubUrl ? `<a href="${project.githubUrl}" style="color: ${colors.primary}; text-decoration: none;">📁 GitHub</a>` : ''}
          </div>
        </div>
      `;
    });
    
    content += '</div>';
  }
  
  if (educationContent && educationContent.trim()) {
    content += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 5px; margin-bottom: 20px;">Education</h2>
        <div style="font-size: 1.1em; color: ${colors.text};">${formatPreviewText(educationContent)}</div>
      </div>
    `;
  }
  
  if (contactEmail || contactPhone || contactLinkedin || contactGithub) {
    content += `
      <div style="margin-bottom: 40px;">
        <h2 style="color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 5px; margin-bottom: 20px;">Contact</h2>
        <div style="display: flex; flex-direction: column; gap: 10px;">
    `;
    
    if (contactEmail) {
      content += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">📧</span><span style="color: ${colors.text};">${contactEmail}</span></div>`;
    }
    if (contactPhone) {
      content += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">📞</span><span style="color: ${colors.text};">${contactPhone}</span></div>`;
    }
    if (contactLinkedin) {
      content += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">💼</span><a href="${contactLinkedin}" style="color: ${colors.primary};">LinkedIn Profile</a></div>`;
    }
    if (contactGithub) {
      content += `<div style="display: flex; align-items: center;"><span style="margin-right: 10px;">🔗</span><a href="${contactGithub}" style="color: ${colors.primary};">GitHub Profile</a></div>`;
    }
    
    content += '</div></div>';
  }
  
  content += '</div>';
  return content;
}

// Preview functionality
document.getElementById('preview-btn').addEventListener('click', function() {
  document.getElementById('preview-modal').classList.add('active');
  if (pages.length === 0) {
    generatePreview();
  }
});

document.getElementById('close-preview').addEventListener('click', function() {
  document.getElementById('preview-modal').classList.remove('active');
  pages = [];
  currentPage = 0;
  document.getElementById('portfolio-preview-pages').innerHTML = '';
});

// Download as PDF from builder page
document.getElementById('download-btn').addEventListener('click', async function() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (!loggedIn || loggedIn !== 'true') {
    alert('Please login to download your portfolio');
    showPage('login-page');
    return;
  }

  const downloadBtn = document.getElementById('download-btn');
  const originalText = downloadBtn.textContent;
  
  try {
    downloadBtn.textContent = 'Generating PDF...';
    downloadBtn.disabled = true;

    // Check if form has content
    const heroTitle = document.getElementById('hero-title').value;
    const heroSubtitle = document.getElementById('hero-subtitle').value;
    
    if (!heroTitle && !heroSubtitle) {
      alert('Please fill in at least your name and profession before generating PDF');
      downloadBtn.textContent = originalText;
      downloadBtn.disabled = false;
      return;
    }
    
    console.log('Generating PDF using html2canvas and jsPDF');
    
    // Generate PDF content HTML
    const pdfContent = generatePDFContent();
    
    // Create temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = pdfContent;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '800px';
    tempContainer.style.padding = '20px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.fontFamily = currentFont || "'Inter', sans-serif";
    document.body.appendChild(tempContainer);
    
    // Use html2canvas to capture the content
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempContainer.scrollHeight
    });
    
    // Remove temporary container
    document.body.removeChild(tempContainer);
    
    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    const fileName = `${heroTitle || 'Portfolio'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
  }
});

// Save portfolio function
document.getElementById('save-portfolio-btn').addEventListener('click', async function() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (!loggedIn || loggedIn !== 'true') {
    alert('Please login to save your portfolio');
    showPage('login-page');
    return;
  }

  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName') || 'User';

  const sections = {
    hero: {
      title: document.getElementById('hero-title').value,
      subtitle: document.getElementById('hero-subtitle').value,
      bio: document.getElementById('hero-bio').value,
      imageUrl: document.getElementById('profile-preview').src
    },
    about: {
      content: document.getElementById('about-content').value
    },
    skills: Array.from(document.querySelectorAll('.skill-item')).map(skill => ({
      name: skill.querySelector('.skill-name').value,
      level: skill.querySelector('.skill-range').value
    })),
    experience: {
      content: document.getElementById('experience-content').value
    },
    projects: Array.from(document.querySelectorAll('.project-item')).map(project => ({
      title: project.querySelector('.project-title').value,
      description: project.querySelector('.project-description').value,
      thumbnail: project.querySelector('.project-thumbnail').src,
      demoUrl: project.querySelectorAll('.project-link-input')[0].value,
      githubUrl: project.querySelectorAll('.project-link-input')[1].value
    })),
    education: {
      content: document.getElementById('education-content').value
    },
    contact: {
      email: document.getElementById('contact-email').value,
      phone: document.getElementById('contact-phone').value,
      linkedin: document.getElementById('contact-linkedin').value,
      github: document.getElementById('contact-github').value
    }
  };

  try {
    const formData = new FormData();
    const profileImage = document.getElementById('profile-upload').files[0];
    if (profileImage) {
      formData.append('image', profileImage);
    }
    
    formData.append('name', userName);
    formData.append('email', userEmail);
    formData.append('sections', JSON.stringify(sections));
    formData.append('template', currentTemplate);
    formData.append('font', currentFont);
    formData.append('background', currentBackground ? `backgrounds/${currentBackground}` : '');

    let response;
    let method;
    let url;

    if (currentPortfolioId) {
      method = 'PUT';
      url = `/portfolio/${currentPortfolioId}`;
    } else {
      method = 'POST';
      url = '/portfolio/save';
    }

    response = await fetch(url, {
      method,
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      currentPortfolioId = result._id;
      alert('Portfolio saved successfully!');
      loadUserPortfolios();
    } else {
      throw new Error('Failed to save portfolio');
    }
  } catch (error) {
    console.error('Error saving portfolio:', error);
    alert('Error saving portfolio. Please try again.');
  }
});

// Load user portfolios
async function loadUserPortfolios() {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;

  try {
    const response = await fetch(`/portfolio/user/${encodeURIComponent(userEmail)}`);
    const portfolios = await response.json();
    displayPortfolios(portfolios);
  } catch (error) {
    console.error('Error loading portfolios:', error);
  }
}

// Display portfolios in the saved portfolios page
function displayPortfolios(portfolios) {
  const container = document.getElementById('saved-portfolios-container');
  container.innerHTML = '';

  if (!portfolios || portfolios.length === 0) {
    container.innerHTML = '<p>No saved portfolios found.</p>';
    return;
  }

  portfolios.forEach(portfolio => {
    const portfolioCard = document.createElement('div');
    portfolioCard.className = 'portfolio-card';
    portfolioCard.innerHTML = `
      <div class="portfolio-preview" style="background-image: url('${portfolio.imageUrl || 'https://via.placeholder.com/300x200?text=Portfolio'}')"></div>
      <h3>${portfolio.name}'s Portfolio</h3>
      <p>Created: ${new Date(portfolio.createdAt).toLocaleDateString()}</p>
      <button class="btn-view" data-id="${portfolio._id}">View</button>
      <button class="btn-download-pdf" data-id="${portfolio._id}">Download PDF</button>
    `;
    container.appendChild(portfolioCard);
  });

  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', function() {
      viewPortfolio(this.getAttribute('data-id'));
    });
  });

  document.querySelectorAll('.btn-download-pdf').forEach(btn => {
    btn.addEventListener('click', function() {
      downloadPortfolioPDF(this.getAttribute('data-id'));
    });
  });
}

// View portfolio
async function viewPortfolio(portfolioId) {
  try {
    const response = await fetch(`/portfolio/${portfolioId}`);
    if (!response.ok) throw new Error('Failed to fetch portfolio');
    
    const portfolio = await response.json();
    currentPortfolioId = portfolioId;
    populateBuilderWithPortfolio(portfolio);
    document.body.className = `template-${portfolio.template || 'black-white'}`;
    document.body.style.fontFamily = portfolio.font || "'Inter', sans-serif";
    
    if (portfolio.background) {
      const bgName = portfolio.background.split('/').pop();
      currentBackground = bgName;
      document.getElementById('portfolio-preview-pages').style.backgroundImage = `url('backgrounds/${bgName}')`;
    }
    
    showPage('builder-page');
    document.getElementById('save-portfolio-btn').textContent = 'Update Portfolio';
    
  } catch (error) {
    console.error('Error viewing portfolio:', error);
    alert('Error loading portfolio. Please try again.');
  }
}

function populateBuilderWithPortfolio(portfolio) {
  const sections = portfolio.sections;
  
  // Hero Section
  if (sections.hero) {
    document.getElementById('hero-title').value = sections.hero.title || '';
    document.getElementById('hero-subtitle').value = sections.hero.subtitle || '';
    document.getElementById('hero-bio').value = sections.hero.bio || '';
    if (sections.hero.imageUrl) {
      document.getElementById('profile-preview').src = sections.hero.imageUrl;
    }
  }
  
  // About Section
  if (sections.about) {
    document.getElementById('about-content').value = sections.about.content || '';
  }
  
  // Skills Section
  const skillsContainer = document.getElementById('skills-container');
  skillsContainer.innerHTML = '';
  if (sections.skills && sections.skills.length > 0) {
    sections.skills.forEach(skill => {
      const skillElement = document.createElement('div');
      skillElement.className = 'skill-item';
      skillElement.innerHTML = `
        <div class="skill-input-group">
          <input type="text" class="skill-name" placeholder="Skill name" value="${skill.name || ''}">
          <div class="skill-percentage-display">
            <span class="percentage-value">${skill.level || 80}%</span>
            <input type="range" min="1" max="100" value="${skill.level || 80}" class="skill-range">
          </div>
        </div>
        <button class="btn-remove-skill">×</button>
      `;
      skillsContainer.appendChild(skillElement);
      
      const rangeInput = skillElement.querySelector('.skill-range');
      const percentageValue = skillElement.querySelector('.percentage-value');
      rangeInput.addEventListener('input', function() {
        percentageValue.textContent = `${this.value}%`;
      });
    });
  }
  
  // Experience Section
  if (sections.experience) {
    document.getElementById('experience-content').value = sections.experience.content || '';
  }
  
  // Projects Section
  const projectsContainer = document.getElementById('projects-container');
  projectsContainer.innerHTML = '';
  if (sections.projects && sections.projects.length > 0) {
    sections.projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.className = 'project-item';
      projectElement.innerHTML = `
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" class="project-title" placeholder="Project name" value="${project.title || ''}">
        </div>
        <div class="form-group">
          <label>Project Description</label>
          <textarea class="project-description" rows="3" placeholder="Project description">${project.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Project Thumbnail</label>
          <div class="project-thumbnail-container">
            <img src="${project.thumbnail || 'https://via.placeholder.com/600x400?text=Project+Thumbnail'}" class="project-thumbnail" alt="Project thumbnail">
            <input type="file" class="project-thumbnail-upload hidden" accept="image/*">
            <button class="project-upload-btn">Upload Thumbnail</button>
          </div>
        </div>
        <div class="form-group">
          <label>Project Links</label>
          <div class="project-links">
            <input type="text" class="project-link-input" placeholder="Live Demo URL" value="${project.demoUrl || ''}">
            <input type="text" class="project-link-input" placeholder="GitHub URL" value="${project.githubUrl || ''}">
          </div>
        </div>
        <button class="btn-remove-project">Remove Project</button>
      `;
      projectsContainer.appendChild(projectElement);
    });
  }
  
  // Education Section
  if (sections.education) {
    document.getElementById('education-content').value = sections.education.content || '';
  }
  
  // Contact Section
  if (sections.contact) {
    document.getElementById('contact-email').value = sections.contact.email || '';
    document.getElementById('contact-phone').value = sections.contact.phone || '';
    document.getElementById('contact-linkedin').value = sections.contact.linkedin || '';
    document.getElementById('contact-github').value = sections.contact.github || '';
  }
}

// Download PDF
function downloadPortfolioPDF(portfolioId) {
  window.open(`/portfolio/generate-pdf/${portfolioId}`, '_blank');
}

// Update the my-portfolios button
document.getElementById('my-portfolios').addEventListener('click', function(e) {
  e.preventDefault();
  loadUserPortfolios();
  showPage('saved-portfolios-page');
});

// Load portfolios when landing page is shown
document.getElementById('landing-page').addEventListener('click', function(e) {
  if (e.target.id === 'my-portfolios') {
    loadUserPortfolios();
  }
});

// Check login status
function checkLogin() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn === 'true') {
    showPage('landing-page');
    loadUserPortfolios();
  }
}

// Initialize everything
setupSectionNavigation();
setupProjectThumbnailUpload();
setupTemplateSelection();
checkLogin();

// Start with login page
showPage('login-page');