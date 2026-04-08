package com.ayrfu.ayrfu.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    // Manually define the logger instead of using Lombok @Slf4j
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

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
     * Pointcut for all repository methods
     */
    @Pointcut("execution(* com.ayrfu.ayrfu.repository.*.*(..))")
    private void forRepositoryPackage() {}

    /**
     * Combined pointcut for service, controller, and repository methods
     */
    @Pointcut("forServicePackage() || forControllerPackage() || forRepositoryPackage()")
    private void forAppFlow() {}

    /**
     * Run this before the method execution
     */
    @Before("forAppFlow()")
    public void before(JoinPoint joinPoint) {
        // Display method we are calling
        String methodName = joinPoint.getSignature().toShortString();
        logger.info("===> in @Before: calling method: {}", methodName);

        // Display the arguments to the method
        Object[] args = joinPoint.getArgs();
        if (args.length > 0) {
            logger.info("===> arguments:");
            Arrays.stream(args)
                    .forEach(arg -> {
                        if (arg != null) {
                            logger.info("=====> {}", arg);
                        } else {
                            logger.info("=====> null argument");
                        }
                    });
        } else {
            logger.info("===> no arguments for this method");
        }
    }

    /**
     * Run this after the method returns (success execution)
     */
    @AfterReturning(
            pointcut = "forAppFlow()",
            returning = "result"
    )
    public void afterReturning(JoinPoint joinPoint, Object result) {
        // Display method we are returning from
        String methodName = joinPoint.getSignature().toShortString();
        logger.info("===> in @AfterReturning: from method: {}", methodName);

        // Display data returned
        if (result != null) {
            logger.info("===> result: {}", result);
        } else {
            logger.info("===> null result");
        }
    }

    /**
     * Run this after throwing an exception
     */
    @AfterThrowing(
            pointcut = "forAppFlow()",
            throwing = "exception"
    )
    public void afterThrowing(JoinPoint joinPoint, Throwable exception) {
        // Display method we are throwing from
        String methodName = joinPoint.getSignature().toShortString();
        logger.error("===> in @AfterThrowing: from method: {}", methodName);

        // Display the exception
        logger.error("===> exception: {}", exception.getMessage());
    }
}