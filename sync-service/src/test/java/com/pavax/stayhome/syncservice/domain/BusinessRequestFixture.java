package com.pavax.stayhome.syncservice.domain;

public final class BusinessRequestFixture {

	private BusinessRequestFixture() {
	}

	public static BusinessRequest test(String uuid) {
		return new BusinessRequest()
				.setUuid(uuid)
				.setDescription("Test Description")
				.setDelivery("Test Delivery")
				.setEmail("test@example.com")
				.setPhone("+41 123 45 67")
				.setContact("Test Contact")
				.setTtl(1000 * 60L);
	}
}
