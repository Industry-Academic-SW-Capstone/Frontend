import os
from PIL import Image

def crop_images_in_folder(source_folder, target_folder):
    """
    폴더 내의 이미지들을 일괄 크롭하는 함수
    :param source_folder: 원본 이미지가 있는 폴더 경로
    :param target_folder: 크롭된 이미지를 저장할 폴더 경로
    :param x: 시작점 x 좌표 (가로 시작 위치)
    :param y: 시작점 y 좌표 (세로 시작 위치)
    :param width: 자를 너비
    :param height: 자를 높이
    """
    
    # 저장할 폴더가 없으면 생성
    if not os.path.exists(target_folder):
        os.makedirs(target_folder)

    # 지원하는 이미지 확장자 목록
    valid_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')
    
    file_list = os.listdir(source_folder)
    count = 0

    print(f"--- 작업 시작: 총 {len(file_list)}개의 파일 검사 ---")

    for filename in file_list:
        if filename.lower().endswith(valid_extensions):
            try:
                # 이미지 열기
                img_path = os.path.join(source_folder, filename)
                img = Image.open(img_path)
                filename = filename.replace("cropped_", "")

                
                save_path = os.path.join(target_folder, f"{filename}")
                img.save(save_path)
                
                print(f"[성공] {filename} 크롭 완료")
                count += 1
                
            except Exception as e:
                print(f"[에러] {filename} 처리 중 오류 발생: {e}")

    print(f"--- 작업 완료: 총 {count}개의 이미지가 크롭되었습니다. ---")

# ==========================================
# [사용자 설정 영역] 아래 값들을 수정해서 사용하세요
# ==========================================

# 1. 원본 이미지가 있는 폴더 이름 (현재 경로 기준 혹은 절대 경로)
INPUT_DIR = "./scripts/icons" 

# 2. 결과물을 저장할 폴더 이름
OUTPUT_DIR = "./scripts/cropped_icons"


# 함수 실행
# 폴더가 실제로 존재하는지 확인 후 실행하는 것이 좋습니다.
if os.path.exists(INPUT_DIR):
    crop_images_in_folder(INPUT_DIR, OUTPUT_DIR)
else:
    print(f"오류: 입력 폴더 '{INPUT_DIR}'를 찾을 수 없습니다.")