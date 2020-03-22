package com.pavax.stayhome.syncservice.infrastructure.feign;

public class PostalCodeNotFoundException extends RuntimeException {

	public PostalCodeNotFoundException(String zipCode) {
		super("No PostalCode found for zipCode: " + zipCode);
	}

}
