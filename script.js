// ===== GESTION DU THÈME =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// ===== NAVIGATION SMOOTH =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Gestion des liens de navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                }
            });
        });
    }

    scrollToElement(element) {
        const offsetTop = element.offsetTop - 100; // Compensation pour la navbar fixe
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===== GESTION DU SIDEBAR MOBILE =====
class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createToggleButton();
        this.bindEvents();
        this.handleResize();
    }

    createToggleButton() {
        // Créer le bouton hamburger seulement en mobile
        const button = document.createElement('button');
        button.innerHTML = '☰';
        button.className = 'sidebar-toggle';
        button.setAttribute('aria-label', 'Toggle menu');
        
        // Styles inline pour le bouton
        Object.assign(button.style, {
            display: 'none',
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: '1001',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(button);
        this.toggleButton = button;
    }

    bindEvents() {
        this.toggleButton.addEventListener('click', () => this.toggleSidebar());
        
        // Fermer le sidebar en cliquant sur un lien
        document.querySelectorAll('.table-of-contents a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    this.closeSidebar();
                }
            });
        });

        // Fermer le sidebar en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.sidebar.contains(e.target) && !this.toggleButton.contains(e.target)) {
                this.closeSidebar();
            }
        });

        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        this.isOpen ? this.closeSidebar() : this.openSidebar();
    }

    openSidebar() {
        this.sidebar.style.transform = 'translateX(0)';
        this.isOpen = true;
        this.toggleButton.innerHTML = '✕';
    }

    closeSidebar() {
        this.sidebar.style.transform = 'translateX(-100%)';
        this.isOpen = false;
        this.toggleButton.innerHTML = '☰';
    }

    handleResize() {
        if (window.innerWidth <= 1024) {
            this.toggleButton.style.display = 'block';
            if (!this.isOpen) {
                this.sidebar.style.transform = 'translateX(-100%)';
            }
        } else {
            this.toggleButton.style.display = 'none';
            this.sidebar.style.transform = 'translateX(0)';
            this.isOpen = false;
        }
    }
}

// ===== HIGHLIGHTING DU MENU ACTIF =====
class ActiveMenuHighlighter {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.menuLinks = document.querySelectorAll('.table-of-contents a');
        this.fileSections = document.querySelectorAll('.file-section');
        this.init();
    }

    init() {
        this.bindScrollEvent();
        this.highlightCurrentSection();
    }

    bindScrollEvent() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.highlightCurrentSection();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    highlightCurrentSection() {
        const scrollPosition = window.scrollY + 150;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                this.updateActiveLink(index);
                this.updateActiveFileSection(index);
            }
        });
    }

    updateActiveLink(activeIndex) {
        this.menuLinks.forEach((link, index) => {
            if (index === activeIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
                // Réinitialise les styles inline pour le hover
                link.style.color = '';
                link.style.background = '';
                link.style.fontWeight = '';
            }
        });
    }

    updateActiveFileSection(activeIndex) {
        // Détermine quelle section de fichier doit être active
        // Étapes 1-3 (index 0-2) = première section (Setup & Configuration)
        // Étapes 4-7 (index 3-6) = deuxième section (Développement de base)
        // Étapes 8-9 (index 7-8) = troisième section (Gestion des données)
        // Étapes 10-14 (index 9-13) = quatrième section (Formulaires)
        // Étapes 15-18 (index 14-17) = cinquième section (Relations entre entités)
        // Étapes 19-23 (index 18-22) = sixième section (Sécurité)
        // Étapes 24-28 (index 23-27) = septième section (Services & API)
        let activeSectionIndex = 0;
        if (activeIndex < 3) {
            activeSectionIndex = 0; // Setup & Configuration
        } else if (activeIndex < 7) {
            activeSectionIndex = 1; // Développement de base
        } else if (activeIndex < 9) {
            activeSectionIndex = 2; // Gestion des données
        } else if (activeIndex < 14) {
            activeSectionIndex = 3; // Formulaires
        } else if (activeIndex < 18) {
            activeSectionIndex = 4; // Relations entre entités
        } else if (activeIndex < 23) {
            activeSectionIndex = 5; // Sécurité
        } else {
            activeSectionIndex = 6; // Services & API
        }
        
        // Utiliser le gestionnaire de table des matières pour une gestion dynamique
        if (window.tocManager) {
            window.tocManager.setActiveSection(activeSectionIndex);
        } else {
            // Fallback vers l'ancienne méthode
            this.fileSections.forEach((fileSection, index) => {
                if (index === activeSectionIndex) {
                    fileSection.classList.add('active');
                } else {
                    fileSection.classList.remove('active');
                }
            });
        }
    }
}

// ===== GESTION DES ANIMATIONS =====
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
        this.addCardHoverEffects();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    addCardHoverEffects() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// ===== COPIE DE CODE =====
class CodeCopyManager {
    constructor() {
        this.init();
    }

    init() {
        this.addCopyButtons();
    }

    addCopyButtons() {
        document.querySelectorAll('pre').forEach(pre => {
            const button = document.createElement('button');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copier</span>
            `;
            button.className = 'copy-btn';
            
            Object.assign(button.style, {
                position: 'absolute',
                top: '40px',
                right: '15px',
                background: 'var(--text-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem 0.8rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                opacity: '0',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '500',
                zIndex: '10',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            });

            pre.style.position = 'relative';
            pre.appendChild(button);

            pre.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(-2px)';
            });

            pre.addEventListener('mouseleave', () => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(0)';
            });

            button.addEventListener('click', () => {
                const code = pre.querySelector('code');
                if (code) {
                    navigator.clipboard.writeText(code.textContent).then(() => {
                        button.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                            <span>Copié!</span>
                        `;
                        button.style.background = '#22c55e';
                        
                        setTimeout(() => {
                            button.innerHTML = `
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                <span>Copier</span>
                            `;
                            button.style.background = 'var(--text-accent)';
                        }, 2000);
                    }).catch(() => {
                        button.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                            <span>Erreur</span>
                        `;
                        button.style.background = '#ef4444';
                        
                        setTimeout(() => {
                            button.innerHTML = `
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                <span>Copier</span>
                            `;
                            button.style.background = 'var(--text-accent)';
                        }, 2000);
                    });
                }
            });
        });
    }
}

// ===== INDICATEUR DE PROGRESSION =====
class ProgressIndicator {
    constructor() {
        this.createProgressBar();
        this.init();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        Object.assign(progressBar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0%',
            height: '3px',
            background: 'linear-gradient(90deg, var(--text-accent), #66b3ff)',
            zIndex: '9999',
            transition: 'width 0.3s ease'
        });

        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }

    init() {
        window.addEventListener('scroll', () => {
            this.updateProgress();
        });
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        this.progressBar.style.width = scrollPercent + '%';
    }
}

// ===== RECHERCHE RAPIDE =====
class QuickSearch {
    constructor() {
        this.createSearchBox();
        this.init();
    }

    createSearchBox() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher...';
        searchInput.className = 'search-input';
        searchInput.id = 'search-input';
        
        // Créer le bouton de croix pour effacer
        const clearButton = document.createElement('button');
        clearButton.className = 'search-clear';
        clearButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        clearButton.title = 'Effacer la recherche';
        clearButton.type = 'button';
        clearButton.style.display = 'none'; // Caché par défaut
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearButton);
        
        // Insérer dans le nav-container entre le brand et les controls
        const navContainer = document.querySelector('.nav-container');
        const navControls = document.querySelector('.nav-controls');
        navContainer.insertBefore(searchContainer, navControls);
        
        this.searchInput = searchInput;
        this.clearButton = clearButton;
        
        // Événement pour la croix
        clearButton.addEventListener('click', () => {
            this.clearSearch();
        });
        
        // Afficher/masquer la croix selon le contenu
        searchInput.addEventListener('input', () => {
            clearButton.style.display = searchInput.value.length > 0 ? 'block' : 'none';
        });
    }

    init() {
        this.searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
    }

    performSearch(query) {
        const sections = document.querySelectorAll('.section');
        
        if (!query.trim()) {
            sections.forEach(section => {
                section.style.display = 'block';
            });
            return;
        }

        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const matches = text.includes(query.toLowerCase());
            section.style.display = matches ? 'block' : 'none';
        });
    }

    clearSearch() {
        this.searchInput.value = '';
        this.clearButton.style.display = 'none';
        this.performSearch(''); // Réafficher toutes les sections
        this.searchInput.focus(); // Remettre le focus sur le champ
    }
}

// ===== GESTION SIMPLE DE LA TABLE DES MATIÈRES =====
class TableOfContentsManager {
    constructor() {
        this.fileSections = document.querySelectorAll('.file-section');
        this.init();
    }

    init() {
        // Simple: laisser le CSS gérer l'affichage au survol
        console.log('Table des matières initialisée - Gestion par CSS');
    }

    // Méthode pour maintenir une section ouverte
    setActiveSection(sectionIndex) {
        this.fileSections.forEach((section, index) => {
            if (index === sectionIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
}

// ===== COLORISATION DES LABELS DE CODE =====
class CodeLabelColorizer {
    constructor() {
        this.colorMap = {
            'PHP': '#8892be',
            'Terminal': 'var(--text-accent)',
            'Bash': 'var(--text-accent)',
            'Twig': '#22c55e',
            'HTML': '#e34c26',
            'YAML': '#f59e0b',
            'YML': '#f59e0b',
            'JavaScript': '#8b5cf6',
            'JS': '#8b5cf6',
            'JSON': '#0ea5e9',
            'CSS': '#2563eb',
            'SQL': '#db2777',
            'Config': '#f59e0b'
        };
        this.init();
    }

    init() {
        this.colorizeLabels();
        // Observer pour les nouveaux éléments
        this.observeNewElements();
    }

    colorizeLabels() {
        const labels = document.querySelectorAll('.code-label');
        labels.forEach(label => {
            const text = label.textContent.trim();
            const color = this.colorMap[text];
            if (color) {
                if (color.startsWith('var(')) {
                    // Utiliser les propriétés CSS custom
                    label.style.color = color;
                } else {
                    label.style.color = color;
                }
            }
        });
    }

    observeNewElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const labels = node.querySelectorAll ? node.querySelectorAll('.code-label') : [];
                            if (labels.length > 0) {
                                this.colorizeLabels();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser tous les modules
    const themeManager = new ThemeManager();
    const smoothScroll = new SmoothScroll();
    const sidebarManager = new SidebarManager();
    const activeMenuHighlighter = new ActiveMenuHighlighter();
    const tocManager = new TableOfContentsManager(); // Nouveau gestionnaire
    window.tocManager = tocManager; // Rendre accessible globalement
    const animationManager = new AnimationManager();
    const codeCopyManager = new CodeCopyManager();
    const progressIndicator = new ProgressIndicator();
    const quickSearch = new QuickSearch();
    const codeLabelColorizer = new CodeLabelColorizer();

    // Message de bienvenue dans la console
    console.log(`
    🚀 Guide Symfony chargé avec succès!
    
    Fonctionnalités disponibles:
    • 🌙 Thème sombre/clair
    • 📱 Design responsive
    • 🔍 Recherche rapide
    • 📋 Copie de code
    • 📊 Indicateur de progression
    • 🎯 Navigation active
    
    Bon apprentissage! 😊
    `);

    // Animation d'entrée pour le titre principal
    const mainTitle = document.querySelector('.page-header h1');
    if (mainTitle) {
        mainTitle.style.opacity = '0';
        mainTitle.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            mainTitle.style.transition = 'all 0.8s ease';
            mainTitle.style.opacity = '1';
            mainTitle.style.transform = 'translateY(0)';
        }, 100);
    }
});

// ===== GESTION DES ERREURS =====
window.addEventListener('error', (e) => {
    console.error('Erreur détectée:', e.error);
});

// ===== PERFORMANCE =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // On peut ajouter un service worker plus tard si nécessaire
        console.log('Service Worker support détecté');
    });
}
