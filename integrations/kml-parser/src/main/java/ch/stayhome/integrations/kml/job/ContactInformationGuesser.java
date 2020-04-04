package ch.stayhome.integrations.kml.job;

import static org.apache.commons.lang3.StringUtils.trim;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.i18n.phonenumbers.PhoneNumberMatch;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import org.apache.commons.lang3.StringUtils;


public class ContactInformationGuesser {

	private final PhoneNumberUtil util = PhoneNumberUtil.getInstance();

	public String extractPhoneNumber(String text) {
		text = StringUtils.chomp(text);
		final Iterable<PhoneNumberMatch> numbers = util.findNumbers(text, "CH");
		final List<String> results = new ArrayList<>();
		numbers.forEach(phoneNumberMatch -> {
			final Phonenumber.PhoneNumber number = phoneNumberMatch.number();
			results.add(util.format(number, PhoneNumberUtil.PhoneNumberFormat.INTERNATIONAL));
		});
		return results.isEmpty() ? "" : trim(results.get(0));
	}

	public String extractEmail(String text) {
		text = StringUtils.chomp(text);
		Matcher m = Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+").matcher(text);
		final List<String> results = new ArrayList<>();
		while (m.find()) {
			results.add(m.group());
		}
		return results.isEmpty() ? "" : trim(results.get(0));
	}

	public String extractWebsite(String text) {
		text = StringUtils.chomp(text);
		Matcher m = Pattern.compile("(https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\\.[^\\s]{2,}|https?:\\/\\/(?:www\\.|(?!www))[a-zA-Z0-9]+\\.[^\\s]{2,}|www\\.[a-zA-Z0-9]+\\.[^\\s]{2,})").matcher(text);
		final List<String> results = new ArrayList<>();
		while (m.find()) {
			results.add(m.group());
		}
		return results.isEmpty() ? "" : trim(results.get(0));
	}

	public String extractStreet(String text) {
		text = StringUtils.chomp(text);
		final String[] split = text.split(",");
		return split.length > 1 ? trim(split[0]) : "";
	}

	/*
	public String extractLocation(String text) {
		Matcher m = Pattern.compile("[0-9]{4}(\\s?.*)?").matcher(text);
		final List<String> results = new ArrayList<>();
		while (m.find()) {
			results.add(m.group());
		}
		return results.isEmpty() ? text : StringUtils.trim(results.get(0));
	}*/

}
