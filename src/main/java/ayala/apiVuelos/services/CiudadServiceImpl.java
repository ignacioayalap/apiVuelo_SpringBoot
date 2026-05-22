package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Ciudad;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class CiudadServiceImpl extends BaseServiceImpl<Ciudad, Long> implements CiudadService {
    public CiudadServiceImpl(BaseRepository<Ciudad, Long> baseRepository) {
        super(baseRepository);
    }
}
