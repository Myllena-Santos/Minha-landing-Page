/**
 * Sistema de Projetos GitHub - Funcional e Simples
 */

// Configurações
const GITHUB_USER = 'Myllena-Santos';
const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos`;

// Quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfólio iniciado');
    
    // 1. Anima as barras de skill
    animateSkillBars();
    
    // 2. Carrega projetos do GitHub
    loadProjects();
    
    // 3. Configura navegação suave
    setupSmoothScrolling();
});

/**
 * Anima as barras de skill
 */
function animateSkillBars() {
    // Aguarda um pouco para garantir que a página carregou
    setTimeout(() => {
        const skillBars = document.querySelectorAll('.skill-level');
        
        skillBars.forEach(bar => {
            // Remove qualquer estilo inline que possa estar bloqueando
            bar.style.width = '0';
            
            // Pequeno delay para iniciar animação
            setTimeout(() => {
                // Pega a largura definida no style="width: X%"
                const targetWidth = bar.getAttribute('style')?.match(/width:\s*(\d+)%/);
                if (targetWidth) {
                    bar.style.width = targetWidth[1] + '%';
                }
            }, 300);
        });
    }, 500);
}

/**
 * Carrega projetos do GitHub
 */
async function loadProjects() {
    const loadingElement = document.getElementById('loading');
    const projectList = document.getElementById('my-project-list');
    
    if (!projectList || !loadingElement) {
        console.error('Elementos não encontrados');
        return;
    }
    
    try {
        loadingElement.textContent = '🔄 Conectando ao GitHub...';
        
        // Faz a requisição para a API do GitHub
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Não foi possível carregar projetos`);
        }
        
        const projects = await response.json();
        
        // Esconde o loading
        loadingElement.style.display = 'none';
        
        // Mostra os projetos
        displayProjects(projects);
        
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        
        loadingElement.innerHTML = `
            <div style="color: #ff6b6b; padding: 1rem;">
                <p>⚠️ Erro ao carregar projetos do GitHub</p>
                <p style="font-size: 0.9rem; color: #888; margin-top: 0.5rem;">
                    ${error.message}
                </p>
                <button onclick="retryLoad()" class="btn" style="margin-top: 1rem;">
                    🔄 Tentar novamente
                </button>
            </div>
        `;
    }
}

/**
 * Exibe os projetos na página
 */
function displayProjects(projects) {
    const projectList = document.getElementById('my-project-list');
    
    if (!projectList) return;
    
    // Limpa o conteúdo
    projectList.innerHTML = '';
    
    // Filtra projetos (remove forks)
    const filteredProjects = projects
        .filter(project => !project.fork && !project.archived)
        .slice(0, 6); // Limita a 6 projetos
    
    if (filteredProjects.length === 0) {
        projectList.innerHTML = `
            <div class="project-card">
                <h3>📭 Nenhum projeto encontrado</h3>
                <p>Os projetos serão exibidos aqui quando estiverem no GitHub.</p>
            </div>
        `;
        return;
    }
    
    // Cria um card para cada projeto
    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectList.appendChild(projectCard);
    });
}

/**
 * Cria um card de projeto
 */
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Formata a data
    const updatedDate = new Date(project.updated_at);
    const formattedDate = updatedDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'Projeto em desenvolvimento'}</p>
        
        <div class="project-tech">
            ${project.language ? `
                <span class="tech-tag">${project.language}</span>
            ` : ''}
            ${project.stargazers_count > 0 ? `
                <span class="tech-tag">⭐ ${project.stargazers_count}</span>
            ` : ''}
            ${project.forks_count > 0 ? `
                <span class="tech-tag">⑂ ${project.forks_count}</span>
            ` : ''}
        </div>
        
        <div class="project-links">
            <!-- LINK CORRETO PARA O GITHUB -->
            <a href="${project.html_url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="project-link">
                🔗 Ver no GitHub
            </a>
            
            ${project.homepage ? `
                <a href="${project.homepage}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="project-link">
                    🌐 Ver Demo
                </a>
            ` : ''}
        </div>
        
        <div style="margin-top: 1rem; font-size: 0.85rem; color: #888;">
            📅 Atualizado: ${formattedDate}
        </div>
    `;
    
    return card;
}

/**
 * Configura navegação suave
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calcula a posição considerando o header fixo
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Atualiza URL sem recarregar a página
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Função para tentar carregar novamente
 */
function retryLoad() {
    const loadingElement = document.getElementById('loading');
    const projectList = document.getElementById('my-project-list');
    
    if (loadingElement && projectList) {
        loadingElement.style.display = 'block';
        loadingElement.textContent = '🔄 Tentando novamente...';
        projectList.innerHTML = '';
        
        loadProjects();
    }
}

// Torna a função disponível globalmente
window.retryLoad = retryLoad;

/**
 * Função para testar se tudo está funcionando
 */
function testAll() {
    console.log('🧪 Testando funcionalidades...');
    
    // Testa se as barras estão visíveis
    const skillBars = document.querySelectorAll('.skill-level');
    console.log(`✅ ${skillBars.length} barras de skill encontradas`);
    
    // Testa se a API do GitHub responde
    fetch('https://api.github.com/users/Myllena-Santos')
        .then(response => {
            console.log(`✅ GitHub API: ${response.status} ${response.statusText}`);
        })
        .catch(error => {
            console.error('❌ GitHub API não respondeu:', error);
        });
}

// Executa teste após 3 segundos
setTimeout(testAll, 3000);

// Adiciona animação de entrada para os projetos
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .project-card {
        animation: fadeInUp 0.5s ease-out;
    }
    
    .project-card:nth-child(1) { animation-delay: 0.1s; }
    .project-card:nth-child(2) { animation-delay: 0.2s; }
    .project-card:nth-child(3) { animation-delay: 0.3s; }
    .project-card:nth-child(4) { animation-delay: 0.4s; }
    .project-card:nth-child(5) { animation-delay: 0.5s; }
    .project-card:nth-child(6) { animation-delay: 0.6s; }
`;
document.head.appendChild(animationStyle);