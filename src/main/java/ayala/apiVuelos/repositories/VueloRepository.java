package ayala.apiVuelos.repositories;

import ayala.apiVuelos.entities.Vuelo;
import org.springframework.stereotype.Repository;

@Repository
public interface VueloRepository extends BaseRepository<Vuelo, Long> {
}
