package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Pago;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class PagoServiceImpl extends BaseServiceImpl<Pago, Long> implements PagoService {
    public PagoServiceImpl(BaseRepository<Pago, Long> baseRepository) {
        super(baseRepository);
    }
}
