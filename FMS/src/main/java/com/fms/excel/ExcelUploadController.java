package com.fms.excel;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/fms/excel/excelUpload")
@RequiredArgsConstructor
public class ExcelUploadController {
    private final ExcelUploadService excelUploadService;

    @PostMapping("/upload")
    public ExcelData uploadFile(@RequestParam("file") MultipartFile file) {
        return excelUploadService.uploadFile(file);
    }

}
