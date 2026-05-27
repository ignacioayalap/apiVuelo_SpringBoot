// Application State
let appState = {
    flights: [],
    cities: [],
    cart: JSON.parse(localStorage.getItem('skypass_cart')) || [],
    selectedTariff: null // { flightId, tariffId, clase, precio, impuesto }
};

// DOM Elements
const views = {
    flights: document.getElementById('flights-view'),
    login: document.getElementById('login-view'),
    register: document.getElementById('register-view'),
    cart: document.getElementById('cart-view'),
    history: document.getElementById('history-view')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    setupNavigation();
    setupAuthForms();
    setupFilters();
    setupCheckout();
    updateAuthUI();
    updateCartBadge();
    
    // Load initial data
    await loadInitialData();
});

// Load Initial Cities & Flights
async function loadInitialData() {
    showLoader(true);
    try {
        // Cargar ciudades
        appState.cities = await apiService.getCities();
        populateFilterDropdowns();

        // Cargar vuelos
        appState.flights = await apiService.getFlights();
        renderFlights();
    } catch (e) {
        showToast('Error al conectar con la API. Asegúrese de que el servidor está encendido.', 'danger');
        console.error(e);
    } finally {
        showLoader(false);
    }
}

// Navigation & Routing
function setupNavigation() {
    const links = [
        { el: document.getElementById('nav-logo'), view: 'flights' },
        { el: document.getElementById('nav-flights'), view: 'flights' },
        { el: document.getElementById('nav-history'), view: 'history' },
        { el: document.getElementById('nav-cart'), view: 'cart' },
        { el: document.getElementById('btn-show-login'), view: 'login' },
        { el: document.getElementById('link-show-register'), view: 'register' },
        { el: document.getElementById('link-show-login'), view: 'login' },
        { el: document.getElementById('btn-history-login'), view: 'login' },
        { el: document.getElementById('link-checkout-login'), view: 'login' },
        { el: document.getElementById('btn-back-to-flights'), view: 'flights' },
        { el: document.getElementById('btn-history-find-flights'), view: 'flights' }
    ];

    links.forEach(link => {
        if (link.el) {
            link.el.addEventListener('click', (e) => {
                e.preventDefault();
                showView(link.view);
            });
        }
    });

    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
        updateAuthUI();
        showToast('Sesión cerrada con éxito', 'success');
        showView('flights');
    });
}

function showView(viewName) {
    // Esconder todas las vistas
    Object.keys(views).forEach(key => {
        if (views[key]) {
            views[key].classList.add('d-none');
        }
    });

    // Mostrar vista seleccionada
    if (views[viewName]) {
        views[viewName].classList.remove('d-none');
    }

    // Actualizar nav active class
    document.getElementById('nav-flights').classList.remove('active');
    document.getElementById('nav-history').classList.remove('active');
    
    if (viewName === 'flights') {
        document.getElementById('nav-flights').classList.add('active');
        renderFlights(); // Recargar grilla al entrar
    } else if (viewName === 'history') {
        document.getElementById('nav-history').classList.add('active');
        loadHistory();
    } else if (viewName === 'cart') {
        renderCart();
    }
}

// Authentication UI Updates
function updateAuthUI() {
    const user = authService.getCurrentUser();
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    
    if (user) {
        authButtons.classList.add('d-none');
        userProfile.classList.remove('d-none');
        
        // Poner iniciales y datos
        const initials = `${user.nombrePersona[0]}${user.apellidoPersona[0]}`.toUpperCase();
        document.getElementById('user-initials').innerText = initials;
        document.getElementById('user-name-display').innerText = `${user.nombrePersona} ${user.apellidoPersona}`;
        document.getElementById('user-email-display').innerText = user.correoElectronicoUsuario;
    } else {
        authButtons.classList.remove('d-none');
        userProfile.classList.add('d-none');
    }
}

// Setup Auth Forms
function setupAuthForms() {
    // Form Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        
        try {
            await authService.login(email, pass);
            updateAuthUI();
            showToast('¡Sesión iniciada correctamente!', 'success');
            showView('flights');
            document.getElementById('login-form').reset();
        } catch (err) {
            showToast(err.message, 'danger');
        }
    });

    // Form Registro
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('reg-nombre').value;
        const apellido = document.getElementById('reg-apellido').value;
        const dni = document.getElementById('reg-dni').value;
        const userNum = document.getElementById('reg-numero').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;

        if (pass.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres.', 'warning');
            return;
        }

        try {
            await authService.register(nombre, apellido, dni, userNum, email, pass);
            updateAuthUI();
            showToast('¡Registro completado e inicio de sesión automático!', 'success');
            showView('flights');
            document.getElementById('register-form').reset();
        } catch (err) {
            showToast(err.message, 'danger');
        }
    });
}

// Filters implementation
function setupFilters() {
    document.getElementById('filter-origin').addEventListener('change', renderFlights);
    document.getElementById('filter-dest').addEventListener('change', renderFlights);
    document.getElementById('filter-date').addEventListener('change', renderFlights);

    document.getElementById('btn-clear-filters').addEventListener('click', () => {
        document.getElementById('filters-form').reset();
        renderFlights();
    });
}

function populateFilterDropdowns() {
    const originSelect = document.getElementById('filter-origin');
    const destSelect = document.getElementById('filter-dest');

    // Limpiar excepto el default
    originSelect.innerHTML = '<option value="">Cualquier origen</option>';
    destSelect.innerHTML = '<option value="">Cualquier destino</option>';

    appState.cities.forEach(city => {
        const option = `<option value="${city.nombreCiudad}">${city.nombreCiudad}</option>`;
        originSelect.innerHTML += option;
        destSelect.innerHTML += option;
    });
}

// Render Flights Grid
function renderFlights() {
    const container = document.getElementById('flights-container');
    const emptyState = document.getElementById('flights-empty');
    
    // Obtener valores filtros
    const originFilter = document.getElementById('filter-origin').value;
    const destFilter = document.getElementById('filter-dest').value;
    const dateFilter = document.getElementById('filter-date').value;

    container.innerHTML = '';

    // Filtrar vuelos
    const filteredFlights = appState.flights.filter(flight => {
        const originCity = flight.aeropuertos && flight.aeropuertos[0] && flight.aeropuertos[0].ciudad 
            ? flight.aeropuertos[0].ciudad.nombreCiudad : '';
        const destCity = flight.aeropuertos && flight.aeropuertos[1] && flight.aeropuertos[1].ciudad 
            ? flight.aeropuertos[1].ciudad.nombreCiudad : '';
        
        // Comparación origen y destino
        if (originFilter && originCity !== originFilter) return false;
        if (destFilter && destCity !== destFilter) return false;

        // Comparación fecha
        if (dateFilter) {
            const flightDate = flight.salida.split('T')[0];
            if (flightDate !== dateFilter) return false;
        }

        return true;
    });

    if (filteredFlights.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }

    emptyState.classList.add('d-none');

    filteredFlights.forEach(flight => {
        const originAirport = flight.aeropuertos && flight.aeropuertos[0] ? flight.aeropuertos[0].nombreAeropuerto : 'N/A';
        const destAirport = flight.aeropuertos && flight.aeropuertos[1] ? flight.aeropuertos[1].nombreAeropuerto : 'N/A';
        const originCity = flight.aeropuertos && flight.aeropuertos[0] && flight.aeropuertos[0].ciudad ? flight.aeropuertos[0].ciudad.nombreCiudad : 'Origen';
        const destCity = flight.aeropuertos && flight.aeropuertos[1] && flight.aeropuertos[1].ciudad ? flight.aeropuertos[1].ciudad.nombreCiudad : 'Destino';
        
        const depTime = formatDateTime(flight.salida);
        const arrTime = formatDateTime(flight.destino);
        const airline = flight.aerolinea ? flight.aerolinea.nombreAerolinea : 'Aerolínea';

        // Render card
        const cardMarkup = `
            <div class="col-12">
                <div class="glass-card p-4 flight-card">
                    <div class="row align-items-center g-3">
                        <div class="col-md-3">
                            <div class="d-flex align-items-center">
                                <div class="bg-primary-subtle p-3 rounded-3 text-primary-glow me-3">
                                    <i class="bi bi-airplane-engines fs-3"></i>
                                </div>
                                <div>
                                    <h5 class="text-white fw-bold mb-0">${airline}</h5>
                                    <small class="text-white-50">Vuelo #${flight.numeroVuelo}</small>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Route display -->
                        <div class="col-md-5">
                            <div class="row align-items-center text-center">
                                <div class="col-5 text-start">
                                    <h4 class="text-white fw-bold mb-0">${depTime.time}</h4>
                                    <div class="text-white-50 fw-semibold">${originCity}</div>
                                    <small class="text-muted d-block text-truncate" title="${originAirport}">${originAirport}</small>
                                </div>
                                <div class="col-2 flight-route">
                                    <div class="flight-route-icon">
                                        <i class="bi bi-airplane-fill fs-5 text-primary-glow"></i>
                                    </div>
                                    <div class="flight-dur">${calculateDuration(flight.salida, flight.destino)}</div>
                                </div>
                                <div class="col-5 text-end">
                                    <h4 class="text-white fw-bold mb-0">${arrTime.time}</h4>
                                    <div class="text-white-50 fw-semibold">${destCity}</div>
                                    <small class="text-muted d-block text-truncate" title="${destAirport}">${destAirport}</small>
                                </div>
                            </div>
                        </div>

                        <!-- Class Prices Selection -->
                        <div class="col-md-4">
                            <div class="d-flex flex-column gap-2">
                                <div class="row g-2" id="tariff-selectors-${flight.id}">
                                    ${renderTariffs(flight)}
                                </div>
                                <button class="btn btn-primary w-100 rounded-pill mt-2 py-2 fw-semibold d-none" 
                                    id="btn-add-cart-${flight.id}" 
                                    onclick="addSelectedToCart(${flight.id})">
                                    <i class="bi bi-cart-plus me-1"></i> Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardMarkup;
    });
}

function renderTariffs(flight) {
    if (!flight.tarifas || flight.tarifas.length === 0) {
        return '<div class="col-12 text-center text-white-50 py-2">No hay tarifas cargadas</div>';
    }

    return flight.tarifas.map(t => {
        let claseLabel = 'Turista';
        if (t.claseTarifa === 'FIRSTCLASS') claseLabel = 'Primera';
        if (t.claseTarifa === 'ECONOMICA') claseLabel = 'Económica';

        return `
            <div class="col-4">
                <div class="class-price-pill" id="tariff-pill-${t.id}" onclick="selectTariff(${flight.id}, ${t.id}, '${t.claseTarifa}', ${t.precioTarifa}, ${t.impuestoTarifa})">
                    <small class="text-white-50 d-block">${claseLabel}</small>
                    <span class="text-white fw-bold">$${t.precioTarifa}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Tariff Selection logic on Flight Card
window.selectTariff = function(flightId, tariffId, clase, precio, impuesto) {
    // Quitar selección previa de las píldoras del mismo vuelo
    const flightTariffSelector = document.getElementById(`tariff-selectors-${flightId}`);
    const activePills = flightTariffSelector.querySelectorAll('.class-price-pill');
    activePills.forEach(pill => pill.classList.remove('selected'));

    // Seleccionar píldora actual
    const currentPill = document.getElementById(`tariff-pill-${tariffId}`);
    currentPill.classList.add('selected');

    // Registrar en estado
    appState.selectedTariff = {
        flightId,
        tariffId,
        clase,
        precio,
        impuesto
    };

    // Mostrar botón de "Agregar al Carrito" correspondiente
    const allAddButtons = document.querySelectorAll(`[id^="btn-add-cart-"]`);
    allAddButtons.forEach(btn => btn.classList.add('d-none'));

    const activeAddButton = document.getElementById(`btn-add-cart-${flightId}`);
    activeAddButton.classList.remove('d-none');
};

// Add to Cart
window.addSelectedToCart = function(flightId) {
    if (!appState.selectedTariff || appState.selectedTariff.flightId !== flightId) return;

    const flight = appState.flights.find(f => f.id === flightId);
    if (!flight) return;

    // Verificar si el vuelo ya está en el carrito para esta clase
    const exists = appState.cart.some(item => 
        item.flight.id === flightId && item.selectedTariff.tariffId === appState.selectedTariff.tariffId
    );

    if (exists) {
        showToast('Esta reserva de vuelo ya está en tu carrito.', 'warning');
        return;
    }

    // Agregar al carrito
    appState.cart.push({
        flight,
        selectedTariff: { ...appState.selectedTariff }
    });

    localStorage.setItem('skypass_cart', JSON.stringify(appState.cart));
    updateCartBadge();
    showToast('¡Vuelo agregado al carrito!', 'success');

    // Reset selección
    appState.selectedTariff = null;
    const allAddButtons = document.querySelectorAll(`[id^="btn-add-cart-"]`);
    allAddButtons.forEach(btn => btn.classList.add('d-none'));
    
    const pills = document.querySelectorAll('.class-price-pill');
    pills.forEach(p => p.classList.remove('selected'));
};

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (appState.cart.length > 0) {
        badge.innerText = appState.cart.length;
        badge.classList.remove('d-none');
    } else {
        badge.classList.add('d-none');
    }
}

// Render Shopping Cart View
function renderCart() {
    const container = document.getElementById('cart-item-container');
    const emptyState = document.getElementById('cart-empty');
    const checkoutPanel = document.getElementById('cart-checkout-panel');
    const authWarning = document.getElementById('auth-checkout-warning');
    const payBtn = document.getElementById('btn-pay');

    container.innerHTML = '';

    if (appState.cart.length === 0) {
        emptyState.classList.remove('d-none');
        checkoutPanel.classList.add('d-none');
        return;
    }

    emptyState.classList.add('d-none');
    checkoutPanel.classList.remove('d-none');

    let subtotal = 0;
    let taxes = 0;

    appState.cart.forEach((item, index) => {
        const { flight, selectedTariff } = item;
        const originCity = flight.aeropuertos && flight.aeropuertos[0] && flight.aeropuertos[0].ciudad ? flight.aeropuertos[0].ciudad.nombreCiudad : 'Origen';
        const destCity = flight.aeropuertos && flight.aeropuertos[1] && flight.aeropuertos[1].ciudad ? flight.aeropuertos[1].ciudad.nombreCiudad : 'Destino';
        const airline = flight.aerolinea ? flight.aerolinea.nombreAerolinea : 'Aerolínea';
        const depTime = formatDateTime(flight.salida);
        
        let claseLabel = 'Turista';
        if (selectedTariff.clase === 'FIRSTCLASS') claseLabel = 'Primera';
        if (selectedTariff.clase === 'ECONOMICA') claseLabel = 'Económica';

        subtotal += selectedTariff.precio;
        taxes += selectedTariff.impuesto;

        const cartItemMarkup = `
            <div class="glass-card p-4 mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <span class="badge bg-primary-glow mb-2">${claseLabel}</span>
                        <h4 class="text-white fw-bold mb-1">${originCity} <i class="bi bi-arrow-right mx-1 text-primary-glow"></i> ${destCity}</h4>
                        <p class="text-white-50 mb-2">${airline} &bull; Vuelo #${flight.numeroVuelo}</p>
                        <small class="text-muted"><i class="bi bi-calendar-event me-1"></i>Salida: ${depTime.date} a las ${depTime.time} hs</small>
                    </div>
                    <div class="text-end">
                        <h4 class="text-primary-glow fw-bold mb-0">$${selectedTariff.precio}</h4>
                        <small class="text-white-50">+ $${selectedTariff.impuesto} tasas</small>
                        <button class="btn btn-outline-danger btn-sm rounded-pill mt-3 d-block ms-auto" onclick="removeFromCart(${index})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cartItemMarkup;
    });

    const total = subtotal + taxes;

    // Actualizar Panel de checkout
    document.getElementById('summary-price').innerText = `$${subtotal}`;
    document.getElementById('summary-tax').innerText = `$${taxes}`;
    document.getElementById('summary-total').innerText = `$${total}`;

    // Validar autenticación para Checkout
    const isLoggedIn = authService.isLoggedIn();
    if (isLoggedIn) {
        authWarning.classList.add('d-none');
        payBtn.removeAttribute('disabled');
    } else {
        authWarning.classList.remove('d-none');
        payBtn.setAttribute('disabled', 'true');
    }
}

window.removeFromCart = function(index) {
    appState.cart.splice(index, 1);
    localStorage.setItem('skypass_cart', JSON.stringify(appState.cart));
    updateCartBadge();
    renderCart();
};

// Checkout & Billing process
function setupCheckout() {
    // Validar formateo de tarjeta
    const cardInput = document.getElementById('card-number');
    cardInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i];
        }
        e.target.value = formatted;
    });

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!authService.isLoggedIn()) {
            showToast('Debes iniciar sesión para pagar la reserva.', 'warning');
            return;
        }

        const user = authService.getCurrentUser();
        const cardNumberFormatted = document.getElementById('card-number').value;
        const cardNumber = parseInt(cardNumberFormatted.replace(/\s+/g, ''));
        const cardType = document.getElementById('card-type').value;

        showLoader(true);

        try {
            // Guardar reservas una a una
            for (let item of appState.cart) {
                const { flight, selectedTariff } = item;
                const totalAmount = selectedTariff.precio + selectedTariff.impuesto;

                // 1. Guardar tarjeta (pago)
                const paymentData = {
                    numeroPago: Math.floor(100000 + Math.random() * 900000), // Random ID
                    cantidadPago: totalAmount,
                    numeroTarjeta: cardNumber,
                    tipoTarjeta: cardType,
                    usuario: { id: user.id }
                };

                const savedCard = await apiService.createCardPayment(paymentData);

                // 2. Registrar reserva
                const reservationData = {
                    numeroReserva: Math.floor(10000 + Math.random() * 90000),
                    usuario: { id: user.id },
                    vuelo: { id: flight.id },
                    pago: { id: savedCard.id }
                };

                await apiService.createReservation(reservationData);
            }

            // Vaciar carrito
            appState.cart = [];
            localStorage.removeItem('skypass_cart');
            updateCartBadge();
            
            showToast('¡Pago procesado y reserva guardada con éxito!', 'success');
            showView('history');
            document.getElementById('checkout-form').reset();

        } catch(err) {
            showToast(err.message || 'Error al procesar el pago.', 'danger');
        } finally {
            showLoader(false);
        }
    });
}

// Load Booking History
async function loadHistory() {
    const noAuth = document.getElementById('history-no-auth');
    const content = document.getElementById('history-content');
    const loader = document.getElementById('history-loader');
    const list = document.getElementById('history-list');
    const emptyState = document.getElementById('history-empty');

    if (!authService.isLoggedIn()) {
        noAuth.classList.remove('d-none');
        content.classList.add('d-none');
        return;
    }

    noAuth.classList.add('d-none');
    content.classList.remove('d-none');
    loader.classList.remove('d-none');
    list.innerHTML = '';
    emptyState.classList.add('d-none');

    const currentUser = authService.getCurrentUser();

    try {
        const reservations = await apiService.getReservations();
        
        // Filtrar reservas del usuario actual
        const userReservations = reservations.filter(r => r.usuario && r.usuario.id === currentUser.id);

        if (userReservations.length === 0) {
            emptyState.classList.remove('d-none');
            return;
        }

        userReservations.forEach(res => {
            const flight = res.vuelo;
            if (!flight) return;

            const originCity = flight.aeropuertos && flight.aeropuertos[0] && flight.aeropuertos[0].ciudad ? flight.aeropuertos[0].ciudad.nombreCiudad : 'Origen';
            const destCity = flight.aeropuertos && flight.aeropuertos[1] && flight.aeropuertos[1].ciudad ? flight.aeropuertos[1].ciudad.nombreCiudad : 'Destino';
            const depTime = formatDateTime(flight.salida);
            const airline = flight.aerolinea ? flight.aerolinea.nombreAerolinea : 'Aerolínea';
            
            // Pago details
            const cardInfo = res.pago && res.pago.numeroTarjeta ? `Tarjeta finalizada en ${String(res.pago.numeroTarjeta).slice(-4)}` : 'Pago Directo';
            const payAmount = res.pago ? res.pago.cantidadPago : 0;

            const historyMarkup = `
                <div class="glass-card p-4">
                    <div class="row align-items-center g-3">
                        <div class="col-md-8">
                            <span class="badge bg-success-subtle text-success border border-success-subtle mb-2 px-2 py-1">Confirmado</span>
                            <h4 class="text-white fw-bold mb-1">${originCity} <i class="bi bi-arrow-right mx-1 text-primary-glow"></i> ${destCity}</h4>
                            <p class="text-white-50 mb-2">${airline} &bull; Vuelo #${flight.numeroVuelo} &bull; Reserva #${res.numeroReserva}</p>
                            <small class="text-muted"><i class="bi bi-calendar-event me-1"></i>Salida: ${depTime.date} a las ${depTime.time} hs</small>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <small class="text-white-50 d-block mb-1">${cardInfo}</small>
                            <h4 class="text-primary-glow fw-bold">$${payAmount}</h4>
                        </div>
                    </div>
                </div>
            `;
            list.innerHTML += historyMarkup;
        });

    } catch (e) {
        showToast('Error al cargar historial de reservas.', 'danger');
        console.error(e);
    } finally {
        loader.classList.add('d-none');
    }
}

// Helpers
function formatDateTime(isoString) {
    if (!isoString) return { date: '', time: '' };
    const dateObj = new Date(isoString);
    const date = dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
}

function calculateDuration(startIso, endIso) {
    if (!startIso || !endIso) return '';
    const diffMs = new Date(endIso) - new Date(startIso);
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
}

function showLoader(show) {
    const loader = document.getElementById('flights-loader');
    if (show) {
        loader.classList.remove('d-none');
    } else {
        loader.classList.add('d-none');
    }
}

function showToast(message, type = 'success') {
    const toastEl = document.getElementById('app-toast');
    const toastMsg = document.getElementById('toast-message');
    
    // Quitar clases anteriores
    toastEl.className = 'toast align-items-center text-white border-0';
    
    // Añadir clase de color
    if (type === 'success') toastEl.classList.add('bg-success');
    if (type === 'danger') toastEl.classList.add('bg-danger');
    if (type === 'warning') toastEl.classList.add('bg-warning', 'text-dark');

    toastMsg.innerText = message;

    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
}
