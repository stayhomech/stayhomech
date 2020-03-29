package ch.stayhome.integrations.localhero;

import static org.springframework.boot.SpringApplication.run;

import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableBatchProcessing
@EnableScheduling
public class LocalHeroApp {

	public static void main(String[] args) {
		run(LocalHeroApp.class, args);
	}

}
