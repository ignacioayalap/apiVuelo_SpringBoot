package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Aeropuerto;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AeropuertoServiceImpl extends BaseServiceImpl<Aeropuerto, Long> implements AeropuertoService {
    public AeropuertoServiceImpl(BaseRepository<Aeropuerto, Long> baseRepository) {
        super(baseRepository);
    }
}
