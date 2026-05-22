package ayala.apiVuelos.repositories;

import ayala.apiVuelos.entities.Usuario;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends BaseRepository<Usuario, Long> {
}
