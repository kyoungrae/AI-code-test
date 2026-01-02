#!/usr/bin/env python3
"""
Common.css를 요소별로 분리하는 스크립트
"""

import os
import re

# 파일 경로
source_file = "vims-login/src/main/resources/static/common/css/common/Common.css"
output_dir = "vims-login/src/main/resources/static/common/css/common"

# 섹션 정의 (시작 줄, 끝 줄, 파일명, 설명)
sections = [
    # 기본 설정 (1-77줄)
    (1, 77, "Variables.css", "CSS Variables and Base Styles"),
    # Position (78-3286줄)
    (78, 3286, "Position.css", "Position Utilities"),
    # Grid (3287-6777줄)
    (3287, 6777, "Grid.css", "Display Grid Utilities"),
    # Flex (6778-6874줄)
    (6778, 6874, "Flex.css", "Flexbox Utilities"),
    # Input (6875-7278줄)
    (6875, 7278, "Input.css", "Input Form Styles"),
    # Padding (7279-9279줄)
    (7279, 9279, "Spacing.css", "Padding and Spacing Utilities"),
    # Font (9280-9400줄)
    (9280, 9400, "Typography.css", "Typography Styles"),
    # Margin (9401-14242줄)
    (9401, 14242, "Spacing.css", "Margin Utilities"),  # Append to Spacing
    # Button (14243-14584줄)
    (14243, 14584, "Button.css", "Button Styles"),  # Append to existing Button.css
    # Row/Col (14585-19507줄)
    (14585, 19507, "Layout.css", "Row and Column Layout"),
    # Tag (19508-19605줄)
    (19508, 19605, "Tag.css", "Tag Styles"),
    # Common (19606-20168줄)
    (19606, 20168, "CommonComponents.css", "Common Components"),
    # CustomGrid (20169-20498줄)
    (20169, 20498, "Grid.css", "Custom Grid Styles"),  # Append to Grid.css
    # Menubar (20499-20606줄)
    (20499, 20606, "Menubar.css", "Menubar Styles"),
    # Login (20607-20704줄)
    (20607, 20704, "Login.css", "Login Page Styles"),
    # Chart (20705-20710줄)
    (20705, 20710, "Chart.css", "Chart Styles"),
    # Calendar (20711-20938줄)
    (20711, 20938, "Calendar.css", "Calendar Styles"),
    # Detail (20939-20991줄)
    (20939, 20991, "Detail.css", "Detail Page Layout"),
    # Popup (20992-끝)
    (20992, -1, "Popup.css", "Popup Styles"),
]

def read_lines(filename, start, end):
    """파일에서 특정 범위의 줄을 읽어옴"""
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        if end == -1:
            return lines[start-1:]
        return lines[start-1:end]

def write_section(output_file, lines, header, append=False):
    """섹션을 파일에 쓰기"""
    mode = 'a' if append else 'w'
    with open(output_file, mode, encoding='utf-8') as f:
        if append:
            f.write(f"\n/* ========== {header} ========== */\n\n")
        else:
            f.write(f"/* ========== {header} ========== */\n\n")
        f.writelines(lines)

def main():
    print("🚀 CSS 파일 분리 시작...")
    
    # 이미 생성된 파일 추적
    created_files = {}
    
    for start, end, filename, description in sections:
        output_file = os.path.join(output_dir, filename)
        print(f"📝 처리 중: {filename} ({start}-{end if end != -1 else '끝'}줄) - {description}")
        
        # 줄 읽기
        lines = read_lines(source_file, start, end)
        
        # 이미 생성된 파일이면 append
        append = filename in created_files
        
        # 파일 쓰기
        write_section(output_file, lines, description, append)
        
        # 생성된 파일로 마킹
        created_files[filename] = True
        
        print(f"   ✅ {len(lines)}줄 작성 완료")
    
    # 새로운 Common.css 생성 (imports만 포함)
    new_common_path = os.path.join(output_dir, "index.css")
    print(f"\n📦 새로운 index.css 생성 중...")
    
    with open(new_common_path, 'w', encoding='utf-8') as f:
        f.write("/* ==========================================================\n")
        f.write(" * GI Common CSS - Modular Structure\n")
        f.write(" * 모든 CSS 파일을 import하는 메인 파일\n")
        f.write(" * ==========================================================*/\n\n")
        
        # Variables와 기본 스타일은 먼저
        f.write("/* Base Styles */\n")
        f.write('@import "Variables.css";\n')
        f.write('@import "animation.css";\n\n')
        
        # 유틸리티 클래스들
        f.write("/* Utility Classes */\n")
        f.write('@import "Position.css";\n')
        f.write('@import "Spacing.css";\n')
        f.write('@import "Typography.css";\n\n')
        
        # 레이아웃
        f.write("/* Layout */\n")
        f.write('@import "Grid.css";\n')
        f.write('@import "Flex.css";\n')
        f.write('@import "Layout.css";\n\n')
        
        # 컴포넌트
        f.write("/* Components */\n")
        f.write('@import "Button.css";\n')
        f.write('@import "Input.css";\n')
        f.write('@import "Tag.css";\n')
        f.write('@import "CommonComponents.css";\n\n')
        
        # 페이지 특화
        f.write("/* Pages & Features */\n")
        f.write('@import "Menubar.css";\n')
        f.write('@import "Login.css";\n')
        f.write('@import "Calendar.css";\n')
        f.write('@import "Chart.css";\n')
        f.write('@import "Detail.css";\n')
        f.write('@import "Popup.css";\n')
    
    print("✅ index.css 생성 완료")
    print("\n🎉 CSS 파일 분리 완료!")
    print(f"   총 {len(created_files)}개 파일 생성")
    print("   생성된 파일:", ", ".join(sorted(created_files.keys())))

if __name__ == "__main__":
    main()
