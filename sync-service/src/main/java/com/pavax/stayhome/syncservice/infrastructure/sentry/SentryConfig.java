package com.pavax.stayhome.syncservice.infrastructure.sentry;

import io.sentry.spring.SentryExceptionResolver;
import io.sentry.spring.SentryServletContextInitializer;

import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Configuration
@Profile("!disable-sentry")
class SentryConfig {

	@Bean
	public HandlerExceptionResolver sentryExceptionResolver() {
		return new SentryExceptionResolver();
	}

	@Bean
	public ServletContextInitializer sentryServletContextInitializer() {
		return new SentryServletContextInitializer();
	}

	@Bean
	public SentryCustomHeaderFilter sentryCustomHeaderFilter() {
		return new SentryCustomHeaderFilter();
	}

}
