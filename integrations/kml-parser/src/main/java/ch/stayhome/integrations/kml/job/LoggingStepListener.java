package ch.stayhome.integrations.kml.job;

import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;

@Slf4j
public class LoggingStepListener implements StepExecutionListener {

	@Override
	public void beforeStep(StepExecution stepExecution) {

	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		log.info("------------------------------------------------------------------------------------");
		log.info("Summary: " + stepExecution.getSummary());
		log.info("------------------------------------------------------------------------------------");

		return null;
	}

}
