package ch.stayhome.integrations.kml.job;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;

import javax.validation.Validator;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import ch.stayhome.integrations.kml.config.KMLImporterProperties;
import ch.stayhome.integrations.kml.job.dto.PlacemarkType;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.step.tasklet.TaskletStep;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.xml.StaxEventItemReader;
import org.springframework.batch.item.xml.builder.StaxEventItemReaderBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.oxm.Unmarshaller;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.scheduling.annotation.Scheduled;


@Configuration
@EnableConfigurationProperties(KMLImporterProperties.class)
@Slf4j
public class KMLImporterJobConfig {

	public static final int CHUNK_SIZE = 100;

	private final KMLImporterProperties kmlImporterProperties;

	private final JobBuilderFactory jobBuilderFactory;

	private final StepBuilderFactory stepBuilderFactory;

	private final JobLauncher jobLauncher;

	private final Validator validator;

	public KMLImporterJobConfig(KMLImporterProperties kmlImporterProperties, JobBuilderFactory jobBuilderFactory, StepBuilderFactory stepBuilderFactory, JobLauncher jobLauncher, Validator validator) {
		this.kmlImporterProperties = kmlImporterProperties;
		this.jobBuilderFactory = jobBuilderFactory;
		this.stepBuilderFactory = stepBuilderFactory;
		this.jobLauncher = jobLauncher;
		this.validator = validator;
	}

	@SneakyThrows
	@Scheduled(cron = "${stayhome.integrations.kml.scrape-cron}")
	public void perform() {
		log.info("Import started at {}", new Date());
		JobParameters params = new JobParametersBuilder()
				.addString("ID", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();
		jobLauncher.run(importKMLJob(), params);
	}

	@Bean
	public Job importKMLJob() throws IOException {
		return jobBuilderFactory.get("kml-import-job")
				.incrementer(new RunIdIncrementer())
				.start(importFlow()).build()
				.build();
	}

	private Flow importFlow() {
		return new FlowBuilder<Flow>("kml-import-flow")
				.start(downloadFile(this.kmlImporterProperties.getDownloadUrl()))
				.next(this.transformFile())
				.next(this.importFile())
				.end();
	}

	private TaskletStep downloadFile(String url) {
		return this.stepBuilderFactory.get("xml-download-step")
				.tasklet((contribution, chunkContext) -> {
					try {
						final Path kmlFile = File.createTempFile("xml-importer-raw", ".kml").toPath();
						Files.copy(new URL(url).openStream(), kmlFile, StandardCopyOption.REPLACE_EXISTING);
						chunkContext.getStepContext().getStepExecution().getJobExecution().getExecutionContext().put("file.xml.raw", kmlFile.toString());
					} catch (IOException e) {
						throw new RuntimeException("Could not download file: " + url, e);
					}
					return RepeatStatus.FINISHED;
				})
				.build();
	}

	private TaskletStep transformFile() {
		return this.stepBuilderFactory.get("xml-transform-step")
				.tasklet((contribution, chunkContext) -> {
					final Path inputFile = Paths.get((String) chunkContext.getStepContext().getJobExecutionContext().get("file.xml.raw"));
					final Path outPutFile = File.createTempFile("xml-importer-transformed", ".xml").toPath();
					TransformerFactory factory = TransformerFactory.newInstance();
					Transformer transformer = factory.newTransformer(new StreamSource(new ClassPathResource("kml-placemark-transformation.xslt").getInputStream()));
					Source source = new StreamSource(Files.newInputStream(inputFile));
					transformer.transform(source, new StreamResult(outPutFile.toFile()));
					chunkContext.getStepContext().getStepExecution().getJobExecution().getExecutionContext().put("file.xml.transformed", outPutFile.toString());
					return RepeatStatus.FINISHED;
				})
				.build();
	}

	private TaskletStep importFile() {
		return this.stepBuilderFactory.get("kml-import-step")
				.<PlacemarkType, StayHomeEntry>chunk(CHUNK_SIZE)
				.reader(this.reader("test"))
				.processor(this.processor())
				.writer(this.writer())
				.listener(new LoggingStepListener())
				.build();
	}

	@Bean
	@StepScope
	public StaxEventItemReader<PlacemarkType> reader(@Value("#{jobExecutionContext['file.xml.transformed']}") String path) {
		return new StaxEventItemReaderBuilder<PlacemarkType>()
				.addFragmentRootElements("Placemark")
				.resource(new FileSystemResource(path))
				.unmarshaller(this.unmarshaller())
				.name("placemark-reader")
				.build();
	}

	private Unmarshaller unmarshaller() {
		final Jaxb2Marshaller jaxb2Marshaller = new Jaxb2Marshaller();
		jaxb2Marshaller.setClassesToBeBound(PlacemarkType.class);
		return jaxb2Marshaller;
	}

	private ItemWriter<StayHomeEntry> writer() {
		return new StayHomeEntryWriter(this.kmlImporterProperties.getSyncServiceUrl());
	}

	private ItemProcessor<PlacemarkType, StayHomeEntry> processor() {
		return new KMLItemProcessor(this.validator);
	}

}
