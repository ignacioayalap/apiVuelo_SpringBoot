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
public class Usuario extends Persona {
    private int numeroUsuario;
    private String contraseñaUsuario;
    private String correoElectronicoUsuario;

    @OneToMany(mappedBy = "usuario")
    private List<Consulta> consultas;

    @OneToMany(mappedBy = "usuario")
    private List<Reserva> reservas;

    @OneToMany(mappedBy = "usuario")
    private List<Tarjeta> tarjetas;
}
