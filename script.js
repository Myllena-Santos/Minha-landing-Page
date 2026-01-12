/**
 * Sistema de Projetos GitHub - Versão Clean
 */

// Configuração
const GITHUB_USER = 'Myllena-Santos';
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos`;

// Elementos
const projectList = document.getElementById('my-project-list');
const loading = document.getElementById('loading');

/**
 * Inicializa o sistema
 */
function init() {
    loadProjects();
    
    // Adiciona navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Carrega projetos do GitHub
 */
async function loadProjects() {
    try {
        showLoading(true);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar projetos');
        }
        
        const projects = await response.json();
        displayProjects(projects);
        
    } catch (error) {
        console.error('Erro:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

/**
 * Exibe projetos na página
 */
function displayProjects(projects) {
    if (!projectList) return;
    
    projectList.innerHTML = '';
    
    // Filtra apenas projetos principais
    const mainProjects = projects
        .filter(p => !p.fork && !p.archived)
        .slice(0, 6); // Limita a 6 projetos
    
    if (mainProjects.length === 0) {
        projectList.innerHTML = `
            <div class="project-card">
                <h3>Nenhum projeto encontrado</h3>
                <p>Os projetos aparecerão aqui quando estiverem no GitHub.</p>
            </div>
        `;
        return;
    }
    
    mainProjects.forEach(project => {
        const card = createProjectCard(project);
        projectList.appendChild(card);
    });
}

/**
 * Cria um card de projeto
 */
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'Projeto sem descrição'}</p>
        
        <div class="project-tech">
            ${project.language ? `
                <span class="tech-tag">${project.language}</span>
            ` : ''}
        </div>
        
        <div class="project-links">
            <a href="${project.html_url}" target="_blank" rel="noopener">
                Ver no GitHub
            </a>
            ${project.homepage ? `
                <a href="${project.homepage}" target="_blank" rel="noopener">
                    Ver Demo
                </a>
            ` : ''}
        </div>
    `;
    
    return card;
}

/**
 * Gerencia estado de loading
 */
function showLoading(isLoading) {
    if (loading) {
        loading.style.display = isLoading ? 'block' : 'none';
    }
    
    if (projectList && isLoading) {
        projectList.innerHTML = '';
    }
}

/**
 * Mostra mensagem de erro
 */
function showError() {
    if (!projectList) return;
    
    projectList.innerHTML = `
        <div class="project-card">
            <h3>Erro ao carregar projetos</h3>
            <p>Não foi possível conectar ao GitHub no momento.</p>
            <button onclick="loadProjects()" class="btn" style="margin-top: 1rem;">
                Tentar novamente
            </button>
        </div>
    `;
}

/**
 * Anima as barras de skill
 */
function animateSkills() {
    document.querySelectorAll('.skill-level').forEach(bar => {
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = bar.style.width;
        }, 300);
    });
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    init();
    
    // Anima skills quando visíveis
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});