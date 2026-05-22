package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Asiento;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AsientoServiceImpl extends BaseServiceImpl<Asiento, Long> implements AsientoService {
    public AsientoServiceImpl(BaseRepository<Asiento, Long> baseRepository) {
        super(baseRepository);
    }
}
