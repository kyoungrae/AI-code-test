# VIMS 백엔드 개발 가이드 (샘플: CommonGroup)

이 가이드는 `CommonGroup` 도메인을 예시로 하여, VIMS 백엔드에서 새로운 비즈니스 기능을 구현하는 표준 프로세스와 예외 처리(Exception Handling) 방법을 설명합니다.

## 1. 아키텍처 개요
백엔드는 **Spring Boot**, **MyBatis**, **JPA**가 통합된 계층형 아키텍처를 따릅니다.

| 구성 요소 (Component) | 설명 | 명명 규칙 (Naming Convention) |
| :--- | :--- | :--- |
| **VO / Entity** | 데이터 구조를 정의하고 DB 테이블과 매핑됩니다. | `[Domain].java` |
| **Mapper** | XML에 정의된 SQL을 실행하기 위한 MyBatis 인터페이스입니다. | `[Domain]Mapper.java` |
| **Mapper XML** | 실제 SQL 쿼리문이 작성된 XML 파일입니다. | `[Domain]Mapper.xml` |
| **Repository** | JPA를 이용한 기본 CRUD 처리용 리포지토리입니다 (선택/혼용). | `[Domain]Repository.java` |
| **Service** | 비즈니스 로직을 포함하며 `AbstractCommonService`를 상속받습니다. | `[Domain]Service.java` |
| **Controller** | REST API 요청을 처리하며 `AbstractCommonController`를 상속받습니다. | `[Domain]Controller.java` |

---

## 2. 예외 처리 가이드 (Exception Handling)

### 2.1 글로벌 예외 처리
- `AbstractCommonService`와 `CustomException`을 사용하여 예외를 일관되게 처리합니다.
- `MessageSource`를 통해 다국어 처리된 에러 메시지를 반환합니다.

### 2.2 예외 처리 패턴
Service 계층에서 로직 수행 중 발생하는 예외는 `CustomException`으로 감싸서 던지거나, 특정 예외(`DuplicateKeyException` 등)를 잡아 사용자 친화적인 메시지로 변환합니다.

**주요 메서드:**
- `getMessage(String code)`: 메시지 코드(properties)를 받아 현재 로케일에 맞는 메시지를 반환합니다.

## 3. 구현 단계 (Implementation Steps)

### Step 1: VO (Value Object) 생성
데이터 구조를 정의하는 클래스를 생성합니다. Lombok 어노테이션을 사용하여 보일러플레이트 코드를 줄입니다.

**파일:** `src/main/java/com/vims/common/group/CommonGroup.java`
```java
package com.vims.common.group;

import lombok.*;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "COMMON_GROUP") // DB 테이블 매핑
public class CommonGroup {
    @Id
    private String group_id;
    private String group_name;
    // ... 추가 필드 정의
}
```

### Step 2: Mapper (MyBatis) 설정
SQL 실행을 위한 인터페이스와 연동되는 XML 파일을 정의합니다.

**인터페이스:** `src/main/java/com/vims/common/group/CommonGroupMapper.java`
```java
package com.vims.common.group;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CommonGroupMapper {
    List<CommonGroup> SELECT(CommonGroup request);
    List<CommonGroup> SELECT_PAGE(CommonGroup request);
    int INSERT(CommonGroup request);
    int UPDATE(CommonGroup request);
    int DELETE(CommonGroup request);
}
```

**XML:** `src/main/resources/mybatis/common/CommonGroupMapper.xml`
```xml
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "...">
<mapper namespace="com.vims.common.group.CommonGroupMapper">
    <select id="SELECT" resultType="com.vims.common.group.CommonGroup">
        SELECT * FROM COMMON_GROUP
        WHERE 1=1
        <!-- 동적 쿼리 작성 -->
    </select>
    <!-- SELECT_PAGE, INSERT, UPDATE, DELETE 등 정의 -->
</mapper>
```

### Step 3: Service 구현 (예외 처리 포함)
`AbstractCommonService`를 상속받아 공통 로직을 활용하고, 예외 처리를 적용합니다.

**파일:** `src/main/java/com/vims/common/group/CommonGroupService.java`
```java
package com.vims.common.group;

import com.system.common.base.AbstractCommonService;
import com.system.common.exception.CustomException; // 사용자 정의 예외
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DuplicateKeyException; // 스프링 DB 예외
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommonGroupService extends AbstractCommonService<CommonGroup> {

    private final CommonGroupMapper commonGroupMapper;
    private final MessageSource messageSource; // 메시지 소스 주입

    // 메시지 코드로부터 메시지 내용을 가져오는 헬퍼 메서드
    private String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    @Override
    protected List<CommonGroup> findImpl(CommonGroup request) throws Exception {
        try {
            return commonGroupMapper.SELECT(request);
        } catch (Exception e) {
            // 일반적인 조회 예외
            throw new CustomException(getMessage("EXCEPTION.COMMON.FIND_FAILED"));
        }
    }

    @Override
    protected int registerImpl(CommonGroup request) {
        try {
            return commonGroupMapper.INSERT(request);
        } catch (DuplicateKeyException dke) {
            // PK 중복 등으로 인한 등록 실패 시 사용자 정의 메시지 반환
            throw new CustomException(getMessage("EXCEPTION.PK.EXIST"));
        } catch (Exception e) {
            // 그 외 예외는 그대로 던지거나 커스텀 처리
            throw e;
        }
    }

    @Override
    protected int removeImpl(CommonGroup request) throws Exception {
        // 비즈니스 로직 검증 예시
        // 하위 데이터가 존재하면 삭제 불가능하게 처리
        boolean hasChild = checkChildData(request);
        if (hasChild) {
            throw new CustomException(getMessage("EXCEPTION.DELETE.EXIST.SBU_DATA"));
        }
        
        try {
            return commonGroupMapper.DELETE(request);
        } catch (Exception e) {
             throw new CustomException(getMessage("EXCEPTION.COMMON.DELETE_FAILED"));
        }
    }
    
    // 단순 조회 메서드
    private boolean checkChildData(CommonGroup request) {
        // ... 확인 로직 ...
        return false;
    }

    // 필요에 따라 updateImpl 등 오버라이드...
}
```

### Step 4: Controller 구현
`AbstractCommonController`를 상속받아 표준 API 엔드포인트(`/find`, `/register`, `/update`, `/remove`)를 노출합니다.

**파일:** `src/main/java/com/vims/common/group/CommonGroupController.java`
```java
package com.vims.common.group;

import com.system.common.base.AbstractCommonController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cms/common/commonGroup")
@RequiredArgsConstructor
public class CommonGroupController extends AbstractCommonController<CommonGroup> {

    private final CommonGroupService commonGroupService;

    // 1. 조회
    @PostMapping("/find")
    @Override
    protected List<CommonGroup> findImpl(@RequestBody CommonGroup request) throws Exception {
        return commonGroupService.findImpl(request);
    }

    // 2. 등록
    @PostMapping("/register")
    @Override
    protected int registerImpl(@RequestBody CommonGroup request) {
        return commonGroupService.registerImpl(request);
    }

    // 3. 수정
    @PostMapping("/update")
    @Override
    protected int updateImpl(@RequestBody CommonGroup request) {
        return commonGroupService.updateImpl(request);
    }

    // 4. 삭제
    @PostMapping("/remove")
    @Override
    protected int removeImpl(@RequestBody CommonGroup request) throws Exception {
        return commonGroupService.removeImpl(request);
    }
}
```

## 4. 예외 처리 코드 예시 (messages.properties)
`src/main/resources/messages.properties` (또는 해당 로케일 파일)에 에러 메시지를 정의합니다.

```properties
EXCEPTION.PK.EXIST=이미 존재하는 식별자입니다.
EXCEPTION.DELETE.EXIST.SBU_DATA=하위 데이터가 존재하여 삭제할 수 없습니다.
EXCEPTION.COMMON.FIND_FAILED=데이터 조회 중 오류가 발생했습니다.
EXCEPTION.COMMON.DELETE_FAILED=데이터 삭제 중 오류가 발생했습니다.
```
