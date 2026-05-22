package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Aerolinea;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AerolineaServiceImpl extends BaseServiceImpl<Aerolinea, Long> implements AerolineaService {
    public AerolineaServiceImpl(BaseRepository<Aerolinea, Long> baseRepository) {
        super(baseRepository);
    }
}
