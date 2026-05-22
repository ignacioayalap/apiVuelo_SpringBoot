package ayala.apiVuelos.repositories;

import ayala.apiVuelos.entities.Tarifa;
import org.springframework.stereotype.Repository;

@Repository
public interface TarifaRepository extends BaseRepository<Tarifa, Long> {
}
