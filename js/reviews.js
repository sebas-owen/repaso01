// Tienda Yenys - Sistema de Reseñas

// === RENDERIZADO DE RESEÑAS ===

function renderReviews(reviews) {
  const container = document.getElementById('reviews-grid');
  if (!container) return;
  
  if (reviews.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--neutral-600); padding: var(--space-12);">No hay reseñas aún</p>';
    return;
  }
  
  container.innerHTML = reviews.map(review => {
    const initials = review.userName.split(' ').map(n => n[0]).join('').substring(0, 2);
    const product = getProductById(review.productId);
    
    return `
      <div class="card" style="padding: var(--space-6);">
        <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: var(--radius-full);
            background: var(--gradient-accent);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--neutral-white);
            font-weight: 700;
            font-size: 18px;
          ">${initials}</div>
          
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">${review.userName}</div>
            <div style="font-size: 14px; color: var(--neutral-600);">${formatDate(review.date)}</div>
          </div>
          
          <div>
            ${renderStars(review.rating, 18)}
          </div>
        </div>
        
        ${product ? `
          <div style="padding: var(--space-2) var(--space-3); background: var(--neutral-50); border-radius: var(--radius-sm); margin-bottom: var(--space-4); font-size: 14px;">
            Producto: <strong>${product.name}</strong>
          </div>
        ` : ''}
        
        <p style="color: var(--neutral-900); line-height: 1.6;">${review.comment}</p>
      </div>
    `;
  }).join('');
}

// === FILTRADO DE RESEÑAS ===

let currentRatingFilter = 'todas';

function filterReviews(rating) {
  currentRatingFilter = rating;
  
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  let filtered = reviews;
  
  if (rating !== 'todas') {
    filtered = reviews.filter(r => r.rating === parseInt(rating));
  }
  
  // Ordenar por fecha descendente
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  renderReviews(filtered);
  
  // Actualizar tabs activos
  document.querySelectorAll('.rating-filter').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-rating="${rating}"]`)?.classList.add('active');
}

// === ESTADÍSTICAS DE RATING ===

function renderRatingStats() {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  const container = document.getElementById('rating-stats');
  
  if (!container) return;
  
  if (reviews.length === 0) {
    container.innerHTML = '<p style="color: var(--neutral-600);">No hay reseñas aún</p>';
    return;
  }
  
  // Calcular promedio
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  // Contar por estrellas
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => distribution[r.rating]++);
  
  const maxCount = Math.max(...Object.values(distribution));
  
  container.innerHTML = `
    <div style="text-align: center; margin-bottom: var(--space-8);">
      <div style="font-size: 48px; font-weight: 700; color: var(--primary-700); margin-bottom: var(--space-2);">
        ${average.toFixed(1)}
      </div>
      <div style="margin-bottom: var(--space-2);">
        ${renderStars(average, 24)}
      </div>
      <div style="font-size: 14px; color: var(--neutral-600);">
        Basado en ${reviews.length} reseñas
      </div>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: var(--space-3);">
      ${[5, 4, 3, 2, 1].map(stars => {
        const count = distribution[stars];
        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        return `
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <span style="min-width: 60px; font-size: 14px; color: var(--neutral-600);">${stars} ${renderStars(stars, 12)}</span>
            <div style="flex: 1; height: 8px; background: var(--neutral-100); border-radius: var(--radius-full); overflow: hidden;">
              <div style="height: 100%; width: ${percentage}%; background: var(--gradient-accent); transition: width 0.5s;"></div>
            </div>
            <span style="min-width: 30px; font-size: 14px; font-weight: 600; color: var(--neutral-900);">${count}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// === FILTROS DE RATING ===

function renderRatingFilters() {
  const container = document.getElementById('rating-filters');
  if (!container) return;
  
  const filters = [
    { value: 'todas', label: 'Todas' },
    { value: '5', label: '5 Estrellas' },
    { value: '4', label: '4 Estrellas' },
    { value: '3', label: '3 Estrellas' },
    { value: '2', label: '2 Estrellas' },
    { value: '1', label: '1 Estrella' }
  ];
  
  container.innerHTML = filters.map(filter => `
    <button 
      class="rating-filter ${filter.value === 'todas' ? 'active' : ''}" 
      data-rating="${filter.value}"
      onclick="filterReviews('${filter.value}')"
      style="
        padding: var(--space-3) var(--space-4);
        border: 2px solid var(--neutral-200);
        background: var(--neutral-white);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 600;
        transition: all var(--duration-fast);
        font-size: 14px;
      "
    >${filter.label}</button>
  `).join('');
  
  // Estilo de activo
  const style = document.createElement('style');
  style.textContent = `
    .rating-filter.active {
      border-color: var(--primary-600) !important;
      background: var(--primary-600) !important;
      color: var(--neutral-white) !important;
    }
    .rating-filter:hover:not(.active) {
      border-color: var(--primary-600);
      background: var(--primary-50);
    }
  `;
  document.head.appendChild(style);
}

// === CREAR NUEVA RESEÑA ===

function handleReviewSubmit(event) {
  event.preventDefault();
  
  const userName = document.getElementById('review-name').value.trim();
  const email = document.getElementById('review-email').value.trim();
  const rating = parseInt(document.getElementById('review-rating').value);
  const comment = document.getElementById('review-comment').value.trim();
  
  // Validaciones
  if (!userName || !email || !rating || !comment) {
    showNotification('Todos los campos son obligatorios', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    showNotification('Email inválido', 'error');
    return;
  }
  
  if (comment.length < 10) {
    showNotification('El comentario debe tener al menos 10 caracteres', 'error');
    return;
  }
  
  // Crear nueva reseña
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  
  const newReview = {
    id: reviews.length + 1,
    productId: null, // Reseña general
    userName,
    email,
    rating,
    comment,
    date: new Date().toISOString().split('T')[0]
  };
  
  reviews.push(newReview);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  
  showNotification('Reseña publicada con éxito', 'success');
  
  // Reset formulario
  event.target.reset();
  
  // Actualizar vista
  filterReviews(currentRatingFilter);
  renderRatingStats();
}

// === RESEÑAS DESTACADAS ===

function renderFeaturedReviews() {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  const featured = reviews
    .filter(r => r.rating === 5)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  const container = document.getElementById('featured-reviews');
  if (!container) return;
  
  if (featured.length === 0) {
    container.innerHTML = '<p style="color: var(--neutral-600);">No hay reseñas destacadas aún</p>';
    return;
  }
  
  container.innerHTML = featured.map(review => {
    const initials = review.userName.split(' ').map(n => n[0]).join('').substring(0, 2);
    
    return `
      <div class="card" style="padding: var(--space-6); background: var(--gradient-hero); color: var(--neutral-white);">
        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
          <div style="
            width: 40px;
            height: 40px;
            border-radius: var(--radius-full);
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          ">${initials}</div>
          
          <div>
            <div style="font-weight: 600;">${review.userName}</div>
            <div style="font-size: 14px; opacity: 0.9;">${formatDate(review.date)}</div>
          </div>
        </div>
        
        <div style="margin-bottom: var(--space-3);">
          ${renderStars(5, 16)}
        </div>
        
        <p style="line-height: 1.6; opacity: 0.95;">${review.comment}</p>
      </div>
    `;
  }).join('');
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
  // Página de reseñas
  if (document.getElementById('reviews-grid')) {
    renderRatingFilters();
    filterReviews('todas');
    renderRatingStats();
    renderFeaturedReviews();
    
    // Configurar formulario
    const form = document.getElementById('review-form');
    if (form) {
      form.addEventListener('submit', handleReviewSubmit);
    }
  }
});
