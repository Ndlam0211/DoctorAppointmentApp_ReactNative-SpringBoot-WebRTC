package com.lamnd.medikart.exception;

import com.lamnd.medikart.dto.ApiResponse;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ApiResponse.error("NOT_FOUND", ex.getMessage(), meta(request, null)), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(BadRequestException ex, WebRequest request) {
        return new ResponseEntity<>(ApiResponse.error("BAD_REQUEST", ex.getMessage(), meta(request, null)), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateKey(DuplicateKeyException ex, WebRequest request) {
        String raw = ex.getMessage() != null ? ex.getMessage() : "Duplicate key";
        String field = extractDuplicateField(raw);
        String value = extractDuplicateValue(raw);
        String code = switch (field) {
            case "email" -> "DUPLICATE_EMAIL";
            case "title" -> "DUPLICATE_TITLE";
            default -> "DUPLICATE_KEY";
        };
        String message = switch (field) {
            case "email" -> "Email already exists";
            case "title" -> "Speciality title already exists";
            default -> "Duplicate key error";
        };
        Map<String, Object> details = meta(request, null);
        if (field != null) details.put("field", field);
        if (value != null) details.put("value", value);
        return new ResponseEntity<>(ApiResponse.error(code, message, details), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        return new ResponseEntity<>(ApiResponse.error("BAD_REQUEST", ex.getMessage(), meta(request, null)), HttpStatus.BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<Map<String, Object>> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::fieldErrorToMap)
                .collect(Collectors.toList());
        ApiResponse<Object> body = ApiResponse.error("VALIDATION_ERROR", "Validation failed", meta(request, errors));
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    private Map<String, Object> fieldErrorToMap(FieldError fe) {
        Map<String, Object> m = new HashMap<>();
        m.put("field", fe.getField());
        m.put("message", fe.getDefaultMessage());
        m.put("rejectedValue", fe.getRejectedValue());
        return m;
    }

    private Map<String, Object> meta(WebRequest request, List<Map<String, Object>> errors) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("path", request.getDescription(false).replace("uri=", ""));
        if (errors != null) body.put("errors", errors);
        return body;
    }

    private String extractDuplicateField(String raw) {
        Matcher m1 = Pattern.compile("index: (\\w+)_1").matcher(raw);
        if (m1.find()) {
            String idx = m1.group(1);
            if ("email".equals(idx) || "title".equals(idx)) return idx;
        }
        Matcher m2 = Pattern.compile("dup key: \\{ (\\w+): ").matcher(raw);
        if (m2.find()) {
            String f = m2.group(1);
            return f;
        }
        return null;
    }

    private String extractDuplicateValue(String raw) {
        Matcher m = Pattern.compile("dup key: \\{ \\w+: \"([^\"]+)\" \\}").matcher(raw);
        if (m.find()) return m.group(1);
        return null;
    }
}
