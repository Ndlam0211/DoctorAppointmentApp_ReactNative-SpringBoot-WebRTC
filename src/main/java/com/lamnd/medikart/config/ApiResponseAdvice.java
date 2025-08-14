package com.lamnd.medikart.config;

import com.lamnd.medikart.annotation.ApiSuccess;
import com.lamnd.medikart.dto.ApiResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true; // we'll decide in beforeBodyWrite
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {
        try {
            String path = request.getURI() != null ? request.getURI().getPath() : "";
            if (path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui") || path.startsWith("/actuator")) {
                return body; // don't wrap docs or actuator
            }
            if (body == null) return ApiResponse.success(null, "OK", "success");
            if (body instanceof ApiResponse) return body; // already wrapped
            if (body instanceof String) return body; // avoid StringHttpMessageConverter issues

            ApiSuccess meta = returnType != null ? returnType.getMethodAnnotation(ApiSuccess.class) : null;
            String code = meta != null ? meta.code() : "OK";
            String message = meta != null ? meta.message() : "success";
            return ApiResponse.success(body, code, message);
        } catch (Throwable t) {
            return body; // fail open to avoid breaking responses
        }
    }
}

