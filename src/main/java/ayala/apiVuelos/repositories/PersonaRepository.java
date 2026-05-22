package ayala.apiVuelos.repositories;

import ayala.apiVuelos.entities.Persona;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonaRepository extends BaseRepository<Persona, Long> {
}
