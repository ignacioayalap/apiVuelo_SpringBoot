package ayala.apiVuelos.repositories;

import ayala.apiVuelos.entities.Avion;
import org.springframework.stereotype.Repository;

@Repository
public interface AvionRepository extends BaseRepository<Avion, Long> {
}
