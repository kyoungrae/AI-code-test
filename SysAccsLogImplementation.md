# Access Log Implementation Summary

## Overview
Implemented the access log feature to record user login activities and display them in the management system.
Addressed the issue where both login and logout dates were being set simultaneously upon login.

## Changes

### 1. Fixed "Logout Date on Login" Issue
**File**: `Core-lib/core-lib/src/main/java/com/system/common/interceptor/QueryTypeInterceptor.java`
- **Change**: Removed the code that automatically injected `system_logout_date` during `INSERT` and `UPDATE` operations.
- **Result**: 
    - When logging in (INSERT), only `system_login_date` is recorded. `system_logout_date` remains `NULL`.
    - Standard updates no longer accidentally overwrite the logout date.

### 2. Implemented "Logout Date on Logout"
**Files**: 
- `Core-lib/.../service/LogoutService.java`
- `Core-lib/.../accslog/SysAccsLogService.java`
- `Core-lib/.../accslog/SysAccsLogMapper.xml`

- **Change**: 
    - In `SysAccsLogMapper.xml`, added a new `UPDATE_LOGOUT_BY_USER` query. This query finds the most recent login session for the user (where logout date is null) and updates its `system_logout_date` to `NOW()`.
    - In `LogoutService.java`, injected `SysAccsLogService` and added a call to `logLogoutByUser(userId)` within the `logout` method.
- **Result**: When a user logs out, the specific access log entry for their current session is updated with the timestamp.

### 3. Backend (Core-lib & Login) - Previous Steps
1.  **SysAccsLogService**: Added `logAccess(SysAccsLog log)` method.
2.  **SysAccsLogMapper.xml**: Fixed `INSERT` statement.
3.  **LoginController**: Integrated `SysAccsLogService` to log user access details (IP, OS, Browser) on successful authentication.

### 4. Frontend (Management System) - Previous Steps
1.  **sysAccsLogList.html**: Updated API paths and column definitions.
2.  **GridUtils.js**: Enhanced date formatting.

## Verification
- **Login**: Creates a new record in `SYS_ACCS_LOG`. `system_login_date` is set. `system_logout_date` is NULL.
- **Logout**: Updates the latest record for that user. `system_logout_date` is set to current time.
