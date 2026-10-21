// Tienda Yenys - Gestión de Carrito

// === RENDERIZADO DEL CARRITO ===

function renderCart() {
  const cart = getCart();
  const cartContainer = document.getElementById('cart-items');
  const emptyMessage = document.getElementById('empty-cart-message');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    if (emptyMessage) emptyMessage.classList.remove('hidden');
    if (cartSummary) cartSummary.classList.add('hidden');
    cartContainer.innerHTML = '';
    return;
  }
  
  if (emptyMessage) emptyMessage.classList.add('hidden');
  if (cartSummary) cartSummary.classList.remove('hidden');
  
  const products = getProducts();
  
  cartContainer.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    const subtotal = item.price * item.quantity;
    
    return `
      <div class="cart-item card" style="padding: var(--space-4); margin-bottom: var(--space-4);">
        <div style="display: grid; grid-template-columns: 100px 1fr auto; gap: var(--space-4); align-items: center;">
          <img 
            src="${getProductPlaceholder(item.image, item.name)}" 
            alt="${item.name}"
            style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-md);"
          >
          
          <div>
            <h4 style="margin-bottom: var(--space-2);">${item.name}</h4>
            <p style="color: var(--neutral-600); font-size: 14px;">Precio unitario: ${formatPrice(item.price)}</p>
            <p style="color: var(--primary-700); font-weight: 600; margin-top: var(--space-2);">Subtotal: ${formatPrice(subtotal)}</p>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: var(--space-3); align-items: flex-end;">
            <div style="display: flex; align-items: center; gap: var(--space-2); background: var(--neutral-100); border-radius: var(--radius-md); padding: var(--space-2);">
              <button 
                onclick="decrementQuantity(${item.productId})"
                style="width: 32px; height: 32px; border: none; background: var(--neutral-white); border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; color: var(--neutral-900);"
              >−</button>
              <span style="min-width: 40px; text-align: center; font-weight: 600;">${item.quantity}</span>
              <button 
                onclick="incrementQuantity(${item.productId})"
                style="width: 32px; height: 32px; border: none; background: var(--neutral-white); border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; color: var(--neutral-900);"
              >+</button>
            </div>
            <button 
              onclick="removeCartItem(${item.productId})"
              class="btn-outline"
              style="padding: 8px 16px; height: auto; min-width: auto; font-size: 14px; color: var(--error-red); border-color: var(--error-red);"
            >Eliminar</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  updateCartSummary();
}

// === GESTIÓN DE CANTIDAD ===

function incrementQuantity(productId) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    updateCartQuantity(productId, item.quantity + 1);
    renderCart();
  }
}

function decrementQuantity(productId) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    updateCartQuantity(productId, item.quantity - 1);
    renderCart();
  }
}

function removeCartItem(productId) {
  removeFromCart(productId);
  renderCart();
}

// === RESUMEN DEL CARRITO ===

function updateCartSummary() {
  const cart = getCart();
  const subtotal = getCartTotal();
  const shipping = subtotal > 200 ? 0 : 15; // Envío gratis sobre S/ 200
  const total = subtotal + shipping;
  
  const summaryContainer = document.getElementById('cart-summary');
  if (!summaryContainer) return;
  
  summaryContainer.innerHTML = `
    <div class="card" style="position: sticky; top: 120px;">
      <h3 style="margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid var(--neutral-200);">Resumen de Compra</h3>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6);">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--neutral-600);">Subtotal:</span>
          <span style="font-weight: 600;">${formatPrice(subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--neutral-600);">Envío:</span>
          <span style="font-weight: 600; color: ${shipping === 0 ? 'var(--success-green)' : 'inherit'};">
            ${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
          </span>
        </div>
        ${shipping > 0 ? `
          <div style="padding: var(--space-3); background: var(--primary-50); border-radius: var(--radius-md); font-size: 14px; color: var(--primary-900);">
            Añade ${formatPrice(200 - subtotal)} más para envío gratis
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; padding-top: var(--space-4); border-top: 2px solid var(--neutral-200); font-size: 20px; font-weight: 700;">
          <span>Total:</span>
          <span style="color: var(--vibrant-red);">${formatPrice(total)}</span>
        </div>
      </div>
      
      <button onclick="proceedToCheckout()" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-3);">
        Proceder al Pago
      </button>
      
      <a href="productos.html" class="btn btn-outline" style="width: 100%; text-align: center; display: flex; align-items: center; justify-content: center;">
        Seguir Comprando
      </a>
    </div>
  `;
}

// === CHECKOUT ===

function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showNotification('El carrito está vacío', 'error');
    return;
  }
  
  // Mostrar modal de pago
  showPaymentModal();
}

function showPaymentModal() {
  const modal = document.createElement('div');
  modal.id = 'payment-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: overlayFadeIn 0.3s ease-out;
  `;
  
  const total = getCartTotal() + (getCartTotal() > 200 ? 0 : 15);
  
  modal.innerHTML = `
    <div class="card" style="width: 90%; max-width: 500px; animation: fadeIn 0.3s ease-out;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid var(--neutral-200);">
        <h3>Método de Pago</h3>
        <button onclick="closePaymentModal()" style="width: 32px; height: 32px; border: none; background: var(--neutral-100); border-radius: var(--radius-sm); cursor: pointer; font-size: 20px;">×</button>
      </div>
      
      <div style="margin-bottom: var(--space-6);">
        <p style="font-size: 14px; color: var(--neutral-600); margin-bottom: var(--space-4);">Total a pagar: <strong style="color: var(--vibrant-red); font-size: 18px;">${formatPrice(total)}</strong></p>
        
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <label class="payment-option" style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4); border: 2px solid var(--neutral-200); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;">
            <input type="radio" name="payment-method" value="card" checked style="width: 20px; height: 20px;">
            <div>
              <div style="font-weight: 600; margin-bottom: 4px;">Tarjeta de Crédito/Débito</div>
              <div style="font-size: 12px; color: var(--neutral-600);">Visa, Mastercard, American Express</div>
            </div>
          </label>
          
          <label class="payment-option" style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4); border: 2px solid var(--neutral-200); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;">
            <input type="radio" name="payment-method" value="yape" style="width: 20px; height: 20px;">
            <div>
              <div style="font-weight: 600; margin-bottom: 4px;">Yape / Plin</div>
              <div style="font-size: 12px; color: var(--neutral-600);">Transferencia instantánea</div>
            </div>
          </label>
        </div>
      </div>
      
      <div style="display: flex; gap: var(--space-3);">
        <button onclick="closePaymentModal()" class="btn btn-outline" style="flex: 1;">Cancelar</button>
        <button onclick="completeOrder()" class="btn btn-primary" style="flex: 1;">Confirmar Pedido</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Estilo de hover para opciones de pago
  const paymentOptions = modal.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('mouseenter', () => {
      option.style.borderColor = 'var(--primary-600)';
      option.style.background = 'var(--primary-50)';
    });
    option.addEventListener('mouseleave', () => {
      const input = option.querySelector('input');
      if (!input.checked) {
        option.style.borderColor = 'var(--neutral-200)';
        option.style.background = 'transparent';
      }
    });
    option.addEventListener('click', () => {
      paymentOptions.forEach(opt => {
        opt.style.borderColor = 'var(--neutral-200)';
        opt.style.background = 'transparent';
      });
      option.style.borderColor = 'var(--primary-600)';
      option.style.background = 'var(--primary-50)';
    });
  });
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => modal.remove(), 300);
  }
}

function completeOrder() {
  const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
  
  const user = getCurrentUser();
  const cart = getCart();
  
  // VALIDACIÓN DE STOCK: Verificar que hay stock suficiente antes de procesar
  const stockValidation = validateCartStock(cart);
  if (!stockValidation.valid) {
    closePaymentModal();
    showNotification(`Stock insuficiente para: ${stockValidation.product}. Solo quedan ${stockValidation.available} unidades.`, 'error');
    return;
  }
  
  // ACTUALIZAR STOCK: Reducir inventario de productos vendidos
  if (!updateProductStock(cart)) {
    closePaymentModal();
    showNotification('Error al actualizar inventario. Intenta nuevamente.', 'error');
    return;
  }
  
  // Guardar venta
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  
  const newSale = {
    id: sales.length + 1,
    date: new Date().toISOString().split('T')[0],
    products: cart.map(item => ({ id: item.productId, quantity: item.quantity })),
    total: getCartTotal() + (getCartTotal() > 200 ? 0 : 15),
    userId: user ? user.id : 0,
    paymentMethod,
    status: 'completed'
  };
  
  sales.push(newSale);
  localStorage.setItem('sales', JSON.stringify(sales));
  
  // Vaciar carrito
  localStorage.setItem('cart', JSON.stringify([]));
  updateCartBadge();
  
  closePaymentModal();
  showNotification('✓ Pedido confirmado. Stock actualizado. Te contactaremos para coordinar el pago y entrega.', 'success');
  
  setTimeout(() => {
    window.location.href = 'dashboard-cliente.html';
  }, 2500);
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});
