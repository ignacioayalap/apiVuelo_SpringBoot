package ayala.apiVuelos.services;

import ayala.apiVuelos.entities.Consulta;
import ayala.apiVuelos.repositories.BaseRepository;
import org.springframework.stereotype.Service;

@Service
public class ConsultaServiceImpl extends BaseServiceImpl<Consulta, Long> implements ConsultaService {
    public ConsultaServiceImpl(BaseRepository<Consulta, Long> baseRepository) {
        super(baseRepository);
    }
}
