package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Piloto;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class PilotoServiceImpl extends BaseServiceImpl<Piloto, Long> implements PilotoService {
    public PilotoServiceImpl(BaseRepository<Piloto, Long> baseRepository) {
        super(baseRepository);
    }
}
