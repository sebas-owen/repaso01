// Tienda Yenys - Gestión de Productos

// === RENDERIZADO DE PRODUCTOS ===

function renderProducts(products, container) {
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--neutral-600); padding: var(--space-12);">No se encontraron productos</p>';
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-card card">
      ${product.stock < 10 ? `
        <div class="stock-badge low">Solo ${product.stock} quedan</div>
      ` : product.id <= 6 ? `
        <div class="stock-badge">Nuevo</div>
      ` : ''}
      
      <img 
        src="${getProductPlaceholder(product.image, product.name)}" 
        alt="${product.name}"
        class="product-image"
      >
      
      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        
        <div class="product-rating">
          ${renderStars(product.rating, 16)}
          <span>(${Math.floor(Math.random() * 50 + 10)})</span>
        </div>
        
        <div class="product-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.id % 3 === 0 ? `
            <span class="price-original">${formatPrice(product.price * 1.3)}</span>
            <span class="discount-badge">-30%</span>
          ` : ''}
        </div>
        
        <button onclick="addToCart(${product.id})" class="btn btn-primary" style="width: 100%;">
          Añadir al Carrito
        </button>
      </div>
    </div>
  `).join('');
}

// === FILTRADO Y BÚSQUEDA ===

let currentCategory = 'todos';
let currentSearchQuery = '';

function filterProducts(category) {
  currentCategory = category;
  applyFilters();
  
  // Actualizar tabs activos
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
}

function handleSearch(event) {
  currentSearchQuery = event.target.value;
  applyFilters();
}

function applyFilters() {
  let products = getProducts();
  
  // Filtrar por categoría
  if (currentCategory !== 'todos') {
    products = products.filter(p => p.category === currentCategory);
  }
  
  // Filtrar por búsqueda
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }
  
  const container = document.getElementById('products-grid');
  renderProducts(products, container);
}

// === PRODUCTOS DESTACADOS ===

function renderFeaturedProducts(limit = 4) {
  const products = getProducts();
  const featured = products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
  
  const container = document.getElementById('featured-products');
  renderProducts(featured, container);
}

// === OFERTAS ===

function renderOffersProducts() {
  const products = getProducts();
  const offers = products.filter(p => p.id % 3 === 0); // Simular ofertas
  
  const container = document.getElementById('offers-grid');
  renderProducts(offers, container);
}

// === CATEGORÍAS ===

function renderCategories() {
  const categories = [
    { id: 'todos', name: 'Todos', icon: '🎯' },
    { id: 'peluches', name: 'Peluches', icon: '🧸' },
    { id: 'muñecas', name: 'Muñecas', icon: '👧' },
    { id: 'carros', name: 'Carros', icon: '🚗' },
    { id: 'educativos', name: 'Educativos', icon: '📚' },
    { id: 'accion', name: 'Acción', icon: '🦸' }
  ];
  
  const container = document.getElementById('category-tabs');
  if (!container) return;
  
  container.innerHTML = categories.map(cat => `
    <button 
      class="category-tab ${cat.id === 'todos' ? 'active' : ''}" 
      data-category="${cat.id}"
      onclick="filterProducts('${cat.id}')"
      style="
        padding: var(--space-3) var(--space-6);
        border: 2px solid var(--neutral-200);
        background: var(--neutral-white);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 600;
        transition: all var(--duration-fast);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      "
    >
      <span style="font-size: 20px;">${cat.icon}</span>
      ${cat.name}
    </button>
  `).join('');
  
  // Añadir estilos de hover dinámicamente
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.style.borderColor = 'var(--primary-600)';
        this.style.background = 'var(--primary-50)';
      }
    });
    tab.addEventListener('mouseleave', function() {
      if (!this.classList.contains('active')) {
        this.style.borderColor = 'var(--neutral-200)';
        this.style.background = 'var(--neutral-white)';
      }
    });
  });
  
  // Estilo de activo
  const style = document.createElement('style');
  style.textContent = `
    .category-tab.active {
      border-color: var(--primary-600) !important;
      background: var(--primary-600) !important;
      color: var(--neutral-white) !important;
    }
  `;
  document.head.appendChild(style);
}

// === TOP PRODUCTOS (Dashboard Empleado) ===

function renderTopProducts() {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  const products = getProducts();
  
  // Contar ventas por producto
  const productSales = {};
  sales.forEach(sale => {
    sale.products.forEach(item => {
      productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
    });
  });
  
  // Ordenar por ventas
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, quantity]) => {
      const product = products.find(p => p.id === parseInt(id));
      return { ...product, soldQuantity: quantity };
    });
  
  const container = document.getElementById('top-products');
  if (!container) return;
  
  if (topProducts.length === 0) {
    container.innerHTML = '<p style="color: var(--neutral-600);">No hay datos de ventas aún</p>';
    return;
  }
  
  container.innerHTML = topProducts.map((product, index) => `
    <div class="card" style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); margin-bottom: var(--space-3);">
      <div style="font-size: 24px; font-weight: 700; color: var(--neutral-200); min-width: 30px;">#${index + 1}</div>
      <img 
        src="${getProductPlaceholder(product.image, product.name)}" 
        alt="${product.name}"
        style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-md);"
      >
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">${product.name}</div>
        <div style="font-size: 14px; color: var(--neutral-600);">Vendidos: ${product.soldQuantity} unidades</div>
      </div>
      <div style="font-size: 18px; font-weight: 700; color: var(--primary-700);">${formatPrice(product.price * product.soldQuantity)}</div>
    </div>
  `).join('');
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
  // Renderizar según la página
  if (document.getElementById('products-grid')) {
    renderCategories();
    applyFilters();
    
    // Configurar búsqueda
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    }
  }
  
  if (document.getElementById('featured-products')) {
    renderFeaturedProducts();
  }
  
  if (document.getElementById('offers-grid')) {
    renderOffersProducts();
  }
  
  if (document.getElementById('top-products')) {
    renderTopProducts();
  }
});
