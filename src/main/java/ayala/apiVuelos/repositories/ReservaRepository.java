package ayala.apiVuelos.repositories;

import ayala.apiVuelos.entities.Reserva;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends BaseRepository<Reserva, Long> {
}
