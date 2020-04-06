package ch.stayhome.integrations.kml.job;

import static org.apache.commons.lang3.StringUtils.trim;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.i18n.phonenumbers.PhoneNumberMatch;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;


public class ContactInformationGuesser {

	private final PhoneNumberUtil util = PhoneNumberUtil.getInstance();

	// copied from: https://stackoverflow.com/a/17773849
	private static final Pattern WEBSITE_PATTER = Pattern.compile("(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})");

	private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+");

	public String extractPhoneNumber(String text) {
		text = cleanupString(text);
		final Iterable<PhoneNumberMatch> numbers = util.findNumbers(text, "CH");
		final List<String> results = new ArrayList<>();
		numbers.forEach(phoneNumberMatch -> {
			final Phonenumber.PhoneNumber number = phoneNumberMatch.number();
			results.add(util.format(number, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL));
		});
		return results.isEmpty() ? "" : trim(results.get(0));
	}

	public String extractEmail(String text) {
		text = cleanupString(text);
		Matcher matcher = EMAIL_PATTERN.matcher(text);
		final List<String> results = new ArrayList<>();
		while (matcher.find()) {
			results.add(matcher.group());
		}
		return results.isEmpty() ? "" : trim(results.get(0));
	}

	public String extractWebsite(String text) {
		text = cleanupString(text);
		Matcher matcher = WEBSITE_PATTER.matcher(text);
		final List<String> results = new ArrayList<>();
		while (matcher.find()) {
			results.add(matcher.group());
		}
		return results.isEmpty() ? "" : trim(results.get(0));
	}

	public String extractStreet(String text) {
		text = cleanupString(text);
		final String[] split = text.split(",");
		return split.length > 1 ? trim(split[0]) : "";
	}

	private String cleanupString(String text) {
		return text
				.replace("\n", "")
				.trim();
	}

}
