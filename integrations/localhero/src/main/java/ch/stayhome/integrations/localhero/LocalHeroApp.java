package ch.stayhome.integrations.localhero;

import static org.springframework.boot.SpringApplication.run;

import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableBatchProcessing
public class LocalHeroApp {

	public static void main(String[] args) {
		run(LocalHeroApp.class, args);
	}

}
