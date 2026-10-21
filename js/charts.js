// Tienda Yenys - Gráficos de Ventas

// === MÉTRICAS CLAVE ===

function renderKeyMetrics() {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  const products = getProducts();
  
  // Calcular métricas
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const totalProductsSold = sales.reduce((sum, sale) => {
    return sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0);
  }, 0);
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Calcular cambios (simulado)
  const revenueChange = '+12.5%';
  const salesChange = '+8.3%';
  const productsChange = '+15.2%';
  const ticketChange = '+4.1%';
  
  const metricsContainer = document.getElementById('key-metrics');
  if (!metricsContainer) return;
  
  const metrics = [
    {
      icon: '💰',
      label: 'Ingresos Totales',
      value: formatPrice(totalRevenue),
      change: revenueChange,
      positive: true,
      color: 'var(--primary-600)'
    },
    {
      icon: '📦',
      label: 'Ventas del Mes',
      value: totalSales,
      change: salesChange,
      positive: true,
      color: 'var(--cta-orange-600)'
    },
    {
      icon: '🎁',
      label: 'Productos Vendidos',
      value: totalProductsSold,
      change: productsChange,
      positive: true,
      color: 'var(--success-green)'
    },
    {
      icon: '📊',
      label: 'Ticket Promedio',
      value: formatPrice(averageTicket),
      change: ticketChange,
      positive: true,
      color: 'var(--vibrant-turquoise-dark)'
    }
  ];
  
  metricsContainer.innerHTML = metrics.map(metric => `
    <div class="card" style="padding: var(--space-8);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-4);">
        <div style="
          width: 48px;
          height: 48px;
          background: ${metric.color}15;
          color: ${metric.color};
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        ">${metric.icon}</div>
        
        <div style="
          font-size: 14px;
          font-weight: 600;
          color: ${metric.positive ? 'var(--success-green)' : 'var(--error-red)'};
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          ${metric.positive ? '↑' : '↓'} ${metric.change}
        </div>
      </div>
      
      <div style="font-size: 14px; font-weight: 500; color: var(--neutral-600); margin-bottom: var(--space-2);">
        ${metric.label}
      </div>
      
      <div style="font-size: 32px; font-weight: 700; color: var(--neutral-900);">
        ${metric.value}
      </div>
    </div>
  `).join('');
}

// === GRÁFICO DE VENTAS POR MES ===

function renderSalesChart() {
  const canvas = document.getElementById('sales-chart');
  if (!canvas) return;
  
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  
  // Agrupar ventas por mes
  const monthlySales = {};
  sales.forEach(sale => {
    const month = sale.date.substring(0, 7); // YYYY-MM
    monthlySales[month] = (monthlySales[month] || 0) + sale.total;
  });
  
  // Generar últimos 6 meses
  const months = [];
  const data = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toISOString().substring(0, 7);
    const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    
    months.push(monthName);
    data.push(monthlySales[monthKey] || 0);
  }
  
  const ctx = canvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Ventas (S/)',
        data: data,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: '#8B5CF6',
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Ventas: S/ ' + context.parsed.y.toFixed(2);
            }
          },
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          padding: 12,
          borderRadius: 8,
          titleFont: { size: 14, weight: '600' },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'S/ ' + value.toFixed(0);
            }
          },
          grid: {
            color: '#E5E5E5'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// === GRÁFICO DE PRODUCTOS MÁS VENDIDOS ===

function renderTopProductsChart() {
  const canvas = document.getElementById('top-products-chart');
  if (!canvas) return;
  
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  const products = getProducts();
  
  // Contar ventas por producto
  const productSales = {};
  sales.forEach(sale => {
    sale.products.forEach(item => {
      productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
    });
  });
  
  // Top 5 productos
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const labels = topProducts.map(([id]) => {
    const product = products.find(p => p.id === parseInt(id));
    return product ? product.name.substring(0, 20) : `Producto ${id}`;
  });
  
  const data = topProducts.map(([, quantity]) => quantity);
  
  const colors = [
    '#8B5CF6',
    '#FF1744',
    '#00E5CC',
    '#F97316',
    '#A855F7'
  ];
  
  const ctx = canvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: { size: 12, weight: '500' },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} unidades (${percentage}%)`;
            }
          },
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          padding: 12,
          borderRadius: 8,
          titleFont: { size: 14, weight: '600' },
          bodyFont: { size: 13 }
        }
      }
    }
  });
}

// === GRÁFICO DE TENDENCIAS ===

function renderTrendChart() {
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;
  
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  
  // Agrupar por fecha
  const dailySales = {};
  sales.forEach(sale => {
    dailySales[sale.date] = (dailySales[sale.date] || 0) + sale.total;
  });
  
  // Ordenar fechas
  const sortedDates = Object.keys(dailySales).sort();
  const labels = sortedDates.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  });
  const data = sortedDates.map(date => dailySales[date]);
  
  const ctx = canvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ventas Diarias',
        data: data,
        borderColor: '#FF1744',
        backgroundColor: 'rgba(255, 23, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF1744',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Ventas: S/ ' + context.parsed.y.toFixed(2);
            }
          },
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          padding: 12,
          borderRadius: 8,
          titleFont: { size: 14, weight: '600' },
          bodyFont: { size: 13 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'S/ ' + value.toFixed(0);
            }
          },
          grid: {
            color: '#E5E5E5'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// === TABLA DE TRANSACCIONES ===

function renderTransactionsTable() {
  const sales = JSON.parse(localStorage.getItem('sales') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const products = getProducts();
  
  const container = document.getElementById('transactions-table');
  if (!container) return;
  
  if (sales.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--neutral-600); padding: var(--space-8);">No hay transacciones aún</p>';
    return;
  }
  
  // Ordenar por fecha descendente
  const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = `
    <div class="card" style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: var(--neutral-50); text-align: left;">
            <th style="padding: var(--space-4); font-weight: 600; color: var(--neutral-900); border-bottom: 2px solid var(--neutral-200);">ID</th>
            <th style="padding: var(--space-4); font-weight: 600; color: var(--neutral-900); border-bottom: 2px solid var(--neutral-200);">Fecha</th>
            <th style="padding: var(--space-4); font-weight: 600; color: var(--neutral-900); border-bottom: 2px solid var(--neutral-200);">Cliente</th>
            <th style="padding: var(--space-4); font-weight: 600; color: var(--neutral-900); border-bottom: 2px solid var(--neutral-200);">Productos</th>
            <th style="padding: var(--space-4); font-weight: 600; color: var(--neutral-900); border-bottom: 2px solid var(--neutral-200); text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${sortedSales.map(sale => {
            const user = users.find(u => u.id === sale.userId);
            const productNames = sale.products.map(p => {
              const product = products.find(prod => prod.id === p.id);
              return product ? `${product.name} (x${p.quantity})` : `Producto ${p.id}`;
            }).join(', ');
            
            return `
              <tr style="border-bottom: 1px solid var(--neutral-200);">
                <td style="padding: var(--space-4); font-weight: 600; color: var(--primary-700);">#${sale.id.toString().padStart(4, '0')}</td>
                <td style="padding: var(--space-4); color: var(--neutral-600);">${formatDate(sale.date)}</td>
                <td style="padding: var(--space-4);">${user ? user.name : 'Cliente Desconocido'}</td>
                <td style="padding: var(--space-4); max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${productNames}">${productNames}</td>
                <td style="padding: var(--space-4); text-align: right; font-weight: 700; color: var(--vibrant-red);">${formatPrice(sale.total)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si es empleado
  checkAuth('empleado');
  
  // Renderizar todos los componentes
  renderKeyMetrics();
  renderSalesChart();
  renderTopProductsChart();
  renderTrendChart();
  renderTransactionsTable();
});
