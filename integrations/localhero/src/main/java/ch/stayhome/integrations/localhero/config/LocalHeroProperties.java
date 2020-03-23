package ch.stayhome.integrations.localhero.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.validation.constraints.NotBlank;

@Configuration
@ConfigurationProperties(prefix = "stayhome.integrations.localhero")
@EnableConfigurationProperties({LocalHeroProperties.class})
@Data
public class LocalHeroProperties {
    @NotBlank(message = "No cron expression has been defined")
    private String scrapeCron;

    @NotBlank(message = "No source url has been defined")
    private String sourceUrl;

    @NotBlank(message = "No target url has been defined")
    private String targetUrl;

    @NotBlank(message = "No Provider set")
    private String providerName;

    private Integer chunkSize = 10;
}
