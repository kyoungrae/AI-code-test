package com.fms.excel;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Excel 파일 데이터를 담는 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelData {

    /**
     * Excel 파일의 헤더 (컬럼명 목록)
     */
    private List<String> headers;

    /**
     * Excel 파일의 데이터 행 목록
     * 각 행은 Map<헤더명, 값> 형태로 저장
     */
    private List<Map<String, Object>> dataRows;

    /**
     * 데이터 행 개수 반환
     */
    public int getRowCount() {
        return dataRows != null ? dataRows.size() : 0;
    }

    /**
     * 헤더 개수 반환
     */
    public int getColumnCount() {
        return headers != null ? headers.size() : 0;
    }
}
