package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Vuelo;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class VueloServiceImpl extends BaseServiceImpl<Vuelo, Long> implements VueloService {
    public VueloServiceImpl(BaseRepository<Vuelo, Long> baseRepository) {
        super(baseRepository);
    }
}
