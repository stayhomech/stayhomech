package com.pavax.stayhome.syncservice.domain;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BusinessRequest {

	private String uuid;

	private boolean handled;

	private boolean deleted;

	private LocalDateTime creation;

	private LocalDateTime update;

	private Long ttl;

	@JsonProperty("source_uuid")
	private String sourceUUid;

	private String name;

	private String description;

	private String location;

	private String contact;

	private String website;

	private String phone;

	private String email;

	private String category;

	private String delivery;

	private String checkSum;

	public String getUuid() {
		return uuid;
	}

	public BusinessRequest setUuid(String uuid) {
		this.uuid = uuid;
		return this;
	}

	public boolean isHandled() {
		return handled;
	}

	public BusinessRequest setHandled(boolean handled) {
		this.handled = handled;
		return this;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public BusinessRequest setDeleted(boolean deleted) {
		this.deleted = deleted;
		return this;
	}

	public LocalDateTime getCreation() {
		return creation;
	}

	public BusinessRequest setCreation(LocalDateTime creation) {
		this.creation = creation;
		return this;
	}

	public LocalDateTime getUpdate() {
		return update;
	}

	public BusinessRequest setUpdate(LocalDateTime update) {
		this.update = update;
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

	public String getCheckSum() {
		return checkSum;
	}

	public BusinessRequest setCheckSum(String checkSum) {
		this.checkSum = checkSum;
		return this;
	}
}
