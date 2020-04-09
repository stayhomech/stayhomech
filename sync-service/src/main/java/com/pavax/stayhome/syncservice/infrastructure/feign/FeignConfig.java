package com.pavax.stayhome.syncservice.infrastructure.feign;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class FeignConfig {

	@Bean
	ApiTokenInterceptor basicAuthRequestInterceptor(@Value("${stayhome.api.token}") String apiToken) {
		return new ApiTokenInterceptor(apiToken);
	}

}
