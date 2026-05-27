const API_BASE_URL = 'http://localhost:9000/api/v1';

class ApiService {
    constructor() {
        if (ApiService.instance) {
            return ApiService.instance;
        }
        ApiService.instance = this;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}/${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const text = await response.text();
                let errMsg = 'Ocurrió un error en la solicitud.';
                try {
                    const errJson = JSON.parse(text);
                    errMsg = errJson.error || errMsg;
                } catch(e) {}
                throw new Error(errMsg);
            }
            if (response.status === 204) {
                return true;
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // 1. Ciudades
    async getCities() {
        return this.request('ciudades');
    }

    // 2. Vuelos
    async getFlights() {
        return this.request('vuelos');
    }

    // 3. Usuarios
    async getUsers() {
        return this.request('usuarios');
    }

    async createUser(userData) {
        return this.request('usuarios', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // 4. Tarjetas / Pagos
    async createCardPayment(cardData) {
        return this.request('tarjetas', {
            method: 'POST',
            body: JSON.stringify(cardData)
        });
    }

    // 5. Reservas
    async getReservations() {
        return this.request('reservas');
    }

    async createReservation(reservationData) {
        return this.request('reservas', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    }
}

const apiServiceInstance = new ApiService();
Object.freeze(apiServiceInstance);

window.apiService = apiServiceInstance;
