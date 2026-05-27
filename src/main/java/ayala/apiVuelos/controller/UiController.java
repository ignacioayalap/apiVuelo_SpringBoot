package ayala.apiVuelos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UiController {

	@GetMapping({"/", "/index", "/home"})
	public String home() {
		return "forward:/index.html";
	}

	@GetMapping({"/flights", "/cart", "/history", "/login", "/register"})
	public String spaRoutes() {
		return "forward:/index.html";
	}

	@GetMapping({"/ui", "/ui/", "/ui/**"})
	public String ui() {
		return "forward:/index.html";
	}
}
