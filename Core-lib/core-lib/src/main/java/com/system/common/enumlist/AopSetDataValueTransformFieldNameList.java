package com.system.common.enumlist;

import com.system.common.annotation.*;

/**
 * - @SetHypenRegident: 주민등록번호 하이픈 추가
 * - @SetHypenPhone: 전화번호 하이픈 추가
 * - @SetHypenCompany: 사업자등록번호(10) 하이픈 추가
 * - @SetHypenCorporation: 법인등록번호(13) 하이픈 추가
 * - @SetColonTime: 시간에 콜론 추가(00:00)
 */
public enum AopSetDataValueTransformFieldNameList {

    @SetHypenRegident
    transferee_resident_registration_number,
    @SetHypenRegident
    owner_resident_registration_number,
    @SetHypenRegident
    applicant_resident_registration_number,
    @SetHypenRegident
    driver_resident_registration_number,
    @SetHypenRegident
    maker_owner_resident_registration_number,
    @SetHypenRegident
    grantor_resident_registration_number,

    @SetHypenCorporation
    transferee_corporation_registration_number,
    @SetHypenCorporation
    owner_corporation_registration_number,
    @SetHypenCorporation
    maker_corporation_registration_number,
    @SetHypenCorporation
    grantor_corporation_registration_number,
    @SetHypenCorporation
    applicant_corporation_registration_number,

    @SetHypenCompany
    company_registration_number,
    @SetHypenCompany
    applicant_company_registration_number,

    @SetHypenPhone
    phone_number,
    @SetHypenPhone
    applicant_phone_number,
    @SetHypenPhone
    equipment_location_phone_number,
    @SetHypenPhone
    owner_phone_number,
    @SetHypenPhone
    inspector_phone_number,
    @SetHypenPhone
    transferee_phone_number,
    @SetHypenPhone
    maker_phone_number,
    @SetHypenPhone
    tel,

    @SetHypen
    issuance_ymd,
    @SetHypen
    application_ymd,
    @SetHypen
    applicant_birth_ymd,
    @SetHypen
    change_ymd,
    @SetHypen
    maker_owner_birth_ymd,
    @SetHypen
    transfer_ymd,
    @SetHypen
    production_ymd,
    @SetHypen
    scheduled_ymd,
    @SetHypen
    authority_erase_ymd,
    @SetHypen
    driving_period_start_ymd,
    @SetHypen
    driving_period_end_ymd,
    @SetHypen
    fee_due_ymd,
    @SetHypen
    chief_manager_birth_ymd,
    @SetHypen
    inspection_valid_start_ymd,
    @SetHypen
    inspection_valid_end_ymd,
    @SetHypen
    inspection_valid_extend_start_ymd,
    @SetHypen
    inspection_valid_extend_end_ymd,
    @SetHypen
    model_approval_ymd,
    @SetHypen
    initial_registration_ymd,
    @SetHypen
    acquisition_ymd,
    @SetHypen
    warranty_start_ymd,
    @SetHypen
    warranty_end_ymd,
    @SetHypen
    registration_expired_ymd,
    @SetHypen
    applicant_owner_birth_ymd,
    @SetHypen
    previous_inspection_ymd,
    @SetHypen
    station_owner_birth_ymd,
    @SetHypen
    inspection_ymd,
    @SetHypen
    last_inspection_ymd,
    @SetHypen
    first_inspection_ymd,
    @SetHypen
    next_inspection_start_ymd,
    @SetHypen
    next_inspection_end_ymd,
    @SetHypen
    original_inspection_start_ymd,
    @SetHypen
    original_inspection_end_ymd,
    @SetHypen
    adjustment_request_start_ymd,
    @SetHypen
    adjustment_request_end_ymd,

    @SetHypen
    order_ymd,
    @SetHypen
    marking_due_date_ymd,
    @SetHypen
    marking_complete_ymd,
    @SetHypen
    initial_transfer_ymd,
    @SetHypen
    start_ymd,
    @SetHypen
    end_ymd,
    @SetHypen
    approval_ymd,

    @SetColonTime
    scheduled_time,
    @SetColonTime
    latest_sent_time
}
