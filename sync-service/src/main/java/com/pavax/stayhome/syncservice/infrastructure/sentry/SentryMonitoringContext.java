package com.pavax.stayhome.syncservice.infrastructure.sentry;


import com.pavax.stayhome.syncservice.service.MonitoringContext;
import io.sentry.Sentry;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

@Aspect
@Component
class SentryMonitoringContext {

	private static final Logger LOGGER = LoggerFactory.getLogger(SentryMonitoringContext.class);

	private static final String VARIABLE_EXPRESSION_SEPERATOR = "=";

	@Around("@annotation(com.pavax.stayhome.syncservice.service.MonitoringContext)")
	Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
		final MethodSignature signature = (MethodSignature) joinPoint.getSignature();
		final MonitoringContext monitoringContext = signature.getMethod().getAnnotation(MonitoringContext.class);
		for (String monitoringVariableExpression : monitoringContext.variables()) {
			final String key = StringUtils.substringBefore(monitoringVariableExpression, VARIABLE_EXPRESSION_SEPERATOR);
			final String valueExpression = StringUtils.substringAfter(monitoringVariableExpression, VARIABLE_EXPRESSION_SEPERATOR);
			final Object value = getDynamicValue(signature.getParameterNames(), joinPoint.getArgs(), valueExpression);
			LOGGER.debug("Extracted Context Variable Key: {}, Value: {}", key, value);
			Sentry.getContext().addTag(key, String.valueOf(value));
		}
		return joinPoint.proceed();
	}

	public static Object getDynamicValue(String[] parameterNames, Object[] args, String expression) {
		ExpressionParser parser = new SpelExpressionParser();
		StandardEvaluationContext context = new StandardEvaluationContext();
		for (int i = 0; i < parameterNames.length; i++) {
			context.setVariable(parameterNames[i], args[i]);
		}
		return parser.parseExpression(expression).getValue(context, Object.class);
	}

}
