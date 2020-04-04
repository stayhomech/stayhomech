package ch.stayhome.integrations.kml;


import static org.springframework.boot.SpringApplication.run;

import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableBatchProcessing
@EnableScheduling
public class KMLImporterApp {

	public static void main(String[] args) {
		run(KMLImporterApp.class, args);
	}

}
