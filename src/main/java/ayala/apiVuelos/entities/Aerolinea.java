package ayala.apiVuelos.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aerolinea extends Base {
    private String nombreAerolinea;

    @OneToMany(mappedBy = "aerolinea")
    private List<Vuelo> vuelos;
}
