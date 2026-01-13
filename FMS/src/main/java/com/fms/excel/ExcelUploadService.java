package com.fms.excel;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.system.common.exception.CustomException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class ExcelUploadService {
    private final MessageSource messageSource;

    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    /**
     * Excel 파일 업로드 및 헤더 추출
     * 
     * @param file 업로드된 Excel 파일
     * @return Excel 데이터 (헤더 + 데이터 행)
     */
    public ExcelData uploadFile(MultipartFile file) {
        try {
            // log.info("Excel 파일 업로드 시작: {}", file.getOriginalFilename());

            // Excel 파일 읽기
            ExcelData excelData = readExcelFile(file);

            // 헤더 출력
            // log.info("추출된 헤더: {}", excelData.getHeaders());
            // log.info("데이터 행 개수: {}", excelData.getDataRows().size());

            System.out.println("excelData" + "::" + excelData);
            return excelData;

        } catch (Exception e) {
            // log.error("Excel 파일 처리 중 오류 발생", e);
            throw new CustomException(getMessage(""));
        }
    }

    /**
     * Excel 파일 읽기 (헤더 + 데이터)
     */
    private ExcelData readExcelFile(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
                Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0); // 첫 번째 시트 읽기

            List<String> headers = new ArrayList<>();
            List<Map<String, Object>> dataRows = new ArrayList<>();

            int rowIndex = 0;
            for (Row row : sheet) {
                if (rowIndex == 0) {
                    // 첫 번째 행: 헤더
                    headers = extractHeaders(row);
                } else {
                    // 데이터 행
                    Map<String, Object> dataRow = extractDataRow(row, headers);
                    if (!isEmptyRow(dataRow)) {
                        dataRows.add(dataRow);
                    }
                }
                rowIndex++;
            }

            return new ExcelData(headers, dataRows);
        }
    }

    /**
     * 헤더 추출
     */
    private List<String> extractHeaders(Row headerRow) {
        List<String> headers = new ArrayList<>();

        for (Cell cell : headerRow) {
            String headerValue = getCellValueAsString(cell);
            headers.add(headerValue);
        }

        // log.info("헤더 추출 완료: {}", headers);
        return headers;
    }

    /**
     * 데이터 행 추출 (헤더를 키로 사용하는 Map)
     */
    private Map<String, Object> extractDataRow(Row row, List<String> headers) {
        Map<String, Object> dataRow = new LinkedHashMap<>();

        for (int i = 0; i < headers.size(); i++) {
            Cell cell = row.getCell(i);
            String header = headers.get(i);
            Object value = getCellValue(cell);
            dataRow.put(header, value);
        }

        return dataRow;
    }

    /**
     * Cell 값을 String으로 변환
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }

    /**
     * Cell 값을 Object로 변환
     */
    private Object getCellValue(Cell cell) {
        if (cell == null) {
            return null;
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                // 정수인 경우 Long으로, 실수인 경우 Double로 반환
                double numericValue = cell.getNumericCellValue();
                if (numericValue == Math.floor(numericValue)) {
                    return (long) numericValue;
                }
                return numericValue;
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }

    /**
     * 빈 행인지 확인
     */
    private boolean isEmptyRow(Map<String, Object> dataRow) {
        return dataRow.values().stream().allMatch(value -> value == null || value.toString().isEmpty());
    }

    // TODO: 나중에 구현할 테이블별 insert 메서드
    // private void insertToTable(ExcelData excelData) {
    // // 헤더 정보를 기반으로 어떤 테이블에 insert할지 결정
    // // 각 데이터 행을 테이블에 insert
    // }
}
