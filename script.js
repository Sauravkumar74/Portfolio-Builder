// Page navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Start with login page
showPage('login-page');

// Auth functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  // Simple validation
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  // On successful login, go to landing page
  showPage('landing-page');
  
  // Store user data
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('userEmail', email);
});

document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  // Simple validation
  if (!name || !email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  // On successful registration, go to landing page
  showPage('landing-page');
  
  // Store user data
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userName', name);
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

// My Portfolios button
document.getElementById('my-portfolios').addEventListener('click', function(e) {
  e.preventDefault();
  alert('My Portfolios feature would show saved portfolios here. In a real app, this would connect to a database.');
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  showPage('login-page');
});

// Check if user is logged in
function checkLogin() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn === 'true') {
    showPage('landing-page');
  }
}

// Run check on page load
checkLogin();

// Builder page functionality
function setupSectionNavigation() {
  const sectionItems = document.querySelectorAll('.section-item');
  
  sectionItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      sectionItems.forEach(i => {
        i.classList.remove('active');
      });
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Hide all section editors
      document.querySelectorAll('.section-editor').forEach(editor => {
        editor.classList.add('hidden');
      });
      
      // Show the selected section editor
      const sectionId = this.getAttribute('data-section') + '-section';
      document.getElementById(sectionId).classList.remove('hidden');
    });
  });
}

// Initialize section navigation
setupSectionNavigation();

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

// Initialize project thumbnail upload
setupProjectThumbnailUpload();

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
  
  // Add event listener for the new range input
  const rangeInput = newSkill.querySelector('.skill-range');
  const percentageValue = newSkill.querySelector('.percentage-value');
  
  rangeInput.addEventListener('input', function() {
    percentageValue.textContent = `${this.value}%`;
  });
});

// Initialize event listeners for existing range inputs
document.querySelectorAll('.skill-range').forEach(range => {
  const percentageValue = range.parentElement.querySelector('.percentage-value');
  range.addEventListener('input', function() {
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
      // Remove selected class from all options
      templateOptions.forEach(opt => {
        opt.classList.remove('selected');
      });
      
      // Add selected class to clicked option
      this.classList.add('selected');
      
      // Change template
      const templateName = this.getAttribute('data-template');
      document.body.className = `template-${templateName}`;
    });
  });
}

// Initialize template selection
setupTemplateSelection();

// Font selection
document.getElementById('font-select').addEventListener('change', function() {
  document.body.style.fontFamily = this.value;
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

let currentPage = 0;
let pages = [];

function generatePreview() {
  const previewPages = document.getElementById('portfolio-preview-pages');
  previewPages.innerHTML = '';
  
  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator active';
  loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin fa-3x"></i>';
  previewPages.appendChild(loadingIndicator);
  
  // Generate pages in order
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
  
  // Create all pages in sequence
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
    
    // Hide loading indicator
    loadingIndicator.remove();
    
    // Activate first page if available
    if (pages.length > 0) {
      pages[0].classList.add('active');
      updatePageIndicator(0, pages.length);
    } else {
      previewPages.innerHTML = '<p>No content available for preview.</p>';
    }
    
    setupPreviewNavigation();
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
  
  // Clear previous event listeners
  nextBtn.replaceWith(nextBtn.cloneNode(true));
  prevBtn.replaceWith(prevBtn.cloneNode(true));
  
  // Get new references after clone
  const newNextBtn = document.getElementById('next-page-btn');
  const newPrevBtn = document.getElementById('prev-page-btn');
  
  newNextBtn.addEventListener('click', () => navigateToPage(currentPage + 1));
  newPrevBtn.addEventListener('click', () => navigateToPage(currentPage - 1));
  
  // Update button states
  updateNavButtons();
}

function navigateToPage(newPage) {
  if (newPage < 0 || newPage >= pages.length) return;
  
  // Disable buttons during transition
  document.getElementById('next-page-btn').disabled = true;
  document.getElementById('prev-page-btn').disabled = true;
  
  // Determine transition direction
  const direction = newPage > currentPage ? 'next' : 'prev';
  
  // Update classes for transition
  pages[currentPage].classList.remove('active');
  pages[currentPage].classList.add(direction === 'next' ? 'prev' : 'next');
  
  pages[newPage].classList.remove('next', 'prev');
  pages[newPage].classList.add('active');
  
  currentPage = newPage;
  updatePageIndicator(currentPage, pages.length);
  
  // Re-enable buttons after transition
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

// Preview functionality
document.getElementById('preview-btn').addEventListener('click', function() {
  generatePreview();
  document.getElementById('preview-modal').classList.add('active');
});

document.getElementById('close-preview').addEventListener('click', function() {
  document.getElementById('preview-modal').classList.remove('active');
});

// Download as PDF
document.getElementById('download-btn').addEventListener('click', function() {
  alert('PDF generation would be implemented here. In a real application, you would use a library like jsPDF or a server-side solution to generate the PDF.');
});





document.addEventListener('DOMContentLoaded', function () {
  const previewBtn = document.getElementById('preview-btn');
  const previewModal = document.getElementById('preview-modal');
  const closePreview = document.getElementById('close-preview');
  const backgroundOptions = document.querySelectorAll('.background-option');
  const previewContainer = document.getElementById('portfolio-preview-pages');

  // Show preview modal
  previewBtn.addEventListener('click', function () {
    previewModal.style.display = 'flex';
  });

  // Close preview modal
  closePreview.addEventListener('click', function () {
    previewModal.style.display = 'none';
  });

  // Handle background selection
  backgroundOptions.forEach(option => {
    option.addEventListener('click', () => {
      const bgFile = option.getAttribute('data-bg');
      previewContainer.style.backgroundImage = `url('backgrounds/${bgFile}')`;
    });
  });

});
