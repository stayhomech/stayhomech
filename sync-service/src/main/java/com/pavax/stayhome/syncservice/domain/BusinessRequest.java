package com.pavax.stayhome.syncservice.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BusinessRequest {

	private String uuid;

	private Long ttl;

	@JsonProperty("source_uuid")
	private String sourceUUid;

	private String name;

	private String description;

	private String address;

	private String location;

	private String contact;

	private String website;

	private String phone;

	private String email;

	private String category;

	private String delivery;

	private String checksum;

	private String lang;

	private String status;

	public String getUuid() {
		return uuid;
	}

	public BusinessRequest setUuid(String uuid) {
		this.uuid = uuid;
		return this;
	}

	public Long getTtl() {
		return ttl;
	}

	public BusinessRequest setTtl(Long ttl) {
		this.ttl = ttl;
		return this;
	}

	public String getSourceUUid() {
		return sourceUUid;
	}

	public BusinessRequest setSourceUUid(String sourceUUid) {
		this.sourceUUid = sourceUUid;
		return this;
	}

	public String getName() {
		return name;
	}

	public BusinessRequest setName(String name) {
		this.name = name;
		return this;
	}

	public String getDescription() {
		return description;
	}

	public BusinessRequest setDescription(String description) {
		this.description = description;
		return this;
	}

	public String getLocation() {
		return location;
	}

	public BusinessRequest setLocation(String location) {
		this.location = location;
		return this;
	}

	public String getContact() {
		return contact;
	}

	public BusinessRequest setContact(String contact) {
		this.contact = contact;
		return this;
	}

	public String getWebsite() {
		return website;
	}

	public BusinessRequest setWebsite(String website) {
		this.website = website;
		return this;
	}

	public String getPhone() {
		return phone;
	}

	public BusinessRequest setPhone(String phone) {
		this.phone = phone;
		return this;
	}

	public String getEmail() {
		return email;
	}

	public BusinessRequest setEmail(String email) {
		this.email = email;
		return this;
	}

	public String getCategory() {
		return category;
	}

	public BusinessRequest setCategory(String category) {
		this.category = category;
		return this;
	}

	public String getDelivery() {
		return delivery;
	}

	public BusinessRequest setDelivery(String delivery) {
		this.delivery = delivery;
		return this;
	}

	public String getChecksum() {
		return checksum;
	}

	public BusinessRequest setChecksum(String checksum) {
		this.checksum = checksum;
		return this;
	}

	public String getLang() {
		return lang;
	}

	public BusinessRequest setLang(String lang) {
		this.lang = lang;
		return this;
	}

	public String getStatus() {
		return status;
	}

	public BusinessRequest setStatus(String status) {
		this.status = status;
		return this;
	}

	public String getAddress() {
		return address;
	}

	public BusinessRequest setAddress(String address) {
		this.address = address;
		return this;
	}

	public void prepareForSaving() {
		this.address = orEmpty(this.address);
		this.description = sanitizeText(this.description);
	}

	private String orEmpty(String value) {
		return value == null ? "" : value;
	}

	/**
	 * remove all special-characters
	 *
	 * @param text to sanitize
	 *
	 * @return sanitized text
	 */
	private String sanitizeText(String text) {
		if (text == null) {
			return "";
		}
		return text
				// remove all non-four-byte-UTF-8: https://stackoverflow.com/a/10574318
				.replaceAll("[^\\u0000-\\uFFFF]", "")
				.replace("\n", "")
				.trim();
	}

	@Override
	public String toString() {
		return "BusinessRequest{" +
				"uuid='" + uuid + '\'' +
				", ttl=" + ttl +
				", sourceUUid='" + sourceUUid + '\'' +
				", name='" + name + '\'' +
				", description='" + description + '\'' +
				", address='" + address + '\'' +
				", location='" + location + '\'' +
				", contact='" + contact + '\'' +
				", website='" + website + '\'' +
				", phone='" + phone + '\'' +
				", email='" + email + '\'' +
				", category='" + category + '\'' +
				", delivery='" + delivery + '\'' +
				", checksum='" + checksum + '\'' +
				", lang='" + lang + '\'' +
				", status='" + status + '\'' +
				'}';
	}

}
