package ayala.apiVuelos;

import java.awt.Desktop;
import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class ApiVuelosApplication {

	@Value("${server.port:8080}")
	private int serverPort;

	@Value("${app.ui.open-browser:true}")
	private boolean openBrowser;

	public static void main(String[] args) {
		SpringApplication.run(ApiVuelosApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void openUiInBrowser() {
		if (!openBrowser) return;
		if (!Desktop.isDesktopSupported()) return;
		try {
			Desktop.getDesktop().browse(new URI("http://localhost:" + serverPort + "/"));
		} catch (Exception ignored) {
			// si falla abrir el navegador, la app igualmente queda corriendo
		}
	}
}
