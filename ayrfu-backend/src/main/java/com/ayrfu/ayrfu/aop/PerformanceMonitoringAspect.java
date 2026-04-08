package com.ayrfu.ayrfu.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PerformanceMonitoringAspect {

    // Manually define the logger instead of using Lombok @Slf4j
    private static final Logger logger = LoggerFactory.getLogger(PerformanceMonitoringAspect.class);

    /**
     * Pointcut for all service methods
     */
    @Pointcut("execution(* com.ayrfu.ayrfu.service.impl.*.*(..))")
    private void forServicePackage() {}

    /**
     * Pointcut for all controller methods
     */
    @Pointcut("execution(* com.ayrfu.ayrfu.controller.*.*(..))")
    private void forControllerPackage() {}

    /**
     * Combined pointcut for service and controller methods
     */
    @Pointcut("forServicePackage() || forControllerPackage()")
    private void forServiceAndControllerFlow() {}

    /**
     * Around advice for performance monitoring
     */
    @Around("forServiceAndControllerFlow()")
    public Object measureExecutionTime(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        // Get method signature and construct method name
        String className = proceedingJoinPoint.getSignature().getDeclaringTypeName();
        String methodName = proceedingJoinPoint.getSignature().getName();
        String fullMethodName = className + "." + methodName;

        // Start timer
        long startTime = System.currentTimeMillis();

        // Execute the method
        Object result = proceedingJoinPoint.proceed();

        // End timer
        long endTime = System.currentTimeMillis();

        // Calculate execution time
        long executionTime = endTime - startTime;

        // Log performance information with different levels based on execution time
        if (executionTime > 1000) {
            logger.warn("PERFORMANCE: Method [{}] executed in {} ms", fullMethodName, executionTime);
        } else if (executionTime > 500) {
            logger.info("PERFORMANCE: Method [{}] executed in {} ms", fullMethodName, executionTime);
        } else {
            logger.debug("PERFORMANCE: Method [{}] executed in {} ms", fullMethodName, executionTime);
        }

        return result;
    }
}