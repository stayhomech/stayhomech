package com.pavax.stayhome.syncservice.domain;

import java.util.Objects;

public class PostalCode {

	private String id;

	private String name;

	private String npa;

	public String getId() {
		return id;
	}

	public PostalCode setId(String id) {
		this.id = id;
		return this;
	}

	public String getName() {
		return name;
	}

	public PostalCode setName(String name) {
		this.name = name;
		return this;
	}

	public String getNpa() {
		return npa;
	}

	public PostalCode setNpa(String npa) {
		this.npa = npa;
		return this;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) { return true; }
		if (o == null || getClass() != o.getClass()) { return false; }
		PostalCode that = (PostalCode) o;
		return Objects.equals(id, that.id);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public String toString() {
		return "PostalCode{" +
				"id='" + id + '\'' +
				", name='" + name + '\'' +
				", npa='" + npa + '\'' +
				'}';
	}
}
