class AuthService {
    constructor() {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        this.currentUser = JSON.parse(localStorage.getItem('skypass_user')) || null;
        AuthService.instance = this;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('skypass_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('skypass_user');
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    async login(email, password) {
        // Busca en la base de datos de usuarios
        const users = await apiService.getUsers();
        const user = users.find(u => u.correoElectronicoUsuario === email && u.contraseñaUsuario === password);
        
        if (user) {
            this.setCurrentUser(user);
            return user;
        } else {
            throw new Error('Correo electrónico o contraseña incorrectos.');
        }
    }

    async register(nombre, apellido, dni, numeroUsuario, email, password) {
        // Valida primero si el usuario ya existe
        const users = await apiService.getUsers();
        const exists = users.some(u => u.correoElectronicoUsuario === email);
        if (exists) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const newUser = {
            dniPersona: parseInt(dni),
            nombrePersona: nombre,
            apellidoPersona: apellido,
            numeroUsuario: parseInt(numeroUsuario),
            correoElectronicoUsuario: email,
            contraseñaUsuario: password
        };

        const savedUser = await apiService.createUser(newUser);
        this.setCurrentUser(savedUser);
        return savedUser;
    }

    logout() {
        this.setCurrentUser(null);
    }
}

// Crear la instancia única del Singleton y congelar el objeto
const authServiceInstance = new AuthService();
Object.freeze(authServiceInstance);

// Exportar globalmente
window.authService = authServiceInstance;
