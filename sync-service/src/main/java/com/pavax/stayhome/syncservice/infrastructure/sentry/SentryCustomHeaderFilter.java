package com.pavax.stayhome.syncservice.infrastructure.sentry;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.sentry.Sentry;
import org.apache.commons.lang3.StringUtils;

import org.springframework.web.filter.OncePerRequestFilter;

class SentryCustomHeaderFilter extends OncePerRequestFilter {

	public static final String PROVIDER_NAME = "X-SYNC-PROVIDER-NAME";

	public static final String PROVIDER_ENTRY_ID = "X-SYNC-PROVIDER-ENTRY-ID";

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		addTag("provider_name", request.getHeader(PROVIDER_NAME));
		addTag("entry_id", request.getHeader(PROVIDER_ENTRY_ID));
		filterChain.doFilter(request, response);
	}

	private void addTag(String key, String value) {
		if (StringUtils.isNotBlank(value)) {
			Sentry.getContext().addTag(key, value);
		}
	}
}
