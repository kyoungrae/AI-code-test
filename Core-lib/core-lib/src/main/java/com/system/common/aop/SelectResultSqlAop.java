package com.system.common.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/*
* writer : 이경태
* text : 쿼리 조회 결과값 가공 처리 AOP (현재는 비활성화, Global Jackson 설정 사용)
* */
@Aspect
@Component
@Order(2)
public class SelectResultSqlAop {

    @Around("execution(* com..*Service.*(..))")
    public Object transFormResultDataAop(ProceedingJoinPoint joinPoint) throws Throwable {
        return joinPoint.proceed();
    }
}
