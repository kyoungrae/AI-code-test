package com.fms.file;

import com.fms.common.SysFile;
import com.fms.common.SysFileMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileManagerService extends FileProcessManager {
    private final SysFileMapper sysFileMapper;

    // private final String applicationFileName = "application.properties";
    // public List<Map<String,Object>> fileSearch(Map<String,Object> param) throws
    // Exception{
    // return sysFileMapper.SYS_FILE_SELECT(param);
    // }
    // public void fileCreate(Map<String , Object> map) throws Exception{
    // String folderName = (String) map.get("folder_name");
    // String fileName = (String) map.get("file_name");
    // String fileContent = (String) map.get("file_content");
    // String fileExtension = (String) map.get("file_extension");
    //
    // createFile(folderName, fileName, fileContent, fileExtension);
    // }
    public List<Map<String, Object>> fileUpload(String folder_name, MultipartFile[] files) throws Exception {
        // NOTE : 인가 정보 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // NOTE : unique ID 생성
        String uid = String.valueOf(UUID.randomUUID());
        String userId = authentication.getName();
        try {
            List<Map<String, Object>> result = uploadFile(folder_name, files);
            for (Map<String, Object> list : result) {
                list.put("uuid", uid);
                list.put("system_create_userid", userId);
            }
            if (!result.isEmpty()) {
                var sysFile = SysFile.builder()
                        .uuid(uid)
                        .temp_yn(0) // NOTE : 파일 임시 저장, 사용자가 작성 취소 하거나, 화면을 나갈 경우 삭제하기 위한 flag
                        .system_create_userid(userId)
                        .system_create_date(new java.util.Date())
                        .build();
                sysFileMapper.SYS_FILE_INSERT(sysFile);
                return result;
            } else {
                throw new Exception("File upload failed");
            }
        } catch (Exception e) {
            throw new Exception("File upload failed");
        }
    }
    // public void fileDownload(List<Map<String,Object>> params, HttpServletResponse
    // response) throws Exception{
    // for(Map<String ,Object> param : params){
    // Map<String ,Object> paramMap = new HashMap<>();
    // System.out.println(param.get("file_name"));
    // paramMap = param;
    // downloadFile(paramMap , response);
    // }
    // }
    // public void zipFileDownload(List<Map<String,Object>> params,
    // HttpServletResponse response) throws Exception{
    // String zipFileName = (String) params.get(0).get("file_zip_file_name");
    // downloadZipFile(downloadZipFileList(params),response,zipFileName);
    // }
    // public String getImage(Map<String,Object> request) throws
    // MalformedURLException {
    // String baseUrl = (String) request.get("BASE_URL");
    // String base_path = (String) request.get("file_path");
    // String fileId = (String) request.get("file_id");
    // // 파일 존재 여부 확인
    // Path filePath = Paths.get(base_path, fileId);
    // if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
    // return ""; // 파일이 없으면 빈 문자열 반환
    // }
    //
    // return baseUrl +"?fileId="+fileId+"&basePath="+base_path;
    // }
}