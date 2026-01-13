package com.fms.excel;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/fms/excel/excelUpload")
@RequiredArgsConstructor
public class ExcelUploadController {
    private final ExcelUploadService excelUploadService;

    @Value("${fms.internal.api-key:your-secure-internal-api-key-here}")
    private String expectedApiKey;

    @PostMapping("/upload")
    public ExcelData uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-Internal-API-Key", required = false) String apiKey) {
        // 디버깅 로그
        System.out.println("=== FMS API Key Validation ===");
        System.out.println("Received Key: " + apiKey);
        System.out.println("Expected Key: " + expectedApiKey);
        System.out.println("==============================");

        // API 키 검증
        if (apiKey == null || !expectedApiKey.equals(apiKey)) {
            System.out.println(">>> API KEY MISMATCH OR NULL <<<");
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "FMS 서비스 접근 권한이 없습니다.");
        }

        return excelUploadService.uploadFile(file);
    }

}
