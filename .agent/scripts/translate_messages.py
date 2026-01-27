
import os

base_path = "/Users/ikyoungtae/Documents/coding/AI-code-test/vims-login/src/main/resources/static/common/js/message"

replacements_en = {
    "등록": "Register",
    "수정": "Update",
    "삭제": "Delete",
    "상세": "Detail",
    "목록": "List",
    "저장": "Save",
    "취소": "Cancel",
    "확인": "Confirm",
    "조회": "Search",
    "초기화": "Reset",
    "아이디": "ID",
    "비밀번호": "Password",
    "이름": "Name",
    "제목": "Title",
    "내용": "Content",
    "첨부파일": "File",
    "사용여부": "Use Y/N",
    "사용": "Used",
    "미사용": "Unused",
    "설명": "Description",
    "순서": "Order",
    "권한": "Role",
    "그룹": "Group",
    "코드": "Code",
    "메뉴": "Menu",
    "입력해 주세요": "Please enter",
    "선택해 주세요": "Please select",
    "필수 입력": "Required"
}

replacements_mn = {
    "등록": "Бүртгэх",
    "수정": "Засах",
    "삭제": "Устгах",
    "상세": "Дэлгэрэнгүй",
    "목록": "Жагсаалт",
    "저장": "Хадгалах",
    "취소": "Цуцлах",
    "확인": "Баталгаажуулах",
    "조회": "Хайх",
    "초기화": "Дахин тохируулах",
    "아이디": "ID",
    "비밀번호": "Нууц үг",
    "이름": "Нэр",
    "제목": "Гарчиг",
    "내용": "Агуулга",
    "첨부파일": "Файл",
    "사용여부": "Ашиглах эсэх",
    "사용": "Ашиглана",
    "미사용": "Ашиглахгүй",
    "설명": "Тайлбар",
    "순서": "Дараалал",
    "권한": "Эрх",
    "그룹": "Бүлэг",
    "코드": "Код",
    "메뉴": "Цэс",
    "입력해 주세요": "оруулна уу",
    "선택해 주세요": "сонгоно уу",
    "필수 입력": "Заавал оруулах"
}

def process_folder(folder_path, replacements):
    if not os.path.exists(folder_path):
        print(f"Folder not found: {folder_path}")
        return

    for filename in os.listdir(folder_path):
        if filename.endswith(".js"):
            file_path = os.path.join(folder_path, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                original_content = content
                for k, v in replacements.items():
                    content = content.replace(k, v)
                
                if content != original_content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Updated: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

# Process English files
process_folder(os.path.join(base_path, "en/management"), replacements_en)
process_folder(os.path.join(base_path, "en/login"), replacements_en)

# Process Mongolian files
process_folder(os.path.join(base_path, "mn/management"), replacements_mn)
process_folder(os.path.join(base_path, "mn/login"), replacements_mn)

print("Translation replacements completed.")
