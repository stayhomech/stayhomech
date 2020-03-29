package ch.stayhome.integrations.localhero.config;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "stayhome.integrations.localhero")
@EnableConfigurationProperties({LocalHeroProperties.class})
@Data
public class LocalHeroProperties {
    @NotBlank(message = "No cron expression has been defined in application.yml")
    private String scrapeCron;

    @NotEmpty
    private List<String> sourceUrls;
    
    @NotBlank(message = "No rest route has been defined in application.yml")
    private String restRoute;

    @NotBlank(message = "No target url has been defined in application.yml")
    private String targetUrl;

    @NotBlank(message = "No provider name has been defined in application.yml")
    private String providerName;

    private Integer chunkSize = 10;

    @NotNull
    private Integer ttlSeconds;
}
