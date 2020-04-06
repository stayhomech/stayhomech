package com.pavax.stayhome.syncservice.infrastructure.checksum;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.springframework.util.StringUtils;

class ChecksumBuilder {

	private final List<String> values = new ArrayList<>();

	private final Function<String, String> checksumFunction;

	public ChecksumBuilder(Function<String, String> checksumFunction) {
		this.checksumFunction = checksumFunction;
	}

	public ChecksumBuilder append(String value) {
		if (!StringUtils.isEmpty(value)) {
			this.values.add(value);
		}
		return this;
	}

	public String toCheckSum() {
		final String input = String.join(",", values);
		return checksumFunction.apply(input);
	}

}
