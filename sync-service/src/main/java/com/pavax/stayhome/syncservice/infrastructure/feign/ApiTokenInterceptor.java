package com.pavax.stayhome.syncservice.infrastructure.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;

class ApiTokenInterceptor implements RequestInterceptor {

	private final String headerValue;

	public ApiTokenInterceptor(String token) {
		this.headerValue = String.format("Token %s", token);
	}

	@Override
	public void apply(RequestTemplate template) {
		template.header("Authorization", this.headerValue);
	}
}
