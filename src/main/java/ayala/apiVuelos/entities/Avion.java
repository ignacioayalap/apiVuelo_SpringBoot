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
public class Avion extends Base implements Especificacion {
    private int numeroAvion;

    @OneToMany(mappedBy = "avion")
    private List<Asiento> asientos;

    public void addAsiento(Asiento asiento) {
        this.asientos.add(asiento);
        asiento.setAvion(this);
    }

    public boolean removeAsiento(Asiento asiento) {
        asiento.setAvion(null);
        return this.asientos.remove(asiento);
    }

    @Override
    public String tipoTurbina() {
        return "Turbina estándar";
    }

    @Override
    public String tipoAvion() {
        return "Comercial";
    }
}
