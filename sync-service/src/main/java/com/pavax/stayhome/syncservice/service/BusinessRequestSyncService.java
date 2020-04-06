package com.pavax.stayhome.syncservice.service;

import com.pavax.stayhome.syncservice.domain.BusinessRequest;
import com.pavax.stayhome.syncservice.domain.BusinessRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

@Service
@EnableConfigurationProperties(SyncServiceProperties.class)
public class BusinessRequestSyncService {

	private static final Logger LOGGER = LoggerFactory.getLogger(BusinessRequestSyncService.class);

	private static final String FALLBACK_LANG = "en";

	private final BusinessRequestRepository businessRequestRepository;

	private final SyncServiceProperties syncServiceProperties;

	private final LanguageDetectionService languageDetectionService;

	private final ChecksumCalculator checksumCalculator;

	public BusinessRequestSyncService(
			BusinessRequestRepository businessRequestRepository,
			SyncServiceProperties syncServiceProperties,
			LanguageDetectionService languageDetectionService,
			ChecksumCalculator checksumCalculator) {
		this.businessRequestRepository = businessRequestRepository;
		this.syncServiceProperties = syncServiceProperties;
		this.languageDetectionService = languageDetectionService;
		this.checksumCalculator = checksumCalculator;
	}

	public void sync(BusinessRequestDto businessRequestDto) {
		final BusinessRequest businessRequest = prepareBusinessRequest(businessRequestDto);
		final String newChecksum = this.checksumCalculator.calculate(businessRequestDto);
		if (isNew(businessRequest)) {
			businessRequest.setChecksum(newChecksum);
			this.businessRequestRepository.save(businessRequest);
		} else {
			if (!businessRequest.getChecksum().equals(newChecksum)) {
				LOGGER.info("Checksum changed for Request: {}", businessRequest);
			}
			businessRequest.setChecksum(newChecksum);
			this.businessRequestRepository.update(businessRequest);
		}
	}

	private BusinessRequest prepareBusinessRequest(BusinessRequestDto businessRequestDto) {
		final String correlationId = extractCorrelationId(businessRequestDto);
		return this.businessRequestRepository.findBySourceId(correlationId)
				.orElse(new BusinessRequest())
				.setSourceUUid(correlationId)
				.setName(businessRequestDto.getName())
				.setDescription(businessRequestDto.getDescription())
				.setLocation(businessRequestDto.getLocation())
				.setAddress(businessRequestDto.getAddress())
				.setWebsite(businessRequestDto.getWebsite())
				.setPhone(businessRequestDto.getPhone())
				.setEmail(businessRequestDto.getEmail())
				.setContact(businessRequestDto.getContact())
				.setCategory(businessRequestDto.getCategories())
				.setDelivery(businessRequestDto.getDelivery())
				.setLang(businessRequestDto.getLanguage() != null ? businessRequestDto.getLanguage().getKey() : this.determineLanguage(businessRequestDto))
				.setTtl(businessRequestDto.getTtl() != null ? businessRequestDto.getTtl() : this.syncServiceProperties.getDefaultTimeToLive().getSeconds());
	}

	private String determineLanguage(BusinessRequestDto businessRequestDto) {
		return this.languageDetectionService.detect(businessRequestDto.getName(), businessRequestDto.getDescription())
				.map(Language::getKey)
				.orElse(FALLBACK_LANG);
	}

	private boolean isNew(BusinessRequest businessRequest) {
		return businessRequest.getUuid() == null;
	}

	private String extractCorrelationId(BusinessRequestDto businessRequestDto) {
		return String.format("%s-%s", businessRequestDto.getProviderName(), businessRequestDto.getId());
	}

}
