// Tienda Yenys - Autenticación

// === REGISTRO ===

function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;
  
  // Validaciones
  if (!name || !email || !password) {
    showNotification('Todos los campos son obligatorios', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    showNotification('Email inválido', 'error');
    return;
  }
  
  if (!validatePassword(password)) {
    showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  
  // Verificar si el email ya existe
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    showNotification('Este email ya está registrado', 'error');
    return;
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  showNotification('Registro exitoso. Ahora puedes iniciar sesión', 'success');
  
  // Cambiar a formulario de login
  setTimeout(() => {
    document.getElementById('register-form').reset();
    showLoginForm();
  }, 1500);
}

// === LOGIN ===

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  
  // Validaciones
  if (!email || !password) {
    showNotification('Todos los campos son obligatorios', 'error');
    return;
  }
  
  if (!validateEmail(email)) {
    showNotification('Email inválido', 'error');
    return;
  }
  
  // Buscar usuario
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showNotification('Email o contraseña incorrectos', 'error');
    return;
  }
  
  // Guardar sesión
  setCurrentUser(user);
  showNotification(`Bienvenido, ${user.name}`, 'success');
  
  // Redireccionar según rol
  setTimeout(() => {
    if (user.role === 'empleado') {
      window.location.href = 'dashboard-empleado.html';
    } else {
      window.location.href = 'dashboard-cliente.html';
    }
  }, 1000);
}

// === UI HELPERS ===

function showLoginForm() {
  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('register-section').classList.add('hidden');
}

function showRegisterForm() {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('register-section').classList.remove('hidden');
}

// === INICIALIZACIÓN ===

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si ya hay sesión activa
  const currentUser = getCurrentUser();
  if (currentUser) {
    // Redireccionar según rol
    if (currentUser.role === 'empleado') {
      window.location.href = 'dashboard-empleado.html';
    } else {
      window.location.href = 'dashboard-cliente.html';
    }
    return;
  }
  
  // Configurar event listeners
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
});
