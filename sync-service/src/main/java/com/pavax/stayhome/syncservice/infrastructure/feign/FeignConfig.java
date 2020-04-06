package com.pavax.stayhome.syncservice.infrastructure.feign;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalancedRetryFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.backoff.BackOffPolicy;
import org.springframework.retry.backoff.ExponentialBackOffPolicy;

@Configuration
class FeignConfig {

	@Bean
	ApiTokenInterceptor basicAuthRequestInterceptor(@Value("${stayhome.api.token}") String apiToken) {
		return new ApiTokenInterceptor(apiToken);
	}

	@Bean
	LoadBalancedRetryFactory retryFactory() {
		return new LoadBalancedRetryFactory() {
			@Override
			public BackOffPolicy createBackOffPolicy(String service) {
				final ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
				backOffPolicy.setInitialInterval(3_000);
				backOffPolicy.setMultiplier(1.5);
				backOffPolicy.setMaxInterval(30_000);
				return backOffPolicy;
			}
		};
	}

}
