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

// Add new skill
document.getElementById('add-skill-btn').addEventListener('click', function() {
  const skillsContainer = document.getElementById('skills-container');
  const newSkill = document.createElement('div');
  newSkill.className = 'skill-item';
  newSkill.innerHTML = `
    <input type="text" class="skill-name" placeholder="Skill name (e.g. JavaScript)">
    <input type="range" min="1" max="100" value="80" class="skill-range">
    <button class="btn-remove-skill">×</button>
  `;
  skillsContainer.appendChild(newSkill);
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

// Preview functionality
document.getElementById('preview-btn').addEventListener('click', function() {
  generatePreview();
  document.getElementById('preview-modal').classList.add('active');
});

document.getElementById('close-preview').addEventListener('click', function() {
  document.getElementById('preview-modal').classList.remove('active');
});

function generatePreview() {
  const previewContent = document.getElementById('portfolio-preview-content');
  previewContent.innerHTML = '';
  
  // Hero section
  const heroTitle = document.getElementById('hero-title').value || 'Your Name';
  const heroSubtitle = document.getElementById('hero-subtitle').value || 'Your Profession';
  const heroBio = document.getElementById('hero-bio').value || 'A brief introduction about yourself';
  const profileImage = document.getElementById('profile-preview').src;
  
  const heroSection = document.createElement('div');
  heroSection.className = 'preview-section';
  heroSection.innerHTML = `
    <div style="text-align: center; padding: 2rem 0;">
      <img src="${profileImage}" alt="Profile" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
      <h1 style="margin: 0.5rem 0; color: var(--primary);">${heroTitle}</h1>
      <h2 style="margin: 0.5rem 0; font-weight: normal; color: var(--text-light);">${heroSubtitle}</h2>
      <p style="max-width: 600px; margin: 1rem auto;">${heroBio}</p>
    </div>
  `;
  previewContent.appendChild(heroSection);
  
  // About section
  const aboutContent = document.getElementById('about-content').value;
  if (aboutContent) {
    const aboutSection = document.createElement('div');
    aboutSection.className = 'preview-section';
    aboutSection.innerHTML = `
      <h2>About Me</h2>
      <p>${aboutContent.replace(/\n/g, '<br>')}</p>
    `;
    previewContent.appendChild(aboutSection);
  }
  
  // Skills section
  const skills = Array.from(document.querySelectorAll('.skill-item')).map(skill => {
    return {
      name: skill.querySelector('.skill-name').value,
      level: skill.querySelector('.skill-range').value
    };
  }).filter(skill => skill.name);
  
  if (skills.length > 0) {
    const skillsSection = document.createElement('div');
    skillsSection.className = 'preview-section';
    skillsSection.innerHTML = '<h2>Skills</h2>';
    
    skills.forEach(skill => {
      const skillElement = document.createElement('div');
      skillElement.style.marginBottom = '1rem';
      skillElement.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
          <span>${skill.name}</span>
          <span>${skill.level}%</span>
        </div>
        <div style="height: 8px; background: var(--light-gray); border-radius: 4px;">
          <div style="width: ${skill.level}%; height: 100%; background: var(--primary); border-radius: 4px;"></div>
        </div>
      `;
      skillsSection.appendChild(skillElement);
    });
    
    previewContent.appendChild(skillsSection);
  }
  
  // Projects section
  const projects = Array.from(document.querySelectorAll('.project-item')).map(project => {
    return {
      title: project.querySelector('.project-title').value,
      description: project.querySelector('.project-description').value,
      thumbnail: project.querySelector('.project-thumbnail').src,
      demoUrl: project.querySelectorAll('.project-link-input')[0].value,
      githubUrl: project.querySelectorAll('.project-link-input')[1].value
    };
  }).filter(project => project.title);
  
  if (projects.length > 0) {
    const projectsSection = document.createElement('div');
    projectsSection.className = 'preview-section';
    projectsSection.innerHTML = '<h2>Projects</h2>';
    
    projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.className = 'preview-project';
      projectElement.style.marginBottom = '2rem';
      projectElement.innerHTML = `
        <h3 style="margin-bottom: 0.5rem;">${project.title}</h3>
        ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title}" style="max-width: 100%; height: auto; margin-bottom: 1rem; border-radius: 4px;">` : ''}
        <p style="margin-bottom: 0.5rem;">${project.description.replace(/\n/g, '<br>')}</p>
        <div style="display: flex; gap: 1rem;">
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" style="color: var(--primary);">Live Demo</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" style="color: var(--primary);">GitHub</a>` : ''}
        </div>
      `;
      projectsSection.appendChild(projectElement);
    });
    
    previewContent.appendChild(projectsSection);
  }
  
  // Experience section
  const experienceContent = document.getElementById('experience-content').value;
  if (experienceContent) {
    const experienceSection = document.createElement('div');
    experienceSection.className = 'preview-section';
    experienceSection.innerHTML = `
      <h2>Experience</h2>
      <div>${experienceContent.replace(/\n/g, '<br>')}</div>
    `;
    previewContent.appendChild(experienceSection);
  }
  
  // Education section
  const educationContent = document.getElementById('education-content').value;
  if (educationContent) {
    const educationSection = document.createElement('div');
    educationSection.className = 'preview-section';
    educationSection.innerHTML = `
      <h2>Education</h2>
      <div>${educationContent.replace(/\n/g, '<br>')}</div>
    `;
    previewContent.appendChild(educationSection);
  }
  
  // Contact section
  const contactEmail = document.getElementById('contact-email').value;
  const contactPhone = document.getElementById('contact-phone').value;
  const contactLinkedin = document.getElementById('contact-linkedin').value;
  const contactGithub = document.getElementById('contact-github').value;
  
  if (contactEmail || contactPhone || contactLinkedin || contactGithub) {
    const contactSection = document.createElement('div');
    contactSection.className = 'preview-section';
    contactSection.innerHTML = '<h2>Contact</h2>';
    
    const contactList = document.createElement('div');
    contactList.style.display = 'flex';
    contactList.style.flexDirection = 'column';
    contactList.style.gap = '0.5rem';
    
    if (contactEmail) {
      contactList.innerHTML += `
        <div style="display: flex; align-items: center;">
          <i class="fas fa-envelope" style="margin-right: 0.5rem; color: var(--primary);"></i>
          <a href="mailto:${contactEmail}" style="color: var(--text);">${contactEmail}</a>
        </div>
      `;
    }
    
    if (contactPhone) {
      contactList.innerHTML += `
        <div style="display: flex; align-items: center;">
          <i class="fas fa-phone" style="margin-right: 0.5rem; color: var(--primary);"></i>
          <span>${contactPhone}</span>
        </div>
      `;
    }
    
    if (contactLinkedin) {
      contactList.innerHTML += `
        <div style="display: flex; align-items: center;">
          <i class="fab fa-linkedin" style="margin-right: 0.5rem; color: var(--primary);"></i>
          <a href="${contactLinkedin}" target="_blank" style="color: var(--text);">LinkedIn Profile</a>
        </div>
      `;
    }
    
    if (contactGithub) {
      contactList.innerHTML += `
        <div style="display: flex; align-items: center;">
          <i class="fab fa-github" style="margin-right: 0.5rem; color: var(--primary);"></i>
          <a href="${contactGithub}" target="_blank" style="color: var(--text);">GitHub Profile</a>
        </div>
      `;
    }
    
    contactSection.appendChild(contactList);
    previewContent.appendChild(contactSection);
  }
}

// Download as PDF
document.getElementById('download-btn').addEventListener('click', function() {
  alert('PDF generation would be implemented here. In a real application, you would use a library like jsPDF or a server-side solution to generate the PDF.');
});