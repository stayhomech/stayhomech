package ch.stayhome.integrations.utils;

import com.google.i18n.phonenumbers.PhoneNumberMatch;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import com.linkedin.urls.Url;
import com.linkedin.urls.detection.UrlDetector;
import com.linkedin.urls.detection.UrlDetectorOptions;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.trim;


public class ContactInformationGuesser {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+");

    private final PhoneNumberUtil util = PhoneNumberUtil.getInstance();

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

    public String extractWebsite(final String text) {
        final String cleanedupText = cleanupString(text);
        final List<Url> foundUrls = new UrlDetector(cleanedupText, UrlDetectorOptions.HTML).detect();


        if (foundUrls.isEmpty()) {
            return "";
        } else {
            Optional<Url> optionalUrl = foundUrls.stream()
                    .filter(url -> {
                        // prefer https
                        if (url.getScheme().equalsIgnoreCase("https")) {
                            return true;
                        }

                        // if no https, double check, whether an email address was raped, since
                        // UrlDetector creates this abominaton: foo@example.com --> http://foo@example.com
                        return cleanedupText.contains(url.getFullUrl());
                    })
                    .findFirst()
                    .or(Optional::empty);

            return optionalUrl.isPresent() ? optionalUrl.get().getFullUrl() : "";
        }
    }

    /**
     * This address parser is only suited for simple, structured text. Parsing an address from a more complex string
     * proves very difficult. Too difficult to implement in the little time we have.
     *
     * @param text text to parse, like "my-street 52, more text"
     * @return String whatever comes before the first comma
     */
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
