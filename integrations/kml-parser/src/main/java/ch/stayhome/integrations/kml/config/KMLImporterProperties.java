package ch.stayhome.integrations.kml.config;

import javax.validation.constraints.NotBlank;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "stayhome.integrations.kml")
@Data
public class KMLImporterProperties {

	@NotBlank
	private String syncServiceUrl;

	@NotBlank
	private String downloadUrl;

}
