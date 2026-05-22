package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Tarifa;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class TarifaServiceImpl extends BaseServiceImpl<Tarifa, Long> implements TarifaService {
    public TarifaServiceImpl(BaseRepository<Tarifa, Long> baseRepository) {
        super(baseRepository);
    }
}
