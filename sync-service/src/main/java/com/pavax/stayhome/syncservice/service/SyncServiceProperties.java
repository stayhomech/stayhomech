package com.pavax.stayhome.syncservice.service;

import java.time.Duration;

import javax.validation.constraints.NotNull;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sync-service")
public class SyncServiceProperties {

	@NotNull
	private Duration defaultTimeToLive = Duration.ofDays(3);

	public Duration getDefaultTimeToLive() {
		return defaultTimeToLive;
	}

	public SyncServiceProperties setDefaultTimeToLive(Duration defaultTimeToLive) {
		this.defaultTimeToLive = defaultTimeToLive;
		return this;
	}
}
