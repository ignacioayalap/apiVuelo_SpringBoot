package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Avion;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AvionServiceImpl extends BaseServiceImpl<Avion, Long> implements AvionService {
    public AvionServiceImpl(BaseRepository<Avion, Long> baseRepository) {
        super(baseRepository);
    }
}
