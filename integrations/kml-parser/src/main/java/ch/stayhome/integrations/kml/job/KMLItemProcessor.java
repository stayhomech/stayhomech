package ch.stayhome.integrations.kml.job;

import java.time.Duration;
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

import org.springframework.batch.item.ItemProcessor;

@Slf4j
public class KMLItemProcessor implements ItemProcessor<PlacemarkType, StayHomeEntry> {

	public static final long TTL = Duration.ofDays(5).getSeconds();

	private final ContactInformationGuesser contactInformationGuesser = new ContactInformationGuesser();

	private final Validator validator;

	public KMLItemProcessor(Validator validator) {
		this.validator = validator;
	}

	@Override
	public StayHomeEntry process(PlacemarkType item) {
		final Map<String, String> dataMap = this.extendedDataMap(item.getExtendedData());
		final StayHomeEntryBuilder builder = StayHomeEntry.builder()
				.id(extractId(item))
				.name(item.getName())
				.providerName("aargauerzeitung")
				.description(dataMap.get("Beschreibung"))
				.address(contactInformationGuesser.extractStreet(dataMap.get("Adresse")))
				.location(dataMap.get("Adresse"))
				.categories("n/a")
				.delivery("n/a")
				.ttl(TTL);
		this.parseKontakt(dataMap.get("Kontakt"), builder);

		final StayHomeEntry stayHomeEntry = builder.build();
		Set<ConstraintViolation<StayHomeEntry>> violations = validator.validate(stayHomeEntry);
		if (!violations.isEmpty()) {
			log.warn("Item: {} has constraint violations: {}", item.getName(), violations);
			return null;
		}
		return stayHomeEntry;
	}

	private String extractId(PlacemarkType item) {
		return item.getPoint().getCoordinates()
				.replace("\n", "")
				.replace(",", "_")
				.trim();
	}

	public StayHomeEntryBuilder parseKontakt(String contact, StayHomeEntryBuilder builder) {
		if (contact != null) {
			builder.contact(contact)
					.email(contactInformationGuesser.extractEmail(contact))
					.phone(contactInformationGuesser.extractPhoneNumber(contact))
					.website(contactInformationGuesser.extractWebsite(contact));
		}
		return builder;
	}

	public Map<String, String> extendedDataMap(ExtendedDataType extendedData) {
		return extendedData.getData().stream()
				.collect(Collectors.toMap(DataType::getName, DataType::getValue));
	}

}
