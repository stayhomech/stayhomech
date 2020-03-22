package com.pavax.stayhome.syncservice.service;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class BusinessEntryDto {

	@Size(max = 255)
	private String categories;

	@Size(max = 255)
	private String delivery;

	@Size(max = 1000)
	@NotBlank
	private String description;

	@NotBlank
	@Size(max = 255)
	private String contact;

	@Size(max = 255)
	private String email;

	@NotNull
	@Size(max = 255)
	private String id;

	@Size(max = 255)
	@NotBlank
	private String name;

	@Size(max = 255)
	private String phone;

	@NotBlank
	@Size(max = 20)
	private String providerName;

	@Size(max = 255)
	private String website;

	@Size(max = 255)
	private String location;

	private Long ttl;

	public String getCategories() {
		return categories;
	}

	public BusinessEntryDto setCategories(String categories) {
		this.categories = categories;
		return this;
	}

	public String getDelivery() {
		return delivery;
	}

	public BusinessEntryDto setDelivery(String delivery) {
		this.delivery = delivery;
		return this;
	}

	public String getDescription() {
		return description;
	}

	public BusinessEntryDto setDescription(String description) {
		this.description = description;
		return this;
	}

	public String getContact() {
		return contact;
	}

	public BusinessEntryDto setContact(String contact) {
		this.contact = contact;
		return this;
	}

	public String getEmail() {
		return email;
	}

	public BusinessEntryDto setEmail(String email) {
		this.email = email;
		return this;
	}

	public String getId() {
		return id;
	}

	public BusinessEntryDto setId(String id) {
		this.id = id;
		return this;
	}

	public String getName() {
		return name;
	}

	public BusinessEntryDto setName(String name) {
		this.name = name;
		return this;
	}

	public String getPhone() {
		return phone;
	}

	public BusinessEntryDto setPhone(String phone) {
		this.phone = phone;
		return this;
	}

	public String getProviderName() {
		return providerName;
	}

	public BusinessEntryDto setProviderName(String providerName) {
		this.providerName = providerName;
		return this;
	}

	public String getWebsite() {
		return website;
	}

	public BusinessEntryDto setWebsite(String website) {
		this.website = website;
		return this;
	}

	public String getLocation() {
		return location;
	}

	public BusinessEntryDto setLocation(String location) {
		this.location = location;
		return this;
	}

	public Long getTtl() {
		return ttl;
	}

	public BusinessEntryDto setTtl(Long ttl) {
		this.ttl = ttl;
		return this;
	}
}
