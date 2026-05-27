package ayala.apiVuelos.config;

import ayala.apiVuelos.entities.*;
import ayala.apiVuelos.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CiudadRepository ciudadRepository;
    private final AeropuertoRepository aeropuertoRepository;
    private final AerolineaRepository aerolineaRepository;
    private final AvionRepository avionRepository;
    private final PilotoRepository pilotoRepository;
    private final VueloRepository vueloRepository;
    private final TarifaRepository tarifaRepository;
    private final UsuarioRepository usuarioRepository;

    public DataInitializer(
            CiudadRepository ciudadRepository,
            AeropuertoRepository aeropuertoRepository,
            AerolineaRepository aerolineaRepository,
            AvionRepository avionRepository,
            PilotoRepository pilotoRepository,
            VueloRepository vueloRepository,
            TarifaRepository tarifaRepository,
            UsuarioRepository usuarioRepository) {
        this.ciudadRepository = ciudadRepository;
        this.aeropuertoRepository = aeropuertoRepository;
        this.aerolineaRepository = aerolineaRepository;
        this.avionRepository = avionRepository;
        this.pilotoRepository = pilotoRepository;
        this.vueloRepository = vueloRepository;
        this.tarifaRepository = tarifaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Solo sembrar si no hay ciudades en la base de datos
        if (ciudadRepository.count() == 0) {
            System.out.println("====== INICIANDO SIEMBRA DE DATOS DE PRUEBA ======");

            // 1. Ciudades
            Ciudad bsAs = new Ciudad();
            bsAs.setNombreCiudad("Buenos Aires");
            ciudadRepository.save(bsAs);

            Ciudad madrid = new Ciudad();
            madrid.setNombreCiudad("Madrid");
            ciudadRepository.save(madrid);

            Ciudad miami = new Ciudad();
            miami.setNombreCiudad("Miami");
            ciudadRepository.save(miami);

            Ciudad tokyo = new Ciudad();
            tokyo.setNombreCiudad("Tokyo");
            ciudadRepository.save(tokyo);

            // 2. Aeropuertos
            Aeropuerto ezeiza = new Aeropuerto();
            ezeiza.setNombreAeropuerto("Aeropuerto Internacional de Ezeiza (EZE)");
            ezeiza.setCiudad(bsAs);
            ezeiza.setVuelos(new ArrayList<>());
            aeropuertoRepository.save(ezeiza);

            Aeropuerto aeroparque = new Aeropuerto();
            aeroparque.setNombreAeropuerto("Aeroparque Jorge Newbery (AEP)");
            aeroparque.setCiudad(bsAs);
            aeroparque.setVuelos(new ArrayList<>());
            aeropuertoRepository.save(aeroparque);

            Aeropuerto barajas = new Aeropuerto();
            barajas.setNombreAeropuerto("Aeropuerto Adolfo Suárez Madrid-Barajas (MAD)");
            barajas.setCiudad(madrid);
            barajas.setVuelos(new ArrayList<>());
            aeropuertoRepository.save(barajas);

            Aeropuerto miamiIntl = new Aeropuerto();
            miamiIntl.setNombreAeropuerto("Aeropuerto Internacional de Miami (MIA)");
            miamiIntl.setCiudad(miami);
            miamiIntl.setVuelos(new ArrayList<>());
            aeropuertoRepository.save(miamiIntl);

            Aeropuerto haneda = new Aeropuerto();
            haneda.setNombreAeropuerto("Aeropuerto Internacional de Haneda (HND)");
            haneda.setCiudad(tokyo);
            haneda.setVuelos(new ArrayList<>());
            aeropuertoRepository.save(haneda);

            // 3. Aerolíneas
            Aerolinea aerolineasAr = new Aerolinea();
            aerolineasAr.setNombreAerolinea("Aerolíneas Argentinas");
            aerolineaRepository.save(aerolineasAr);

            Aerolinea iberia = new Aerolinea();
            iberia.setNombreAerolinea("Iberia");
            aerolineaRepository.save(iberia);

            Aerolinea jal = new Aerolinea();
            jal.setNombreAerolinea("Japan Airlines");
            aerolineaRepository.save(jal);

            // 4. Aviones
            Avion boeing737 = new Avion();
            boeing737.setNumeroAvion(737);
            avionRepository.save(boeing737);

            Avion airbusA350 = new Avion();
            airbusA350.setNumeroAvion(350);
            avionRepository.save(airbusA350);

            // 5. Pilotos
            Piloto piloto1 = new Piloto();
            piloto1.setDniPersona(11111111);
            piloto1.setNombrePersona("Juan");
            piloto1.setApellidoPersona("Pérez");
            piloto1.setNumeroPiloto(101);
            pilotoRepository.save(piloto1);

            Piloto piloto2 = new Piloto();
            piloto2.setDniPersona(22222222);
            piloto2.setNombrePersona("Carlos");
            piloto2.setApellidoPersona("Gómez");
            piloto2.setNumeroPiloto(102);
            pilotoRepository.save(piloto2);

            // 6. Vuelos
            // Vuelo 1: Buenos Aires (Ezeiza) -> Madrid (Barajas)
            Vuelo v1 = new Vuelo();
            v1.setNumeroVuelo(1001);
            v1.setSalida(LocalDateTime.now().plusDays(2).withHour(18).withMinute(0).withSecond(0).withNano(0));
            v1.setDestino(LocalDateTime.now().plusDays(3).withHour(6).withMinute(30).withSecond(0).withNano(0));
            v1.setAerolinea(aerolineasAr);
            v1.setAvion(airbusA350);
            v1.setPiloto(piloto1);
            v1.setAeropuertos(new ArrayList<>());
            vuelorepositorySaveAndLink(v1, ezeiza, barajas);

            // Vuelo 2: Madrid (Barajas) -> Miami (MIA)
            Vuelo v2 = new Vuelo();
            v2.setNumeroVuelo(2002);
            v2.setSalida(LocalDateTime.now().plusDays(4).withHour(10).withMinute(15).withSecond(0).withNano(0));
            v2.setDestino(LocalDateTime.now().plusDays(4).withHour(19).withMinute(45).withSecond(0).withNano(0));
            v2.setAerolinea(iberia);
            v2.setAvion(boeing737);
            v2.setPiloto(piloto2);
            v2.setAeropuertos(new ArrayList<>());
            vuelorepositorySaveAndLink(v2, barajas, miamiIntl);

            // Vuelo 3: Buenos Aires (Aeroparque) -> Tokyo (Haneda)
            Vuelo v3 = new Vuelo();
            v3.setNumeroVuelo(3003);
            v3.setSalida(LocalDateTime.now().plusDays(6).withHour(23).withMinute(0).withSecond(0).withNano(0));
            v3.setDestino(LocalDateTime.now().plusDays(8).withHour(8).withMinute(15).withSecond(0).withNano(0));
            v3.setAerolinea(jal);
            v3.setAvion(airbusA350);
            v3.setPiloto(piloto1);
            v3.setAeropuertos(new ArrayList<>());
            vuelorepositorySaveAndLink(v3, aeroparque, haneda);

            // Vuelo 4: Miami (MIA) -> Buenos Aires (Ezeiza)
            Vuelo v4 = new Vuelo();
            v4.setNumeroVuelo(4004);
            v4.setSalida(LocalDateTime.now().plusDays(1).withHour(12).withMinute(30).withSecond(0).withNano(0));
            v4.setDestino(LocalDateTime.now().plusDays(1).withHour(21).withMinute(0).withSecond(0).withNano(0));
            v4.setAerolinea(aerolineasAr);
            v4.setAvion(boeing737);
            v4.setPiloto(piloto2);
            v4.setAeropuertos(new ArrayList<>());
            vuelorepositorySaveAndLink(v4, miamiIntl, ezeiza);

            // 7. Tarifas para los Vuelos
            // Tarifas para Vuelo 1
            createTarifa(101, 150, 1200, Clase.TURISTA, v1);
            createTarifa(102, 300, 2500, Clase.FIRSTCLASS, v1);
            createTarifa(103, 100, 950, Clase.ECONOMICA, v1);

            // Tarifas para Vuelo 2
            createTarifa(201, 120, 850, Clase.TURISTA, v2);
            createTarifa(202, 250, 1900, Clase.FIRSTCLASS, v2);

            // Tarifas para Vuelo 3
            createTarifa(301, 200, 1800, Clase.TURISTA, v3);
            createTarifa(302, 450, 4200, Clase.FIRSTCLASS, v3);
            createTarifa(303, 150, 1400, Clase.ECONOMICA, v3);

            // Tarifas para Vuelo 4
            createTarifa(401, 110, 780, Clase.TURISTA, v4);
            createTarifa(402, 220, 1600, Clase.FIRSTCLASS, v4);

            // 8. Usuario de Prueba
            Usuario defaultUser = new Usuario();
            defaultUser.setDniPersona(99999999);
            defaultUser.setNombrePersona("Ignacio");
            defaultUser.setApellidoPersona("Ayala");
            defaultUser.setNumeroUsuario(500);
            defaultUser.setCorreoElectronicoUsuario("admin@vuelos.com");
            defaultUser.setContraseñaUsuario("admin123");
            defaultUser.setConsultas(new ArrayList<>());
            defaultUser.setReservas(new ArrayList<>());
            defaultUser.setTarjetas(new ArrayList<>());
            usuarioRepository.save(defaultUser);

            System.out.println("====== SIEMBRA DE DATOS DE PRUEBA FINALIZADA ======");
        }
    }

    private void vuelorepositorySaveAndLink(Vuelo vuelo, Aeropuerto origen, Aeropuerto destino) {
        vueloRepository.save(vuelo);
        vuelo.addAeropuerto(origen);
        vuelo.addAeropuerto(destino);
        vueloRepository.save(vuelo);
    }

    private void createTarifa(int numero, int impuesto, int precio, Clase clase, Vuelo vuelo) {
        Tarifa tarifa = new Tarifa();
        tarifa.setNumeroTarifa(numero);
        tarifa.setImpuestoTarifa(impuesto);
        tarifa.setPrecioTarifa(precio);
        tarifa.setClaseTarifa(clase);
        tarifa.setVuelo(vuelo);
        tarifaRepository.save(tarifa);
    }
}
