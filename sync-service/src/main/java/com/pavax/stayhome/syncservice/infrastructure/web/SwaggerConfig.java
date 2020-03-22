package com.pavax.stayhome.syncservice.infrastructure.web;

import static springfox.documentation.builders.PathSelectors.regex;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableSwagger2
class SwaggerConfig {

	@Value("${management.endpoints.web.base-path}")
	String managementContextPath;

	@Bean
	public Docket publicApi() {
		return new Docket(DocumentationType.SWAGGER_2)
				.select()
				.paths(regex("/api/.*"))
				.build()
				.directModelSubstitute(LocalDate.class, java.sql.Date.class)
				.directModelSubstitute(LocalDateTime.class, java.util.Date.class)
				;
	}

	@Bean
	public Docket managementApi() {
		return new Docket(DocumentationType.SWAGGER_2)
				.groupName("manage-api")
				.select()
				.paths(regex(managementContextPath + ".*"))
				.build()
				.ignoredParameterTypes(Map.class)
				;
	}

}
