package ch.stayhome.integrations.localhero.job;

import java.util.Date;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableBatchProcessing
@EnableScheduling
@Slf4j
public class ImportBatch {
	private final LocalHeroProperties localHeroProperties;
	private final JobBuilderFactory jobBuilderFactory;
	private final StepBuilderFactory stepBuilderFactory;
	private final JobLauncher jobLauncher;

	public ImportBatch(final LocalHeroProperties localHeroProperties, final JobBuilderFactory jobBuilderFactory, final StepBuilderFactory stepBuilderFactory, final JobLauncher jobLauncher) {
		this.localHeroProperties = localHeroProperties;
		this.jobBuilderFactory = jobBuilderFactory;
		this.stepBuilderFactory = stepBuilderFactory;
		this.jobLauncher = jobLauncher;
	}

	@SneakyThrows
	@Scheduled(cron = "${stayhome.integrations.localhero.scrape-cron}")
	public void perform() {
		log.info("Import started at {}", new Date());

		JobParameters params = new JobParametersBuilder()
				.addString("ID", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();

		jobLauncher.run(importLocalHeroJob(), params);
	}

	@Bean
	public Job importLocalHeroJob() {
		return jobBuilderFactory.get("localHeroImportJob")
				.incrementer(new RunIdIncrementer())
				.flow(step1())
				.end()
				.build();
	}

	@Bean
	public Step step1() {
		return stepBuilderFactory.get("step1")
				.<LocalHeroPost, StayHomeEntry>chunk(localHeroProperties.getChunkSize())
				.reader(reader())
				.processor(processor())
				.writer(writer())
				.build();
	}

	@Bean
	public LocalHeroPostProcessor processor() {
		return new LocalHeroPostProcessor(localHeroProperties);
	}

	@Bean
	@StepScope
	public LocalHeroPostReader reader() {
		return new LocalHeroPostReader(localHeroProperties);
	}

	@Bean
	public ItemWriter<StayHomeEntry> writer() {
		return new StayHomeEntryWriter(localHeroProperties);
	}
}
