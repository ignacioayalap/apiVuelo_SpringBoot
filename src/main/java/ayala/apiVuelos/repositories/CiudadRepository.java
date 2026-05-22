package ayala.apiVuelos.repositories;

import ayala.apiVuelos.entities.Ciudad;
import org.springframework.stereotype.Repository;

@Repository
public interface CiudadRepository extends BaseRepository<Ciudad, Long> {
}
