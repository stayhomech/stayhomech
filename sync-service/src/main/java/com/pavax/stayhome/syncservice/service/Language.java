package com.pavax.stayhome.syncservice.service;

import java.util.Arrays;
import java.util.Optional;

public enum Language {
	ENGLISH("en"),
	FRENCH("fr"),
	GERMAN("de"),
	ITALIAN("it");

	private final String key;

	Language(String key) {
		this.key = key;
	}

	public static Optional<Language> of(String key) {
		return Arrays.stream(Language.values())
				.filter(language -> key.equalsIgnoreCase(language.key))
				.findFirst();
	}

	public String getKey() {
		return key;
	}

}
