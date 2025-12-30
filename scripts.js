/**
 * Boxer Cut Protocol - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initSmoothScroll();
});

/**
 * Search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('search');
    
    if (!searchInput) return;
    
    const handleInput = debounce(function(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length < 2) {
            // Show all category cards
            document.querySelectorAll('.category-card').forEach(card => {
                card.style.display = '';
            });
            return;
        }
        
        // Filter category cards by title
        document.querySelectorAll('.category-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }, 200);
    
    searchInput.addEventListener('input', handleInput);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Format macro numbers
 */
function formatMacros(macros) {
    return `${macros.calories}kcal | ${macros.protein}g P | ${macros.fat}g F | ${macros.carbs}g C`;
}

/**
 * Calculate difficulty based on time
 */
function calculateDifficulty(prepTime, cookTime) {
    const totalTime = (prepTime || 0) + (cookTime || 0);
    
    if (totalTime < 20) return { level: 'Easy', color: '#10B981' };
    if (totalTime < 45) return { level: 'Medium', color: '#F59E0B' };
    return { level: 'Advanced', color: '#EF4444' };
}

/**
 * Format time duration
 */
function formatTime(minutes) {
    if (minutes < 60) return `${min} min`;
    
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    
    if (remaining === 0) return `${hours} hr`;
    return `${hours} hr ${remaining} min`;
}

/**
 * Share functionality
 */
function shareRecipe(recipe) {
    const shareData = {
        title: recipe.title,
        text: `Check out this ${recipe.cuisine} recipe: ${recipe.title}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        copyToClipboard(window.location.href);
        alert('Link copied to clipboard!');
    }
}

// Export for global use
window.BoxerCookbook = {
    copyToClipboard,
    formatMacros,
    calculateDifficulty,
    formatTime,
    shareRecipe,
    debounce
};
