// Tienda Yenys - Utilidades Comunes

// === GESTIÓN DE DATOS ===

// Hash simple para contraseñas (SHA-256 simulado con crypto API del navegador)
async function hashPassword(password) {
  // Para compatibilidad con usuarios existentes, usamos un hash simple
  // En producción real, esto debería estar en el backend
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback simple si crypto.subtle no está disponible
    return btoa(password); // Base64 como fallback
  }
}

// Verificar contraseña hasheada
async function verifyPassword(password, hashedPassword) {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Inicializar datos si no existen
function initializeData() {
  if (!localStorage.getItem('users')) {
    const users = [
      {
        id: 1,
        name: 'Empleado Demo',
        email: 'empleado@yenys.com',
        password: 'admin123', // En la primera carga, usar texto plano (será hasheado al login)
        role: 'empleado'
      },
      {
        id: 2,
        name: 'Cliente Demo',
        email: 'cliente@yenys.com',
        password: '123456', // En la primera carga, usar texto plano (será hasheado al login)
        role: 'cliente'
      }
    ];
    localStorage.setItem('users', JSON.stringify(users));
  }

  if (!localStorage.getItem('products')) {
    const products = [
      { id: 1, name: 'Oso de Peluche Grande', category: 'peluches', price: 45.99, stock: 25, image: 'peluche1', description: 'Oso de peluche suave de 50cm', rating: 4.8 },
      { id: 2, name: 'Muñeca Interactiva', category: 'muñecas', price: 89.99, stock: 15, image: 'muneca1', description: 'Muñeca con sonidos y movimientos', rating: 4.6 },
      { id: 3, name: 'Carrito de Control Remoto', category: 'carros', price: 125.00, stock: 8, image: 'carro1', description: 'Carro RC de alta velocidad', rating: 4.9 },
      { id: 4, name: 'Bloques de Construcción', category: 'educativos', price: 35.50, stock: 40, image: 'educativo1', description: 'Set de 200 bloques de colores', rating: 4.7 },
      { id: 5, name: 'Robot Transformable', category: 'accion', price: 78.00, stock: 12, image: 'accion1', description: 'Robot que se transforma en vehículo', rating: 4.5 },
      { id: 6, name: 'Peluche de Unicornio', category: 'peluches', price: 52.99, stock: 30, image: 'peluche2', description: 'Unicornio luminoso de 40cm', rating: 4.9 },
      { id: 7, name: 'Casa de Muñecas', category: 'muñecas', price: 199.99, stock: 5, image: 'muneca2', description: 'Casa de 3 pisos con muebles', rating: 4.8 },
      { id: 8, name: 'Pista de Carreras', category: 'carros', price: 145.00, stock: 10, image: 'carro2', description: 'Pista doble con 2 carros', rating: 4.7 },
      { id: 9, name: 'Rompecabezas Educativo', category: 'educativos', price: 28.50, stock: 50, image: 'educativo2', description: 'Puzzle de 500 piezas didáctico', rating: 4.6 },
      { id: 10, name: 'Figura de Acción Superhéroe', category: 'accion', price: 65.00, stock: 20, image: 'accion2', description: 'Figura articulada de 30cm', rating: 4.8 },
      { id: 11, name: 'Conejo de Peluche', category: 'peluches', price: 38.99, stock: 35, image: 'peluche3', description: 'Conejo suave con lazo', rating: 4.5 },
      { id: 12, name: 'Muñeca Bebé Realista', category: 'muñecas', price: 110.00, stock: 8, image: 'muneca3', description: 'Bebé realista con accesorios', rating: 4.9 },
      { id: 13, name: 'Monster Truck', category: 'carros', price: 95.00, stock: 15, image: 'carro3', description: 'Camioneta todoterreno gigante', rating: 4.7 },
      { id: 14, name: 'Microscopio Infantil', category: 'educativos', price: 72.00, stock: 12, image: 'educativo3', description: 'Microscopio con accesorios', rating: 4.6 },
      { id: 15, name: 'Set de Figuras Guerreros', category: 'accion', price: 88.00, stock: 18, image: 'accion3', description: 'Pack de 5 figuras articuladas', rating: 4.8 },
      { id: 16, name: 'Dinosaurio de Peluche', category: 'peluches', price: 48.00, stock: 22, image: 'peluche4', description: 'T-Rex suave de 45cm', rating: 4.7 },
      { id: 17, name: 'Set de Cocina de Juguete', category: 'educativos', price: 120.00, stock: 10, image: 'educativo4', description: 'Cocina completa con accesorios', rating: 4.9 },
      { id: 18, name: 'Drone para Niños', category: 'carros', price: 159.99, stock: 6, image: 'carro4', description: 'Drone fácil de pilotar', rating: 4.5 }
    ];
    localStorage.setItem('products', JSON.stringify(products));
  }

  if (!localStorage.getItem('reviews')) {
    const reviews = [
      { id: 1, productId: 1, userName: 'María García', email: 'maria@email.com', rating: 5, comment: 'Excelente calidad, mi hija lo adora', date: '2025-10-15' },
      { id: 2, productId: 3, userName: 'Carlos Pérez', email: 'carlos@email.com', rating: 5, comment: 'El carrito es increíble, muy rápido y resistente', date: '2025-10-20' },
      { id: 3, productId: 6, userName: 'Ana Martínez', email: 'ana@email.com', rating: 5, comment: 'El unicornio brilla hermoso en la noche', date: '2025-10-25' },
      { id: 4, productId: 2, userName: 'Luis Rodríguez', email: 'luis@email.com', rating: 4, comment: 'Buena muñeca, aunque la batería dura poco', date: '2025-10-28' },
      { id: 5, productId: 7, userName: 'Patricia López', email: 'patricia@email.com', rating: 5, comment: 'La casa más linda, viene con todo', date: '2025-10-30' },
      { id: 6, productId: 4, userName: 'Jorge Sánchez', email: 'jorge@email.com', rating: 5, comment: 'Bloques de excelente calidad educativa', date: '2025-11-01' },
      { id: 7, productId: 10, userName: 'Sofía Torres', email: 'sofia@email.com', rating: 5, comment: 'La figura es detallada y muy articulada', date: '2025-11-02' }
    ];
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }

  if (!localStorage.getItem('sales')) {
    const sales = [
      { id: 1, date: '2025-10-01', products: [{id: 1, quantity: 5}], total: 229.95, userId: 2 },
      { id: 2, date: '2025-10-05', products: [{id: 3, quantity: 2}], total: 250.00, userId: 2 },
      { id: 3, date: '2025-10-10', products: [{id: 6, quantity: 3}], total: 158.97, userId: 2 },
      { id: 4, date: '2025-10-15', products: [{id: 7, quantity: 1}], total: 199.99, userId: 2 },
      { id: 5, date: '2025-10-20', products: [{id: 4, quantity: 10}], total: 355.00, userId: 2 },
      { id: 6, date: '2025-10-25', products: [{id: 2, quantity: 4}], total: 359.96, userId: 2 },
      { id: 7, date: '2025-10-28', products: [{id: 10, quantity: 6}], total: 390.00, userId: 2 },
      { id: 8, date: '2025-11-01', products: [{id: 5, quantity: 3}], total: 234.00, userId: 2 }
    ];
    localStorage.setItem('sales', JSON.stringify(sales));
  }

  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

// === VALIDACIONES ===

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// === FORMATEO ===

function formatPrice(price) {
  return `S/ ${price.toFixed(2)}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

// === NOTIFICACIONES ===

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#DC2626' : '#8B5CF6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// === GESTIÓN DE SESIÓN ===

function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    let op = confirm('Deseas salir');
    if(!op) return;
    showNotification("Deseando salir...", "success");
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

function checkAuth(requiredRole = null) {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = 'yenys-store/index.html';
    return false;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    showNotification('No tienes permiso para acceder a esta página', 'error');
    setTimeout(() => {
      window.location.href = user.role === 'empleado' ? '/dashboard-empleado.html' : '/dashboard-cliente.html';
    }, 1500);
    return false;
  }
  
  return user;
}

// === CARRITO ===

function getCart() {
  const cartStr = localStorage.getItem('cart');
  return cartStr ? JSON.parse(cartStr) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    showNotification('Producto no encontrado', 'error');
    return;
  }
  
  const cart = getCart();
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
      showNotification('Cantidad actualizada en el carrito', 'success');
    } else {
      showNotification('Stock insuficiente', 'error');
      return;
    }
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    showNotification('Producto añadido al carrito', 'success');
  }
  
  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.productId !== productId);
  saveCart(cart);
  showNotification('Producto eliminado del carrito', 'success');
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.productId === productId);
  
  if (item) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (quantity <= 0) {
      removeFromCart(productId);
    } else if (quantity <= product.stock) {
      item.quantity = quantity;
      saveCart(cart);
    } else {
      showNotification('Stock insuficiente', 'error');
    }
  }
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    if (totalItems === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = 'flex';
    }
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// === GESTIÓN DE STOCK ===

// Validar que hay stock suficiente para todos los productos del carrito
function validateCartStock(cart) {
  const products = getProducts();
  
  for (const item of cart) {
    const product = products.find(p => p.id === item.productId);
    
    if (!product) {
      return {
        valid: false,
        product: item.name,
        available: 0
      };
    }
    
    if (product.stock < item.quantity) {
      return {
        valid: false,
        product: product.name,
        available: product.stock
      };
    }
  }
  
  return { valid: true };
}

// Actualizar stock de productos después de una venta
function updateProductStock(cart) {
  try {
    const products = getProducts();
    let updated = false;
    
    // Reducir stock de cada producto vendido
    cart.forEach(item => {
      const productIndex = products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        products[productIndex].stock -= item.quantity;
        
        // Asegurar que el stock no sea negativo
        if (products[productIndex].stock < 0) {
          products[productIndex].stock = 0;
        }
        
        updated = true;
      }
    });
    
    if (updated) {
      localStorage.setItem('products', JSON.stringify(products));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return false;
  }
}

// === PRODUCTOS ===

function getProducts() {
  const productsStr = localStorage.getItem('products');
  return productsStr ? JSON.parse(productsStr) : [];
}

function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id);
}

function searchProducts(query) {
  const products = getProducts();
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}

function filterProductsByCategory(category) {
  const products = getProducts();
  if (!category || category === 'todos') {
    return products;
  }
  return products.filter(p => p.category === category);
}

// === ESTRELLAS DE RATING ===

function renderStars(rating, size = 16) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let html = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      html += `<span style="color: #D97706; font-size: ${size}px;">★</span>`;
    } else if (i === fullStars && hasHalfStar) {
      html += `<span style="color: #D97706; font-size: ${size}px;">★</span>`;
    } else {
      html += `<span style="color: #E5E5E5; font-size: ${size}px;">★</span>`;
    }
  }
  
  return html;
}

// === PLACEHOLDER DE IMAGEN ===

function getProductPlaceholder(imageId, productName) {
  // Crear SVG de placeholder con gradiente
  const gradients = [
    'linear-gradient(135deg, #8B5CF6 0%, #FF1744 100%)',
    'linear-gradient(135deg, #FF1744 0%, #00E5CC 100%)',
    'linear-gradient(135deg, #00E5CC 0%, #A855F7 100%)',
    'linear-gradient(135deg, #C084FC 0%, #F97316 100%)'
  ];
  
  const gradient = gradients[parseInt(imageId.replace(/\D/g, '') || 0) % gradients.length];
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${imageId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF1744;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad${imageId})"/>
      <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">${productName.substring(0, 15)}</text>
    </svg>
  `)}`;
}

// === INICIALIZACIÓN ===

// Inicializar datos al cargar
document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  updateCartBadge();
});
