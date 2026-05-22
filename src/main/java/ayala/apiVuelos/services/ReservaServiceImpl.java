package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Reserva;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class ReservaServiceImpl extends BaseServiceImpl<Reserva, Long> implements ReservaService {
    public ReservaServiceImpl(BaseRepository<Reserva, Long> baseRepository) {
        super(baseRepository);
    }
}
