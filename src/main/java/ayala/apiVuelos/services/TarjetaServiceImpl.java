package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Tarjeta;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class TarjetaServiceImpl extends BaseServiceImpl<Tarjeta, Long> implements TarjetaService {
    public TarjetaServiceImpl(BaseRepository<Tarjeta, Long> baseRepository) {
        super(baseRepository);
    }
}
