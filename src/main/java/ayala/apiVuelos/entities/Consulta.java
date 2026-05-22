package ayala.apiVuelos.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Consulta extends Base {
    private int numeroConsulta;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
