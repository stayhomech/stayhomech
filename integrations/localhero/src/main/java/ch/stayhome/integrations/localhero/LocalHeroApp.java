package ch.stayhome.integrations.localhero;

import static org.springframework.boot.SpringApplication.run;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class LocalHeroApp {
	public static void main(String[] args) {
		run(LocalHeroApp.class, args);
	}
}
