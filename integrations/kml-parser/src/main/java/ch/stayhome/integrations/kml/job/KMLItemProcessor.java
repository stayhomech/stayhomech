package ch.stayhome.integrations.kml.job;

import static org.springframework.util.DigestUtils.md5DigestAsHex;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;

import ch.stayhome.integrations.kml.job.StayHomeEntry.StayHomeEntryBuilder;
import ch.stayhome.integrations.kml.job.dto.DataType;
import ch.stayhome.integrations.kml.job.dto.ExtendedDataType;
import ch.stayhome.integrations.kml.job.dto.PlacemarkType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import org.springframework.batch.item.ItemProcessor;

@Slf4j
public class KMLItemProcessor implements ItemProcessor<PlacemarkType, StayHomeEntry> {

	public static final String PROVIDER_NAME = "aargauerzeitung";

	public static final String NOT_AVAILABLE = "n/a";

	private final ContactInformationGuesser contactInformationGuesser = new ContactInformationGuesser();

	private final Validator validator;

	public KMLItemProcessor(Validator validator) {
		this.validator = validator;
	}

	@Override
	public StayHomeEntry process(PlacemarkType item) {
		final Map<String, String> dataMap = this.extendedDataMap(item.getExtendedData());
		final String id = extractId(item);
		final StayHomeEntryBuilder builder = StayHomeEntry.builder()
				.id(id)
				.name(item.getName())
				.providerName(PROVIDER_NAME)
				.description(dataMap.get("Beschreibung"))
				.categories(NOT_AVAILABLE)
				.delivery(NOT_AVAILABLE);
		this.parseContactData(builder, dataMap.get("Kontakt"));
		this.parseAddressData(builder, dataMap.get("Adresse"));

		return toStayHomeEntry(builder, id);
	}

	private StayHomeEntry toStayHomeEntry(StayHomeEntryBuilder builder, String itemId) {
		final StayHomeEntry stayHomeEntry = builder.build();
		Set<ConstraintViolation<StayHomeEntry>> violations = validator.validate(stayHomeEntry);
		if (!violations.isEmpty()) {
			log.warn("Item: {} has constraint violations: {}", itemId, violations);
			return null;
		}
		return stayHomeEntry;
	}

	private String extractId(PlacemarkType item) {
		final String coordinates = item.getPoint().getCoordinates()
				.replace("\n", "")
				.replace(",", "_")
				.trim();
		final String name = item.getName()
				.replace("\n", "")
				.trim();
		return String.format("%s_%s", coordinates, md5DigestAsHex(name.getBytes()));
	}

	private void parseAddressData(StayHomeEntryBuilder builder, String adresse) {
		if (StringUtils.isNotBlank(adresse)) {
			builder.address(contactInformationGuesser.extractStreet(adresse))
					.location(adresse);
		}
	}

	public void parseContactData(StayHomeEntryBuilder builder, String contact) {
		if (StringUtils.isNotBlank(contact)) {
			builder.contact(contact)
					.email(contactInformationGuesser.extractEmail(contact))
					.phone(contactInformationGuesser.extractPhoneNumber(contact))
					.website(contactInformationGuesser.extractWebsite(contact));
		}
	}

	public Map<String, String> extendedDataMap(ExtendedDataType extendedData) {
		return extendedData.getData().stream()
				.collect(Collectors.toMap(DataType::getName, DataType::getValue));
	}

}
