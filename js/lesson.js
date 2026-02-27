/* ========================================
   수업 자료 생성 페이지 (lesson.html) 전용 JavaScript
   ======================================== */

// 자동 저장 관련 변수
let autoSaveTimer = null;
let lastSaveTime = null;

// 생성된 자료 저장소 (하나의 자료는 여러 장으로 구성)
let currentMaterial = {
  title: '',
  type: '',
  grade: '',
  format: '',
  pages: [] // 각 페이지는 카테고리를 가짐
};

// 현재 활성 탭
let activeTab = '학습 목표 및 도입';

// 편집 모드 상태
let isEditMode = false;

// 리사이저 드래그 기능
let isResizing = false;
let startX = 0;
let startLeftWidth = 0;

function initResizer() {
  const resizer = document.getElementById('resizer');
  const chatSection = document.getElementById('chatSection');
  const previewSection = document.getElementById('previewSection');
  const container = document.querySelector('.lesson-container');
  
  if (!resizer || !chatSection || !previewSection) return;
  
  resizer.addEventListener('mousedown', function(e) {
    isResizing = true;
    startX = e.clientX;
    startLeftWidth = chatSection.offsetWidth;
    
    resizer.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    
    const containerWidth = container.offsetWidth - 8; // 리사이저 너비 제외
    const deltaX = e.clientX - startX;
    const newLeftWidth = startLeftWidth + deltaX;
    
    // 최소/최대 너비 제한 (30% ~ 70%)
    const minWidth = containerWidth * 0.3;
    const maxWidth = containerWidth * 0.7;
    
    if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
      const leftPercent = (newLeftWidth / containerWidth) * 100;
      const rightPercent = 100 - leftPercent;
      
      chatSection.style.flex = `0 0 ${leftPercent}%`;
      previewSection.style.flex = `0 0 ${rightPercent}%`;
    }
  });
  
  document.addEventListener('mouseup', function() {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

// 대화 상태 관리
let conversationState = {
  lessonType: null,
  step: 0,
  data: {}
};

// 첨부 파일 관리
let attachedFiles = [];
let uploadedFiles = []; // 업로드된 파일 목록 (사용된 파일)

// 파일 업로드 트리거
function triggerFileUpload() {
  document.getElementById('fileInput').click();
}

// 파일 선택 처리
function handleFileSelect(event) {
  const files = event.target.files;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 파일 크기 체크 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name}은(는) 10MB를 초과합니다. 더 작은 파일을 선택해주세요.`);
      continue;
    }
    
    // 중복 체크
    const isDuplicate = attachedFiles.some(f => f.name === file.name && f.size === file.size);
    if (isDuplicate) {
      alert(`${file.name}은(는) 이미 첨부되어 있습니다.`);
      continue;
    }
    
    attachedFiles.push(file);
    
    // 업로드된 파일 목록에도 추가
    const uploadedDuplicate = uploadedFiles.some(f => f.name === file.name && f.size === file.size);
    if (!uploadedDuplicate) {
      uploadedFiles.push(file);
    }
  }
  
  // 파일 입력 초기화
  event.target.value = '';
  
  // UI 업데이트
  updateAttachedFilesList();
  updateUploadedFilesList();
}

// 업로드한 첨부 파일 드롭다운 토글
function toggleUploadedFiles() {
  const dropdown = document.getElementById('uploadedFilesDropdown');
  const content = document.getElementById('uploadedFilesList');
  
  if (!dropdown || !content) return;
  
  const isExpanded = dropdown.classList.contains('expanded');
  
  if (isExpanded) {
    dropdown.classList.remove('expanded');
    content.style.display = 'none';
  } else {
    dropdown.classList.add('expanded');
    content.style.display = 'block';
  }
}

// 업로드한 파일 리스트 업데이트
function updateUploadedFilesList() {
  const dropdown = document.getElementById('uploadedFilesDropdown');
  const filesList = document.getElementById('uploadedFilesList');
  const fileCount = document.getElementById('uploadedFileCount');
  
  if (!dropdown || !filesList || !fileCount) return;
  
  if (uploadedFiles.length === 0) {
    dropdown.style.display = 'none';
    return;
  }
  
  dropdown.style.display = 'block';
  fileCount.textContent = uploadedFiles.length;
  
  let html = '';
  uploadedFiles.forEach((file, index) => {
    const iconInfo = getFileIconWithClass(file.name);
    
    html += `
      <div class="uploaded-file-item">
        <div class="file-icon ${iconInfo.class}">
          ${iconInfo.icon}
        </div>
        <span class="file-name" title="${file.name}">${file.name}</span>
        <button class="file-delete-btn" onclick="removeUploadedFile(${index})" title="삭제">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
  });
  
  filesList.innerHTML = html;
}

// 파일 아이콘 및 클래스 반환
function getFileIconWithClass(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  
  const iconMap = {
    // PDF
    'pdf': { icon: '📄', class: 'pdf' },
    
    // Word
    'doc': { icon: '📝', class: 'word' },
    'docx': { icon: '📝', class: 'word' },
    
    // Excel
    'xls': { icon: '📊', class: 'excel' },
    'xlsx': { icon: '📊', class: 'excel' },
    
    // PowerPoint
    'ppt': { icon: '📊', class: 'excel' },
    'pptx': { icon: '📊', class: 'excel' },
    
    // Images
    'jpg': { icon: '🖼️', class: 'image' },
    'jpeg': { icon: '🖼️', class: 'image' },
    'png': { icon: '🖼️', class: 'image' },
    'gif': { icon: '🖼️', class: 'image' },
    'svg': { icon: '🖼️', class: 'image' },
    
    // Video
    'mp4': { icon: '🎥', class: 'video' },
    'avi': { icon: '🎥', class: 'video' },
    'mov': { icon: '🎥', class: 'video' },
    
    // Archive
    'zip': { icon: '📦', class: 'zip' },
    'rar': { icon: '📦', class: 'zip' },
    '7z': { icon: '📦', class: 'zip' },
    
    // Text
    'txt': { icon: '📄', class: 'pdf' },
    'hwp': { icon: '📄', class: 'pdf' }
  };
  
  return iconMap[ext] || { icon: '📄', class: 'pdf' };
}

// 업로드한 파일 삭제
function removeUploadedFile(index) {
  if (confirm('이 파일을 삭제하시겠습니까?')) {
    uploadedFiles.splice(index, 1);
    updateUploadedFilesList();
  }
}

// 첨부 파일 리스트 업데이트
function updateAttachedFilesList() {
  const attachedFilesArea = document.getElementById('attachedFilesArea');
  const attachedFilesList = document.getElementById('attachedFilesList');
  const fileCount = document.getElementById('fileCount');
  const sendButton = document.querySelector('.send-button');
  
  if (attachedFiles.length === 0) {
    attachedFilesArea.style.display = 'none';
    if (sendButton) {
      sendButton.classList.remove('has-attachment');
    }
    return;
  }
  
  attachedFilesArea.style.display = 'block';
  fileCount.textContent = attachedFiles.length;
  
  // 전송 버튼에 첨부파일 표시 추가
  if (sendButton) {
    sendButton.classList.add('has-attachment');
  }
  
  let html = '';
  attachedFiles.forEach((file, index) => {
    const icon = getFileIcon(file.name);
    const size = formatFileSize(file.size);
    
    html += `
      <div class="attached-file-item">
        <span class="attached-file-icon">${icon}</span>
        <span class="attached-file-name" title="${file.name}">${file.name}</span>
        <span class="attached-file-size">${size}</span>
        <button class="remove-file-btn" onclick="removeFile(${index})" title="삭제">×</button>
      </div>
    `;
  });
  
  attachedFilesList.innerHTML = html;
}

// 첨부 파일 영역 토글
function toggleAttachedFiles() {
  const attachedFilesArea = document.getElementById('attachedFilesArea');
  attachedFilesArea.classList.toggle('collapsed');
}

// 파일 아이콘 가져오기
function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  const iconMap = {
    'pdf': '📕',
    'ppt': '📊',
    'pptx': '📊',
    'doc': '📄',
    'docx': '📄',
    'hwp': '📄',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️'
  };
  
  return iconMap[ext] || '📎';
}

// 파일 크기 포맷
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// 파일 삭제
function removeFile(index) {
  attachedFiles.splice(index, 1);
  updateAttachedFilesList();
}

// 모든 파일 삭제
function clearAllFiles() {
  if (confirm('첨부된 모든 파일을 삭제하시겠습니까?')) {
    attachedFiles = [];
    updateAttachedFilesList();
  }
}

// 수업 유형 시작
function startLessonType(type) {
  conversationState.lessonType = type;
  conversationState.step = 2;
  conversationState.data = { type: type };
  
  // 사용자 선택 표시
  addUserMessage(type);
  
  // AI 첫 번째 질문 (step 2부터 시작)
  setTimeout(() => {
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      askNextQuestion();
    }, 1500);
  }, 500);
}

// 다음 질문 생성
function askNextQuestion() {
  const { lessonType, step } = conversationState;
  let question = '';
  
  if (step === 2) {
    // Step 2: 학년/단원 질문
    question = '좋습니다! 어느 학년, 어떤 단원의 자료를 만들까요?<br><span style="font-size: 13px; color: var(--text-secondary);">예: 중2 일차함수, 고1 삼각함수 등</span>';
  } else if (step === 3) {
    // Step 3: 추가 설명 요청 (바로 생성 버튼 포함)
    question = '만들고싶은 자료에 대해 설명해주시면 정확한 자료를 만들 수 있어요! 추가할 내용이 없으시면 바로 생성 버튼을 클릭해보세요!<br><span style="font-size: 13px; color: var(--text-secondary);">예: 실생활 예시, 심화 문제, 개념 정리 등</span><br>' +
               '<div style="display: flex; justify-content: flex-end; margin-top: 12px;"><button class="generate-now-btn" onclick="generateDirectly()">✨ 바로 생성</button></div>';
  }
  
  addAIMessageHTML(question);
}

// 바로 생성 버튼 클릭
function generateDirectly() {
  conversationState.data.additional = '없음';
  
  // 사용자 메시지 표시
  addUserMessage('바로 생성');
  
  setTimeout(() => {
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      generateFinalMaterial();
    }, 2000);
  }, 500);
}

// 형식 선택
function selectFormat(format) {
  conversationState.data.format = format;
  conversationState.step++;
  
  addUserMessage(format);
  
  setTimeout(() => {
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      askNextQuestion();
    }, 1500);
  }, 500);
}

// 메시지 전송
function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  // 메시지가 없고 첨부파일도 없으면 리턴
  if (!message && attachedFiles.length === 0) {
    return;
  }
  
  // 메시지가 없지만 첨부파일이 있으면 기본 메시지 추가
  const finalMessage = message || '첨부한 파일을 참고해주세요.';
  
  // 사용자 메시지 추가 (첨부파일 포함)
  addUserMessage(finalMessage);
  
  // 입력 필드 초기화
  input.value = '';
  
  // 먼저 모듈/탭 관리 명령인지 확인
  if (handleModuleCommand(finalMessage)) {
    return; // 모듈 관리 명령이면 여기서 종료
  }
  
  // 대화 진행 중이면 다음 단계로
  if (conversationState.step > 0) {
    handleConversationStep(finalMessage);
  } else {
    // 자유 형식 메시지 분석 및 대화 시작
    analyzeAndStartConversation(finalMessage);
  }
}

// 모듈/탭 관리 명령 처리
function handleModuleCommand(message) {
  // 자료가 없으면 모듈 관리 불가
  if (!currentMaterial || currentMaterial.pages.length === 0) {
    return false;
  }
  
  const lowerMsg = message.toLowerCase();
  
  // 카테고리 매핑 (다양한 표현 지원)
  const categoryMap = {
    // 새로운 카테고리
    '학습': '학습 목표 및 도입',
    '목표': '학습 목표 및 도입',
    '도입': '학습 목표 및 도입',
    '학습 목표': '학습 목표 및 도입',
    '학습목표': '학습 목표 및 도입',
    '학습 목표 및 도입': '학습 목표 및 도입',
    '문제': '문제 적용하기',
    '적용': '문제 적용하기',
    '문제 적용': '문제 적용하기',
    '문제적용': '문제 적용하기',
    '문제 적용하기': '문제 적용하기',
    '정리': '내용 정리',
    '내용': '내용 정리',
    '내용 정리': '내용 정리',
    '내용정리': '내용 정리',
    '역량': '역량 키우기',
    '키우기': '역량 키우기',
    '역량 키우기': '역량 키우기',
    '역량키우기': '역량 키우기',
    // 기존 카테고리 (하위 호환성)
    '정의': '정리 정의',
    '정리 정의': '정리 정의',
    '정리정의': '정리 정의',
    '실생활': '실생활 예시',
    '예시': '실생활 예시',
    '실생활 예시': '실생활 예시',
    '실생활예시': '실생활 예시',
    '수학': '수학적 계산',
    '계산': '수학적 계산',
    '수학적 계산': '수학적 계산',
    '수학적계산': '수학적 계산',
    '응용': '응용 문제',
    '응용 문제': '응용 문제',
    '응용문제': '응용 문제'
  };
  
  // 카테고리 찾기
  let targetCategory = null;
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerMsg.includes(key)) {
      targetCategory = value;
      break;
    }
  }
  
  // 명령어 패턴 감지
  let commandExecuted = false;
  
  // 1. 모듈 추가 명령
  if ((lowerMsg.includes('모듈') || lowerMsg.includes('페이지') || lowerMsg.includes('장')) && 
      (lowerMsg.includes('추가') || lowerMsg.includes('넣어') || lowerMsg.includes('만들'))) {
    
    if (!targetCategory) {
      // 카테고리가 명시되지 않았으면 현재 활성 탭에 추가
      targetCategory = activeTab;
    }
    
    const pages = currentMaterial.pages.filter(p => p.category === targetCategory);
    if (pages.length > 0) {
      // 마지막 모듈 뒤에 추가
      addModuleAfter(targetCategory, pages.length - 1);
      
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addAIMessage(`✅ "${targetCategory}" 탭에 새 모듈을 추가했습니다! 편집 모드로 전환하여 내용을 수정하실 수 있습니다.`);
        }, 800);
      }, 300);
      
      commandExecuted = true;
    }
  }
  
  // 2. 모듈 삭제 명령
  else if ((lowerMsg.includes('모듈') || lowerMsg.includes('페이지') || lowerMsg.includes('장')) && 
           (lowerMsg.includes('삭제') || lowerMsg.includes('지워') || lowerMsg.includes('제거'))) {
    
    if (!targetCategory) {
      targetCategory = activeTab;
    }
    
    // 숫자 추출 (몇 번째 모듈인지)
    const numberMatch = message.match(/(\d+)/);
    if (numberMatch) {
      const moduleIndex = parseInt(numberMatch[1]) - 1; // 1번째 -> index 0
      const pages = currentMaterial.pages.filter(p => p.category === targetCategory);
      
      if (moduleIndex >= 0 && moduleIndex < pages.length) {
        deleteModule(targetCategory, moduleIndex);
        
        setTimeout(() => {
          showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator();
            addAIMessage(`✅ "${targetCategory}" 탭의 ${numberMatch[1]}번째 모듈을 삭제했습니다.`);
          }, 800);
        }, 300);
        
        commandExecuted = true;
      }
    } else {
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addAIMessage(`⚠️ 삭제할 모듈의 번호를 지정해주세요. 예: "${targetCategory} 탭의 2번째 모듈 삭제해줘"`);
        }, 800);
      }, 300);
      commandExecuted = true;
    }
  }
  
  // 3. 탭 추가 명령
  else if ((lowerMsg.includes('탭') || lowerMsg.includes('카테고리')) && 
           (lowerMsg.includes('추가') || lowerMsg.includes('만들') || lowerMsg.includes('생성'))) {
    
    addNewTab();
    
    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        addAIMessage(`✅ 새 탭을 추가했습니다! 탭 이름을 수정하시려면 편집 모드로 전환하세요.`);
      }, 800);
    }, 300);
    
    commandExecuted = true;
  }
  
  // 4. 탭 전환 명령
  else if ((lowerMsg.includes('탭') || lowerMsg.includes('카테고리')) && 
           (lowerMsg.includes('보여') || lowerMsg.includes('이동') || lowerMsg.includes('가자') || lowerMsg.includes('열어'))) {
    
    if (targetCategory) {
      switchTab(targetCategory);
      
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addAIMessage(`✅ "${targetCategory}" 탭으로 이동했습니다.`);
        }, 800);
      }, 300);
      
      commandExecuted = true;
    }
  }
  
  // 5. 모듈 순서 변경 명령
  else if ((lowerMsg.includes('모듈') || lowerMsg.includes('페이지') || lowerMsg.includes('장')) && 
           (lowerMsg.includes('위로') || lowerMsg.includes('아래로') || lowerMsg.includes('순서'))) {
    
    if (!targetCategory) {
      targetCategory = activeTab;
    }
    
    const numberMatch = message.match(/(\d+)/);
    if (numberMatch) {
      const moduleIndex = parseInt(numberMatch[1]) - 1;
      
      if (lowerMsg.includes('위로') || lowerMsg.includes('올려')) {
        moveModuleUp(targetCategory, moduleIndex);
        
        setTimeout(() => {
          showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator();
            addAIMessage(`✅ "${targetCategory}" 탭의 ${numberMatch[1]}번째 모듈을 위로 이동했습니다.`);
          }, 800);
        }, 300);
        
        commandExecuted = true;
      } else if (lowerMsg.includes('아래로') || lowerMsg.includes('내려')) {
        moveModuleDown(targetCategory, moduleIndex);
        
        setTimeout(() => {
          showTypingIndicator();
          setTimeout(() => {
            hideTypingIndicator();
            addAIMessage(`✅ "${targetCategory}" 탭의 ${numberMatch[1]}번째 모듈을 아래로 이동했습니다.`);
          }, 800);
        }, 300);
        
        commandExecuted = true;
      }
    }
  }
  
  // 6. 일반 수정 요청 (모듈 명령어는 아니지만 자료가 있을 때)
  else if (currentMaterial && currentMaterial.pages.length > 0) {
    // 수정 관련 키워드가 있으면 일반 수정으로 처리
    if (lowerMsg.includes('수정') || lowerMsg.includes('바꿔') || lowerMsg.includes('변경') || 
        lowerMsg.includes('고쳐') || lowerMsg.includes('추가') || lowerMsg.includes('넣어')) {
      
      setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          addAIMessage(`✅ "${message}"을 수정했습니다! 우측 미리보기 화면에서 확인해주세요! 😊`);
        }, 800);
      }, 300);
      
      commandExecuted = true;
    }
  }
  
  return commandExecuted;
}

// 메시지 분석 및 대화 시작
function analyzeAndStartConversation(message) {
  setTimeout(() => {
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      
      const lowerMessage = message.toLowerCase();
      
      // 자료 생성 의도가 있는지 확인
      const hasCreationIntent = 
        lowerMessage.includes('만들') || 
        lowerMessage.includes('생성') || 
        lowerMessage.includes('제작') ||
        lowerMessage.includes('ppt') ||
        lowerMessage.includes('피피티') ||
        lowerMessage.includes('학습지') ||
        lowerMessage.includes('자료') ||
        lowerMessage.includes('활동') ||
        lowerMessage.includes('프로젝트') ||
        attachedFiles.length > 0;
      
      if (hasCreationIntent) {
        // 유형 추천 및 대화 시작
        startGuidedConversation(message);
      } else {
        // 일반 대화 - 자료 생성 안내
        addAIMessage('안녕하세요! 수업 자료 생성을 도와드리겠습니다. 어떤 유형의 자료를 만들고 싶으신지 말씀해주시거나, 위의 4가지 유형 중 하나를 선택해주세요! 😊');
      }
    }, 1500);
  }, 500);
}

// 가이드 대화 시작
function startGuidedConversation(message) {
  const lowerMessage = message.toLowerCase();
  
  // 메시지에서 유형 추론
  let inferredType = null;
  
  if (lowerMessage.includes('개념') || lowerMessage.includes('이론') || lowerMessage.includes('설명')) {
    inferredType = '개념 학습';
  } else if (lowerMessage.includes('활동') || lowerMessage.includes('실습') || lowerMessage.includes('체험')) {
    inferredType = '활동형';
  } else if (lowerMessage.includes('프로젝트') || lowerMessage.includes('과제')) {
    inferredType = '프로젝트형';
  } else if (lowerMessage.includes('토론') || lowerMessage.includes('발표') || lowerMessage.includes('참여')) {
    inferredType = '참여형';
  }
  
  // 학년/단원 정보 추출 시도
  let inferredGrade = null;
  const gradeMatch = message.match(/(초|중|고)\s*(\d+)/);
  if (gradeMatch) {
    inferredGrade = message;
  }
  
  // 대화 상태 초기화 및 시작
  if (inferredType && inferredGrade) {
    // 유형과 학년 모두 추론되면 바로 생성 (시나리오 2: 자유 입력 -> 바로 결과물)
    conversationState.lessonType = inferredType;
    conversationState.step = 0; // 완료 상태
    conversationState.data = { 
      type: inferredType, 
      grade: inferredGrade,
      format: 'PPT',
      additional: '없음'
    };
    
    addAIMessageHTML(`완벽합니다! <strong>${inferredType}</strong> 자료를 바로 생성하겠습니다! ✨`);
    
    setTimeout(() => {
      showTypingIndicator();
      setTimeout(() => {
        hideTypingIndicator();
        generateFinalMaterial();
      }, 2000);
    }, 500);
    
  } else if (inferredType) {
    // 유형만 추론되면 해당 유형으로 시작 (시나리오 1)
    conversationState.lessonType = inferredType;
    conversationState.step = 2;
    conversationState.data = { type: inferredType, format: 'PPT' };
    
    if (inferredGrade) {
      // 학년 정보도 있으면 Step 3으로 (추가 설명)
      conversationState.data.grade = inferredGrade;
      conversationState.data.format = 'PPT';
      conversationState.step = 3;
      
      addAIMessageHTML(`좋습니다! <strong>${inferredType}</strong> 자료를 만들어드리겠습니다.<br><br>추가 설명을 입력하시거나 바로 생성해주세요.`);
      
      setTimeout(() => {
        askNextQuestion();
      }, 500);
    } else {
      // 학년 정보부터 질문 (step 2)
      addAIMessageHTML(`<strong>${inferredType}</strong> 자료를 만들어드리겠습니다! 👍<br><br>어느 학년, 어떤 단원의 자료를 만들까요?<br><span style="font-size: 13px; color: var(--text-secondary);">예: 중2 일차함수, 고1 삼각함수 등</span>`);
    }
  } else {
    // 유형을 추론할 수 없으면 유형 선택 요청
    let response = '수업 자료를 만들어드리겠습니다! 😊<br><br>';
    
    if (attachedFiles.length > 0) {
      response += '첨부하신 파일을 확인했습니다. ';
    }
    
    response += '어떤 유형의 자료를 만들고 싶으신가요?<br><br>' +
                '<div class="suggestion-chips">' +
                '<button class="chip" onclick="startLessonType(\'개념 학습\')">📚 개념 학습</button>' +
                '<button class="chip" onclick="startLessonType(\'활동형\')">🎯 활동형</button>' +
                '<button class="chip" onclick="startLessonType(\'프로젝트형\')">🔬 프로젝트형</button>' +
                '<button class="chip" onclick="startLessonType(\'참여형\')">🙋 참여형</button>' +
                '</div>' +
                '<p style="font-size: 13px; color: var(--text-secondary); margin-top: 12px; margin-bottom: 0;">💡 팁: 위 버튼으로 빠르게 선택하거나, 직접 입력하여 대화할 수 있습니다.</p>';
    
    addAIMessageHTML(response);
  }
}

// 대화 단계 처리
function handleConversationStep(message) {
  const lowerMessage = message.toLowerCase();
  
  if (conversationState.step === 2) {
    // 학년/단원 정보 저장
    conversationState.data.grade = message;
    conversationState.step = 3; // Step 3으로 이동 (추가 설명)
    
    setTimeout(() => {
      showTypingIndicator();
      
      setTimeout(() => {
        hideTypingIndicator();
        askNextQuestion();
      }, 1500);
    }, 500);
    
  } else if (conversationState.step === 3) {
    // 추가 내용 저장 및 바로 생성
    conversationState.data.additional = message;
    conversationState.data.format = 'PPT'; // 기본 형식 설정
    
    // 생성 시작
    setTimeout(() => {
      showTypingIndicator();
      
      setTimeout(() => {
        hideTypingIndicator();
        generateFinalMaterial();
      }, 2000);
    }, 500);
  }
}

// Enter 키 처리
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// 최종 자료 생성
function generateFinalMaterial() {
  const { type, grade, format, additional } = conversationState.data;
  
  let message = `완벽합니다! 다음 내용으로 수업 자료를 생성하겠습니다:<br><br>` +
                `📌 유형: ${type}<br>` +
                `📚 학년/단원: ${grade}<br>`;
  
  if (additional && !additional.toLowerCase().includes('없음') && additional !== '바로 생성') {
    message += `➕ 추가 내용: ${additional}<br>`;
  }
  
  message += `<br>잠시만 기다려주세요... 자료를 생성하고 있습니다! 🎨`;
  
  addAIMessageHTML(message);
  
  // 미리보기 생성
  setTimeout(() => {
    updatePreviewWithData(conversationState.data);
    
    setTimeout(() => {
      addAIMessage('수업 자료 생성이 완료되었습니다! 우측 미리보기에서 확인해주세요. 수정이 필요하시면 말씀해주세요! ✨');
      
      // 대화 상태 초기화
      conversationState = { lessonType: null, step: 0, data: {} };
    }, 1000);
  }, 2000);
}

// 사용자 메시지 추가
function addUserMessage(text) {
  const messagesContainer = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  
  let attachmentHTML = '';
  if (attachedFiles.length > 0) {
    attachmentHTML = '<div class="message-attachments">';
    attachedFiles.forEach(file => {
      const icon = getFileIcon(file.name);
      attachmentHTML += `
        <div class="message-attachment-item">
          <span>${icon}</span>
          <span>${file.name}</span>
        </div>
      `;
    });
    attachmentHTML += '</div>';
  }
  
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/wfAbSpUF" alt="김지은 선생님">
    </div>
    <div class="message-content">
      <p>${escapeHtml(text)}</p>
      ${attachmentHTML}
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
  
  // 메시지 전송 후 첨부 파일 초기화
  if (attachedFiles.length > 0) {
    attachedFiles = [];
    updateAttachedFilesList();
  }
}

// AI 메시지 추가
function addAIMessage(text) {
  const messagesContainer = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <p>${text}</p>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// AI 메시지 추가 (HTML 포함)
function addAIMessageHTML(html) {
  const messagesContainer = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      ${html}
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// 타이핑 인디케이터 표시
function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai-message';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(typingDiv);
  scrollToBottom();
}

// 타이핑 인디케이터 숨기기
function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// 스크롤을 아래로
function scrollToBottom() {
  const messagesContainer = document.getElementById('chatMessages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// AI 응답 생성 (시뮬레이션)
function generateAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('ppt') || lowerMessage.includes('피피티')) {
    return '네! PPT 자료를 생성하겠습니다. 우측 미리보기 영역에서 확인해주세요. 추가로 수정하고 싶은 내용이 있으시면 말씀해주세요.';
  } else if (lowerMessage.includes('학습지') || lowerMessage.includes('워크시트')) {
    return '학습지를 만들어드리겠습니다. 개념 설명과 연습문제를 포함한 학습지가 우측에 표시됩니다.';
  } else if (lowerMessage.includes('개념') || lowerMessage.includes('설명')) {
    return '개념 설명 자료를 준비하겠습니다. 학생들이 이해하기 쉽도록 구성했습니다.';
  } else {
    return `"${userMessage}"에 대한 수업 자료를 생성했습니다. 우측 미리보기에서 확인해주세요. 더 수정하고 싶은 부분이 있으시면 말씀해주세요!`;
  }
}

// 미리보기 업데이트
function updatePreview(userMessage) {
  const previewContent = document.getElementById('previewContent');
  
  // 예시 콘텐츠 생성
  const documentHTML = `
    <div class="preview-document">
      <h1 style="color: var(--primary-color); margin-bottom: 20px;">수업 자료: ${escapeHtml(userMessage)}</h1>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: var(--text-primary); font-size: 20px; margin-bottom: 15px;">📚 학습 목표</h2>
        <ul style="line-height: 1.8; color: var(--text-primary);">
          <li>핵심 개념을 이해하고 설명할 수 있다.</li>
          <li>관련 문제를 풀 수 있다.</li>
          <li>실생활에 적용할 수 있다.</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: var(--text-primary); font-size: 20px; margin-bottom: 15px;">✏️ 주요 내용</h2>
        <div style="background: var(--primary-light); padding: 20px; border-radius: 8px; border-left: 4px solid var(--primary-color);">
          <p style="margin: 0; line-height: 1.8; color: var(--text-primary);">
            이 자료는 AI가 생성한 샘플 콘텐츠입니다. 실제 서비스에서는 사용자의 요청에 맞는 맞춤형 수업 자료가 생성됩니다.
          </p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: var(--text-primary); font-size: 20px; margin-bottom: 15px;">💡 예시 문제</h2>
        <div style="background: var(--white); padding: 20px; border-radius: 8px; border: 2px solid var(--border-color);">
          <p style="margin: 0 0 15px 0; font-weight: 600; color: var(--text-primary);">문제 1. 다음 문제를 풀어보세요.</p>
          <p style="margin: 0; color: var(--text-secondary); line-height: 1.8;">
            (예시 문제가 여기에 표시됩니다)
          </p>
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #FFF9E6 0%, #FFE8B3 100%); padding: 20px; border-radius: 8px; border: 2px solid var(--secondary-color);">
        <p style="margin: 0; font-size: 14px; color: var(--text-primary); line-height: 1.6;">
          💡 <strong>Tip:</strong> 채팅창에서 "슬라이드 추가해줘", "문제 난이도 높여줘" 등의 요청으로 자료를 수정할 수 있습니다.
        </p>
      </div>
    </div>
  `;
  
  previewContent.innerHTML = documentHTML;
  
  // 자동 저장 트리거
  triggerAutoSave();
}

// 미리보기 업데이트 (대화 데이터 기반)
function updatePreviewWithData(data) {
  const previewContent = document.getElementById('previewContent');
  const { type, grade, format, additional } = data;
  
  // 자료 정보 저장
  currentMaterial.title = `${grade} ${type}`;
  currentMaterial.type = type;
  currentMaterial.grade = grade;
  currentMaterial.format = format;
  
  // 자료를 3-4개 장으로 생성
  generateMaterialPages(data);
  
  // 첫 번째 카테고리를 활성 탭으로 설정
  if (currentMaterial.pages.length > 0) {
    const uniqueCategories = [...new Set(currentMaterial.pages.map(p => p.category))];
    activeTab = uniqueCategories[0];
  }
  
  // preview-header 업데이트
  updatePreviewHeader();
  
  // 탭 기반 미리보기 렌더링
  const documentHTML = renderTabbasedPreview();
  
  previewContent.innerHTML = documentHTML;
  
  // 탭 클릭 이벤트 바인딩
  bindTabEvents();
  
  // 자동 저장 트리거
  triggerAutoSave();
}

// 미리보기만 새로고침 (현재 탭 유지)
function refreshPreview() {
  const previewContent = document.getElementById('previewContent');
  if (previewContent && currentMaterial.pages.length > 0) {
    const documentHTML = renderTabbasedPreview();
    previewContent.innerHTML = documentHTML;
    
    // 탭 클릭 이벤트 바인딩
    bindTabEvents();
  }
  
  // preview-header 업데이트
  updatePreviewHeader();
}

// preview-header 업데이트
function updatePreviewHeader() {
  const titleElement = document.getElementById('previewMainTitle');
  const metaElement = document.getElementById('previewMeta');
  
  if (titleElement && currentMaterial.title) {
    titleElement.textContent = currentMaterial.title;
  } else if (titleElement) {
    titleElement.textContent = '📄 미리보기';
  }
  
  if (metaElement && currentMaterial.format) {
    const pageCount = currentMaterial.pages.length;
    metaElement.textContent = `${currentMaterial.format} · ${pageCount}장`;
    metaElement.style.display = 'inline';
  } else if (metaElement) {
    metaElement.textContent = '';
    metaElement.style.display = 'none';
  }
}

// 자료를 여러 장으로 생성
function generateMaterialPages(data) {
  const { type, grade, format, additional } = data;
  
  // 기존 페이지 초기화
  currentMaterial.pages = [];
  
  // 실제 샘플 데이터로 수업 자료 생성
  // 탭 1: 학습 목표 및 도입
  currentMaterial.pages.push({
    category: '학습 목표 및 도입',
    title: '순환소수는 무엇일까?',
    content: '순환소수의 개념과 표현 방법을 학습합니다.',
    hasImage: true,
    imageUrl: 'https://www.genspark.ai/api/files/s/UBYZ0fjv',
    icon: '🎯',
    pageNumber: 1
  });
  
  currentMaterial.pages.push({
    category: '학습 목표 및 도입',
    title: '함께 탐구',
    content: '위의 함께 탐구에서 분수를 소수로 나타낼 때, 소수점 아래에 0이 아닌 숫자가 무한 번 나타나는 경우를 알 수 있었다. 우리 생활에서 비슷한 경우를 찾아 짝과 얘기해보자.',
    hasImage: true,
    imageUrl: 'https://www.genspark.ai/api/files/s/6Rar2yGZ',
    icon: '🔍',
    pageNumber: 2
  });
  
  // 탭 2: 문제 적용하기
  currentMaterial.pages.push({
    category: '문제 적용하기',
    title: '문제 1',
    content: '다음 분수를 소수로 나타내고, 유한소수와 무한소수로 구분하시오.',
    hasImage: true,
    imageUrl: 'https://www.genspark.ai/api/files/s/iJskbpc8',
    icon: '📝',
    pageNumber: 3
  });
  
  // 탭 3: 내용 정리
  currentMaterial.pages.push({
    category: '내용 정리',
    title: '순환소수로 나타낼 수 있는 분수',
    content: '정수가 아닌 유리수를 기약분수로 나타냈을 때, 분모가 2 또는 5 이외의 소인수를 가지면 그 분수는 순환소수로 나타낼 수 있다.',
    hasImage: true,
    imageUrl: 'https://www.genspark.ai/api/files/s/PaJ7GfRi',
    icon: '📚',
    pageNumber: 4
  });
  
  // 탭 4: 역량 키우기
  currentMaterial.pages.push({
    category: '역량 키우기',
    title: '정수가 아닌 유리수 분류하기',
    content: '어느 날의 날짜 a월 b일을 분수 a/b로 나타낼 때, 유한소수로 나타낼 수 있는 날짜와 순환소수로만 나타낼 수 있는 날짜를 각각 3개 이상 찾아보자.',
    hasImage: true,
    imageUrl: 'https://www.genspark.ai/api/files/s/v4eS34CM',
    icon: '💪',
    pageNumber: 5
  });
}

// 탭 기반 미리보기 렌더링
function renderTabbasedPreview() {
  // 실제 존재하는 모든 카테고리를 동적으로 가져오기
  const uniqueCategories = [...new Set(currentMaterial.pages.map(p => p.category))];
  
  // 기본 4개 카테고리는 순서 유지, 나머지는 뒤에 추가
  const defaultCategories = ['학습 목표 및 도입', '문제 적용하기', '내용 정리', '역량 키우기'];
  const categories = [
    ...defaultCategories.filter(cat => uniqueCategories.includes(cat)),
    ...uniqueCategories.filter(cat => !defaultCategories.includes(cat))
  ];
  
  // 자료가 없으면 빈 상태
  if (currentMaterial.pages.length === 0) {
    return `
      <div class="preview-empty">
        <div class="empty-icon">📄</div>
        <p class="empty-text">생성된 자료가 여기에 표시됩니다</p>
        <p class="empty-subtext">AI와 대화하여 수업 자료를 만들어보세요</p>
      </div>
    `;
  }
  
  return `
    <div class="tabbed-preview">
      <!-- 탭 네비게이션 -->
      <div class="tabs-container">
        ${categories.map(cat => renderTab(cat)).join('')}
        <div class="tab-edit-controls">
          <button class="tab-add-btn" onclick="addNewTab()" title="탭 추가">+</button>
        </div>
      </div>
      
      <!-- 탭별 자료 미리보기 -->
      <div class="tab-content-area">
        ${renderTabContent()}
      </div>
    </div>
  `;
}

// 현재 활성 탭의 자료만 렌더링
function renderTabContent() {
  const pages = currentMaterial.pages.filter(p => p.category === activeTab);
  
  if (pages.length === 0) {
    return `
      <div class="preview-empty">
        <div class="empty-icon">📄</div>
        <p class="empty-text">"${activeTab}" 탭에 생성된 모듈이 없습니다</p>
        <p class="empty-subtext">편집 모드에서 모듈을 추가하거나 AI에게 요청해보세요</p>
      </div>
    `;
  }
  
  return `
    <div class="preview-document">
      <div class="document-section" id="section-${activeTab.replace(/\s/g, '-')}" data-category="${activeTab}">
        <div class="section-header">
          <div class="section-icon">${getCategoryIcon(activeTab)}</div>
          <h2 class="section-title" data-original-name="${activeTab}">${activeTab}</h2>
          <div class="tab-edit-controls">
            <button class="tab-edit-btn" onclick="editTabName('${activeTab}')" title="탭 이름 수정">✎</button>
            <button class="tab-delete-btn" onclick="deleteTab('${activeTab}')" title="탭 삭제">−</button>
          </div>
        </div>
        ${pages.map((page, index) => renderPageContent(page, index, pages.length)).join('')}
      </div>
    </div>
  `;
}

// 카테고리 아이콘 가져오기
function getCategoryIcon(category) {
  const icons = {
    '학습 목표 및 도입': '🎯',
    '문제 적용하기': '📝',
    '내용 정리': '📚',
    '역량 키우기': '💪',
    '정리 정의': '📐',
    '실생활 예시': '🌍',
    '수학적 계산': '🧮',
    '응용 문제': '🎯'
  };
  return icons[category] || '📋';
}

// 페이지 내용 렌더링 (실제 문서 스타일 - 모듈)
function renderPageContent(page, index, totalPages) {
  return `
    <div class="page-content-block module-block" data-page-id="${page.pageNumber}" data-category="${page.category}">
      <div class="page-content-header">
        <div class="page-header-left">
          <span class="page-badge">${index + 1}/${totalPages}</span>
          <h3 class="page-content-title">${escapeHtml(page.title)}</h3>
        </div>
        <div class="module-controls">
          <button class="module-control-btn move-up" onclick="moveModuleUp('${page.category}', ${index})" title="위로 이동">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <button class="module-control-btn move-down" onclick="moveModuleDown('${page.category}', ${index})" title="아래로 이동">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <button class="module-control-btn add-module" onclick="addModuleAfter('${page.category}', ${index})" title="모듈 추가">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button class="module-control-btn delete-module" onclick="deleteModule('${page.category}', ${index})" title="모듈 삭제">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="page-content-body">
        ${page.hasImage && page.imageUrl ? `
          <div class="content-image-container">
            <img src="${page.imageUrl}" alt="${escapeHtml(page.title)}" class="content-image" />
          </div>
        ` : ''}
        
        ${page.content ? `<p class="content-paragraph">${escapeHtml(page.content)}</p>` : ''}
        
        ${!page.hasImage ? `
          <!-- 예시 콘텐츠 블록 -->
          <div class="content-box">
            <div class="content-box-header">
              <span class="content-box-icon">💡</span>
              <strong>핵심 내용</strong>
            </div>
            <div class="content-box-body">
              <p>이 부분에는 ${escapeHtml(page.title)}에 대한 상세한 설명과 예시가 포함됩니다.</p>
              <ul>
                <li>주요 개념 및 정의</li>
                <li>단계별 설명</li>
                <li>예제 및 연습 문제</li>
              </ul>
            </div>
          </div>
        ` : ''}
          </div>
        </div>
        
        ${page.category === '실생활 예시' ? `
          <div class="example-box">
            <div class="example-header">
              <span class="example-icon">🌟</span>
              <strong>실생활 적용 사례</strong>
            </div>
            <div class="example-body">
              <p>일상생활에서 이 개념을 어떻게 활용할 수 있는지 구체적인 사례를 통해 알아봅니다.</p>
            </div>
          </div>
        ` : ''}
        
        ${page.category === '수학적 계산' ? `
          <div class="problem-box">
            <div class="problem-header">
              <span class="problem-icon">📝</span>
              <strong>예제 문제</strong>
            </div>
            <div class="problem-body">
              <p><strong>문제.</strong> 다음 문제를 풀어보세요.</p>
              <div class="problem-solution">
                <p><strong>풀이.</strong> 단계별 풀이 과정이 여기에 표시됩니다.</p>
              </div>
            </div>
          </div>
        ` : ''}
        
        ${page.category === '응용 문제' ? `
          <div class="challenge-box">
            <div class="challenge-header">
              <span class="challenge-icon">🎯</span>
              <strong>도전 문제</strong>
            </div>
            <div class="challenge-body">
              <p>학습한 내용을 바탕으로 다음 문제를 해결해 봅시다.</p>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// 개별 탭 렌더링
function renderTab(category) {
  const pages = currentMaterial.pages.filter(p => p.category === category);
  const isActive = category === activeTab;
  
  // 카테고리별 아이콘
  const icons = {
    '정리 정의': '📐',
    '실생활 예시': '🌍',
    '수학적 계산': '🧮',
    '응용 문제': '🎯'
  };
  
  // 아이콘이 없는 경우 기본 아이콘 사용
  const icon = icons[category] || '📋';
  
  return `
    <div class="tab-wrapper ${isActive ? 'active' : ''}">
      <button class="tab-button" data-category="${category}">
        <span class="tab-icon">${icon}</span>
        <span class="tab-label">${category}</span>
        <span class="tab-count">${pages.length}</span>
      </button>
      <button class="tab-delete-x" onclick="event.stopPropagation(); deleteTab('${category}');" title="탭 삭제">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;
}

// 탭 클릭 이벤트 바인딩
function bindTabEvents() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      switchTab(category);
    });
  });
}

// 탭 전환 (콘텐츠 렌더링)
function switchTab(category) {
  activeTab = category;
  
  // 탭 버튼 상태 업데이트
  document.querySelectorAll('.tab-button').forEach(button => {
    if (button.getAttribute('data-category') === category) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // 미리보기 다시 렌더링 (현재 탭의 모듈만 표시)
  const previewContent = document.getElementById('previewContent');
  if (previewContent) {
    const documentHTML = renderTabbasedPreview();
    previewContent.innerHTML = documentHTML;
    
    // 탭 클릭 이벤트 다시 바인딩
    bindTabEvents();
  }
}

// HTML 이스케이프
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 다운로드 모달 관련 변수
let selectedDownloadFormat = 'ppt'; // 기본값: PPT

// 다운로드 모달 열기
function downloadPreview() {
  const modal = document.getElementById('downloadModal');
  if (modal) {
    modal.classList.add('active');
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
  }
}

// 다운로드 모달 닫기
function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) {
    modal.classList.remove('active');
    // body 스크롤 복원
    document.body.style.overflow = '';
  }
}

// 다운로드 파일 형식 선택
function selectDownloadFormat(button, format) {
  // 모든 버튼의 active 클래스 제거
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 선택된 버튼에 active 클래스 추가
  button.classList.add('active');
  
  // 선택된 형식 저장
  selectedDownloadFormat = format;
}

// 다운로드 확인
function confirmDownload() {
  const formatNames = {
    'ppt': 'PowerPoint (PPT)',
    'pdf': 'PDF 문서',
    'hwp': '한글 (HWP)',
    'html': 'HTML 웹 문서'
  };
  
  const formatName = formatNames[selectedDownloadFormat] || selectedDownloadFormat.toUpperCase();
  const fileName = currentMaterial.title || '수업자료';
  
  alert(`💾 다운로드 시작!\n\n파일명: ${fileName}.${selectedDownloadFormat}\n형식: ${formatName}\n\n※ 데모 버전에서는 실제 다운로드가 지원되지 않습니다.\n실제 서비스에서는 선택한 형식으로 다운로드됩니다.`);
  
  closeDownloadModal();
}

// 바로 인쇄하기
function printPreview() {
  alert('🖨️ 인쇄 준비 중...\n\n※ 데모 버전에서는 실제 인쇄가 지원되지 않습니다.\n실제 서비스에서는 브라우저의 인쇄 대화상자가 열립니다.');
  
  closeDownloadModal();
  
  // 실제 서비스에서는 아래 코드 사용
  // window.print();
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeDownloadModal();
    closeShareModal();
  }
});

// ==================== 공유하기 모달 ====================

// 공유 방식 관련 변수
let selectedShareMethod = 'link'; // 기본값: 링크 복사

// 공유하기 모달 열기
function sharePreview() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.add('active');
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
    
    // 기본적으로 링크 영역 표시
    showShareResult('link');
  }
}

// 공유하기 모달 닫기
function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.remove('active');
    // body 스크롤 복원
    document.body.style.overflow = '';
  }
}

// 공유 방식 선택
function selectShareMethod(button, method) {
  // 모든 버튼의 active 클래스 제거
  document.querySelectorAll('.share-method-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 선택된 버튼에 active 클래스 추가
  button.classList.add('active');
  
  // 선택된 방식 저장
  selectedShareMethod = method;
  
  // 해당 결과 영역 표시
  showShareResult(method);
}

// 공유 결과 영역 표시
function showShareResult(method) {
  const linkArea = document.getElementById('linkShareArea');
  const qrArea = document.getElementById('qrShareArea');
  
  if (method === 'link') {
    linkArea.style.display = 'block';
    qrArea.style.display = 'none';
  } else if (method === 'qr') {
    linkArea.style.display = 'none';
    qrArea.style.display = 'block';
  }
}

// 링크 복사하기
function copyShareLink() {
  const linkInput = document.getElementById('shareLinkInput');
  
  if (linkInput) {
    // 텍스트 선택
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // 모바일 지원
    
    // 클립보드에 복사
    try {
      document.execCommand('copy');
      
      // 성공 메시지
      alert('✅ 링크가 클립보드에 복사되었습니다!\n\n다른 사람과 공유해보세요.');
      
      // 실제 서비스에서는 아래와 같이 사용
      // navigator.clipboard.writeText(linkInput.value).then(() => {
      //   showToast('링크가 복사되었습니다');
      // });
    } catch (err) {
      alert('❌ 복사에 실패했습니다. 링크를 수동으로 복사해주세요.');
    }
  }
}

// QR 코드 이미지 복사
function copyQRCode() {
  alert('✅ QR 코드 이미지가 클립보드에 복사되었습니다!\n\n※ 데모 버전에서는 실제 복사가 지원되지 않습니다.\n실제 서비스에서는 QR 이미지가 클립보드에 복사됩니다.');
  
  // 실제 서비스에서는 canvas를 이용한 이미지 복사
  // const qrBox = document.getElementById('qrCodeBox');
  // html2canvas(qrBox).then(canvas => {
  //   canvas.toBlob(blob => {
  //     navigator.clipboard.write([
  //       new ClipboardItem({ 'image/png': blob })
  //     ]);
  //   });
  // });
}

// QR 코드 다운로드
function downloadQRCode() {
  const fileName = currentMaterial.title || '수업자료';
  
  alert(`💾 QR 코드 다운로드 시작!\n\n파일명: ${fileName}_QR.png\n\n※ 데모 버전에서는 실제 다운로드가 지원되지 않습니다.\n실제 서비스에서는 QR 이미지가 PNG 파일로 다운로드됩니다.`);
  
  // 실제 서비스에서는 아래와 같이 구현
  // const qrBox = document.getElementById('qrCodeBox');
  // html2canvas(qrBox).then(canvas => {
  //   const link = document.createElement('a');
  //   link.download = `${fileName}_QR.png`;
  //   link.href = canvas.toDataURL();
  //   link.click();
  // });
}

// 자동 저장 상태 표시
function showAutoSaveStatus() {
  const statusElement = document.getElementById('autoSaveStatus');
  const saveTimeText = document.getElementById('saveTimeText');
  
  if (!statusElement || !saveTimeText) return;
  
  // 현재 시간 저장
  lastSaveTime = new Date();
  
  // 시간 포맷팅 (HH:MM)
  const hours = String(lastSaveTime.getHours()).padStart(2, '0');
  const minutes = String(lastSaveTime.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  
  // 텍스트 업데이트
  saveTimeText.textContent = `${timeString}에 저장됨`;
  
  // 표시
  statusElement.classList.add('show');
  
  // 3초 후 숨김
  setTimeout(() => {
    statusElement.classList.remove('show');
  }, 3000);
}

// 자동 저장 트리거
function triggerAutoSave() {
  // 기존 타이머 취소
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }
  
  // 2초 후 자동 저장
  autoSaveTimer = setTimeout(() => {
    // 실제로는 서버에 저장하는 로직
    console.log('자동 저장 실행:', new Date());
    
    // 상태 표시
    showAutoSaveStatus();
  }, 2000);
}

// ==================== 편집 모드 ====================

// 편집/읽기 모드 토글
function toggleEditMode() {
  isEditMode = !isEditMode;
  
  const previewSection = document.getElementById('previewSection');
  const modeToggleBtn = document.getElementById('modeToggleBtn');
  const readOption = document.getElementById('readOption');
  const editOption = document.getElementById('editOption');
  const toggleSlider = document.getElementById('toggleSlider');
  const markerBtn = document.getElementById('markerBtn');
  
  if (isEditMode) {
    // 편집 모드 활성화
    if (previewSection) previewSection.classList.add('edit-mode');
    if (modeToggleBtn) modeToggleBtn.classList.add('edit-active');
    
    // 토글 옵션 변경
    if (readOption) readOption.classList.remove('active');
    if (editOption) editOption.classList.add('active');
    
    // 슬라이더 이동
    if (toggleSlider) {
      toggleSlider.style.transform = 'translateX(100%)';
    }
    
    // 마커 모드 비활성화 (편집 모드에서는 마커 사용 안 함)
    if (markerMode) {
      toggleMarkerMode(); // 마커 모드 끄기
    }
    
    // 위치 지정 버튼 비활성화
    if (markerBtn) {
      markerBtn.disabled = true;
      markerBtn.style.opacity = '0.5';
      markerBtn.style.cursor = 'not-allowed';
    }
    
    // 편집 가능한 요소들 활성화
    enableEditing();
  } else {
    // 읽기 모드로 복귀
    if (previewSection) previewSection.classList.remove('edit-mode');
    if (modeToggleBtn) modeToggleBtn.classList.remove('edit-active');
    
    // 토글 옵션 변경
    if (readOption) readOption.classList.add('active');
    if (editOption) editOption.classList.remove('active');
    
    // 슬라이더 이동
    if (toggleSlider) {
      toggleSlider.style.transform = 'translateX(0)';
    }
    
    // 위치 지정 버튼 활성화
    if (markerBtn) {
      markerBtn.disabled = false;
      markerBtn.style.opacity = '1';
      markerBtn.style.cursor = 'pointer';
    }
    
    // 편집 비활성화
    disableEditing();
    
    // 변경사항 저장
    saveEditChanges();
  }
}

// 편집 활성화
function enableEditing() {
  // 자료 제목 편집 가능
  const mainTitle = document.getElementById('previewMainTitle');
  if (mainTitle && mainTitle.textContent !== '📄 미리보기') {
    mainTitle.setAttribute('contenteditable', 'true');
  }
  
  // 섹션 제목 편집 가능
  document.querySelectorAll('.section-title').forEach(title => {
    title.setAttribute('contenteditable', 'true');
  });
  
  // 페이지 제목 편집 가능
  document.querySelectorAll('.page-content-title').forEach(title => {
    title.setAttribute('contenteditable', 'true');
  });
  
  // 본문 내용 편집 가능
  document.querySelectorAll('.content-paragraph').forEach(paragraph => {
    paragraph.setAttribute('contenteditable', 'true');
  });
  
  // 콘텐츠 박스 내용 편집 가능
  document.querySelectorAll('.content-box-body p').forEach(p => {
    p.setAttribute('contenteditable', 'true');
  });
}

// 편집 비활성화
function disableEditing() {
  // 모든 contenteditable 속성 제거
  document.querySelectorAll('[contenteditable="true"]').forEach(element => {
    element.removeAttribute('contenteditable');
  });
}

// 편집 변경사항 저장
function saveEditChanges() {
  // 자료 제목 업데이트
  const mainTitle = document.getElementById('previewMainTitle');
  if (mainTitle && mainTitle.textContent !== '📄 미리보기') {
    currentMaterial.title = mainTitle.textContent.trim();
  }
  
  // 섹션별 내용 업데이트 및 탭 이름 변경 처리
  const sections = document.querySelectorAll('.document-section');
  let tabNameChanged = false;
  
  sections.forEach((section) => {
    const sectionTitle = section.querySelector('.section-title');
    const originalCategory = sectionTitle?.getAttribute('data-original-name');
    const newCategory = sectionTitle?.textContent.trim();
    
    // 탭 이름이 변경된 경우
    if (originalCategory && newCategory && originalCategory !== newCategory) {
      // 해당 카테고리의 모든 페이지 업데이트
      currentMaterial.pages.forEach(page => {
        if (page.category === originalCategory) {
          page.category = newCategory;
        }
      });
      
      // 현재 활성 탭도 업데이트
      if (activeTab === originalCategory) {
        activeTab = newCategory;
      }
      
      // data-original-name 속성 업데이트
      sectionTitle.setAttribute('data-original-name', newCategory);
      tabNameChanged = true;
    }
    
    // 페이지 내용 업데이트
    const pages = section.querySelectorAll('.page-content-block');
    const currentCategory = newCategory || originalCategory;
    
    pages.forEach((page) => {
      const pageTitle = page.querySelector('.page-content-title');
      const pageContent = page.querySelector('.content-paragraph');
      
      if (pageTitle && pageContent) {
        // currentMaterial.pages 업데이트
        const pageData = currentMaterial.pages.find(p => 
          p.category === currentCategory
        );
        
        if (pageData) {
          pageData.title = pageTitle.textContent.trim();
          pageData.content = pageContent.textContent.trim();
        }
      }
    });
  });
  
  // 탭 이름이 변경된 경우 미리보기 새로고침
  if (tabNameChanged) {
    refreshPreview();
  }
  
  // 자동 저장 트리거
  triggerAutoSave();
  
  alert('✅ 변경사항이 저장되었습니다!');
}

// 탭 추가
function addNewTab() {
  const newCategory = prompt('새로운 탭 이름을 입력하세요:', '새 섹션');
  
  if (newCategory && newCategory.trim()) {
    // 새 페이지 추가
    const newPage = {
      category: newCategory.trim(),
      title: '새 페이지',
      content: '여기에 내용을 입력하세요.',
      pageNumber: currentMaterial.pages.length + 1,
      icon: '📄'
    };
    
    currentMaterial.pages.push(newPage);
    
    // 새 탭으로 전환
    activeTab = newCategory.trim();
    
    // 미리보기 업데이트
    refreshPreview();
    
    // 자동 저장
    triggerAutoSave();
    
    alert(`✅ "${newCategory}" 탭이 추가되었습니다!`);
  }
}

// 탭 이름 수정
function editTabName(oldCategory) {
  const newCategory = prompt(`탭 이름을 수정하세요:`, oldCategory);
  
  if (newCategory && newCategory.trim() && newCategory !== oldCategory) {
    const trimmedName = newCategory.trim();
    
    // 중복 체크
    const isDuplicate = currentMaterial.pages.some(p => p.category === trimmedName && p.category !== oldCategory);
    if (isDuplicate) {
      alert('⚠️ 이미 존재하는 탭 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }
    
    // 해당 카테고리의 모든 페이지 업데이트
    currentMaterial.pages.forEach(page => {
      if (page.category === oldCategory) {
        page.category = trimmedName;
      }
    });
    
    // 현재 활성 탭도 업데이트
    if (activeTab === oldCategory) {
      activeTab = trimmedName;
    }
    
    // 미리보기 업데이트
    refreshPreview();
    
    // 자동 저장
    triggerAutoSave();
    
    alert(`✅ 탭 이름이 "${oldCategory}"에서 "${trimmedName}"(으)로 변경되었습니다!`);
  }
}

// 탭 삭제
function deleteTab(category) {
  if (confirm(`"${category}" 탭과 관련된 모든 페이지를 삭제하시겠습니까?`)) {
    // 해당 카테고리의 페이지들 삭제
    currentMaterial.pages = currentMaterial.pages.filter(p => p.category !== category);
    
    // 삭제한 탭이 현재 활성 탭이면 다른 탭으로 전환
    if (activeTab === category) {
      const remainingCategories = ['학습 목표 및 도입', '문제 적용하기', '내용 정리', '역량 키우기'].filter(cat => 
        currentMaterial.pages.some(p => p.category === cat)
      );
      activeTab = remainingCategories.length > 0 ? remainingCategories[0] : '학습 목표 및 도입';
    }
    
    // 미리보기 업데이트
    refreshPreview();
    
    // 자동 저장
    triggerAutoSave();
    
    alert(`✅ "${category}" 탭이 삭제되었습니다!`);
  }
}

// ==================== 모듈 관리 ====================

// 모듈 위로 이동
function moveModuleUp(category, index) {
  const categoryPages = currentMaterial.pages.filter(p => p.category === category);
  
  if (index === 0) {
    alert('⚠️ 이미 첫 번째 모듈입니다.');
    return;
  }
  
  // 전체 페이지 배열에서 해당 카테고리의 페이지들 찾기
  const allPages = currentMaterial.pages;
  const categoryIndices = [];
  allPages.forEach((page, i) => {
    if (page.category === category) {
      categoryIndices.push(i);
    }
  });
  
  // 해당 인덱스의 페이지와 이전 페이지 교환
  const targetIndex = categoryIndices[index];
  const prevIndex = categoryIndices[index - 1];
  
  [allPages[targetIndex], allPages[prevIndex]] = [allPages[prevIndex], allPages[targetIndex]];
  
  // 미리보기 업데이트
  refreshPreview();
  
  // 자동 저장
  triggerAutoSave();
}

// 모듈 아래로 이동
function moveModuleDown(category, index) {
  const categoryPages = currentMaterial.pages.filter(p => p.category === category);
  
  if (index === categoryPages.length - 1) {
    alert('⚠️ 이미 마지막 모듈입니다.');
    return;
  }
  
  // 전체 페이지 배열에서 해당 카테고리의 페이지들 찾기
  const allPages = currentMaterial.pages;
  const categoryIndices = [];
  allPages.forEach((page, i) => {
    if (page.category === category) {
      categoryIndices.push(i);
    }
  });
  
  // 해당 인덱스의 페이지와 다음 페이지 교환
  const targetIndex = categoryIndices[index];
  const nextIndex = categoryIndices[index + 1];
  
  [allPages[targetIndex], allPages[nextIndex]] = [allPages[nextIndex], allPages[targetIndex]];
  
  // 미리보기 업데이트
  refreshPreview();
  
  // 자동 저장
  triggerAutoSave();
}

// 모듈 추가 (특정 위치 뒤에)
function addModuleAfter(category, index) {
  const newModule = {
    category: category,
    title: '새 모듈',
    content: '여기에 내용을 입력하세요.',
    pageNumber: currentMaterial.pages.length + 1,
    icon: getCategoryIcon(category)
  };
  
  // 전체 페이지 배열에서 해당 카테고리의 페이지들 찾기
  const allPages = currentMaterial.pages;
  const categoryIndices = [];
  allPages.forEach((page, i) => {
    if (page.category === category) {
      categoryIndices.push(i);
    }
  });
  
  // 해당 인덱스 뒤에 삽입
  const insertPosition = categoryIndices[index] + 1;
  allPages.splice(insertPosition, 0, newModule);
  
  // 미리보기 업데이트
  refreshPreview();
  
  // 자동 저장
  triggerAutoSave();
}

// 모듈 삭제
function deleteModule(category, index) {
  const categoryPages = currentMaterial.pages.filter(p => p.category === category);
  
  if (categoryPages.length === 1) {
    alert('⚠️ 마지막 모듈은 삭제할 수 없습니다. 탭을 삭제하려면 탭 삭제 버튼을 사용하세요.');
    return;
  }
  
  if (!confirm('이 모듈을 삭제하시겠습니까?')) {
    return;
  }
  
  // 전체 페이지 배열에서 해당 카테고리의 페이지들 찾기
  const allPages = currentMaterial.pages;
  const categoryIndices = [];
  allPages.forEach((page, i) => {
    if (page.category === category) {
      categoryIndices.push(i);
    }
  });
  
  // 해당 인덱스의 페이지 삭제
  const deleteIndex = categoryIndices[index];
  allPages.splice(deleteIndex, 1);
  
  // 미리보기 업데이트
  refreshPreview();
  
  // 자동 저장
  triggerAutoSave();
  
  alert('✅ 모듈이 삭제되었습니다!');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 리사이저 초기화
  initResizer();
  
  // 채팅 입력창 포커스
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.focus();
  }
  
  // 사용 팁 표시 상태 확인 (로컬 스토리지)
  const tipsHidden = localStorage.getItem('usageTipsHidden');
  if (tipsHidden === 'true') {
    const usageTips = document.getElementById('usageTips');
    if (usageTips) {
      usageTips.classList.add('hidden');
    }
  }
});

// 사용 팁 닫기
function closeUsageTips() {
  const usageTips = document.getElementById('usageTips');
  if (usageTips) {
    usageTips.style.display = 'none';
    usageTips.classList.add('hidden');
    localStorage.setItem('usageTipsHidden', 'true');
  }
}

// 사용 팁 다시 보기 (필요시 사용)
function showUsageTips() {
  const usageTips = document.getElementById('usageTips');
  if (usageTips) {
    usageTips.classList.remove('hidden');
    localStorage.setItem('usageTipsHidden', 'false');
  }
}

// ==================== Position Marker 기능 ====================
let positionMarkers = [];
let markerMode = false;
let markerCounter = 0; // 마커 순서 카운터

// Position Marker 활성화/비활성화
window.toggleMarkerMode = function() {
  console.log('🔄 toggleMarkerMode 호출됨, 현재 markerMode:', markerMode);
  
  markerMode = !markerMode;
  console.log('🔄 markerMode 변경됨:', markerMode);
  
  const previewContent = document.querySelector('.preview-content');
  const markerBtn = document.getElementById('markerBtn');
  
  console.log('📦 요소 확인:', {
    previewContent: !!previewContent,
    markerBtn: !!markerBtn
  });
  
  if (markerMode) {
    console.log('📍 위치 지정 모드 활성화 - preview-content 내부만 클릭 가능');
    if (previewContent) {
      previewContent.style.cursor = 'crosshair';
      console.log('✅ 커서 변경: crosshair');
    }
    if (markerBtn) {
      markerBtn.classList.add('active');
      markerBtn.style.backgroundColor = '#2563EB';
      console.log('✅ 버튼 활성화 스타일 적용');
    }
    
    // 클릭 이벤트 리스너 추가 (preview-content에만)
    addMarkerClickListener();
  } else {
    console.log('📍 위치 지정 모드 비활성화');
    if (previewContent) {
      previewContent.style.cursor = 'default';
      console.log('✅ 커서 복원: default');
    }
    if (markerBtn) {
      markerBtn.classList.remove('active');
      markerBtn.style.backgroundColor = '';
      console.log('✅ 버튼 스타일 제거');
    }
    
    // 클릭 이벤트 리스너 제거
    removeMarkerClickListener();
  }
};

// 마커 클릭 이벤트 리스너 추가
let markerClickHandler = null;

function addMarkerClickListener() {
  console.log('🎯 addMarkerClickListener 호출됨');
  const previewContent = document.querySelector('.preview-content');
  
  if (!previewContent) {
    console.error('❌ preview-content 요소를 찾을 수 없습니다');
    return;
  }
  
  console.log('✅ preview-content 찾음:', previewContent);
  
  markerClickHandler = function(e) {
    console.log('🖱️ preview-content 클릭 감지됨');
    
    // preview-content 내부인지 확인
    if (!e.target.closest('.preview-content')) {
      console.log('⚠️ preview-content 외부 클릭 - 마커 생성 안함');
      return;
    }
    
    console.log('✅ preview-content 내부 클릭 확인됨');
    
    e.preventDefault();
    e.stopPropagation();
    
    // 마커 생성 - 정확한 위치 계산
    const rect = previewContent.getBoundingClientRect();
    const scrollLeft = previewContent.scrollLeft;
    const scrollTop = previewContent.scrollTop;
    
    // 클릭 위치 계산 (스크롤 고려)
    const x = e.clientX - rect.left + scrollLeft;
    const y = e.clientY - rect.top + scrollTop;
    
    console.log(`📍 클릭 위치: clientX=${e.clientX}, clientY=${e.clientY}`);
    console.log(`📍 rect: left=${rect.left}, top=${rect.top}`);
    console.log(`📍 scroll: left=${scrollLeft}, top=${scrollTop}`);
    console.log(`📍 최종 위치: x=${x}, y=${y}`);
    
    addPositionMarker(x, y, e.target);
  };
  
  previewContent.addEventListener('click', markerClickHandler, true);
  console.log('✅ 클릭 이벤트 리스너 등록 완료');
}

function removeMarkerClickListener() {
  console.log('🗑️ removeMarkerClickListener 호출됨');
  const previewContent = document.querySelector('.preview-content');
  if (previewContent && markerClickHandler) {
    previewContent.removeEventListener('click', markerClickHandler, true);
  }
}

// Position Marker 추가 (클릭 시에만 생성)
function addPositionMarker(x, y, element) {
  markerCounter++;
  const markerId = `marker-${Date.now()}-${markerCounter}`;
  const markerNumber = markerCounter;
  
  const marker = {
    id: markerId,
    number: markerNumber,
    x: x,
    y: y,
    element: element,
    text: element ? element.textContent.substring(0, 50).trim() : ''
  };
  
  positionMarkers.push(marker);
  console.log(`📍 마커 #${markerNumber} 생성됨 (${x}, ${y})`);
  
  // 마커 DOM 생성 (파란색 원형만)
  const markerEl = document.createElement('div');
  markerEl.id = markerId;
  markerEl.className = 'position-marker';
  markerEl.style.position = 'absolute';
  markerEl.style.left = `${x}px`;
  markerEl.style.top = `${y}px`;
  markerEl.style.transform = 'translate(-50%, -50%)';
  markerEl.style.zIndex = '1000';
  markerEl.innerHTML = `
    <div class="marker-circle">
      <span class="marker-number">${markerNumber}</span>
    </div>
  `;
  
  // 마커 클릭 시 삭제
  markerEl.addEventListener('click', function(e) {
    e.stopPropagation();
    removeMarker(markerId);
  });
  
  const previewContent = document.querySelector('.preview-content');
  if (previewContent) {
    previewContent.appendChild(markerEl);
  }
  
  // 채팅 영역에 마커 표시 (첨부파일처럼)
  addMarkerToChat(marker);
  
  return markerId;
}

// 채팅 영역에 마커 표시
function addMarkerToChat(marker) {
  const attachedFilesList = document.getElementById('attachedFilesList');
  if (!attachedFilesList) return;
  
  const markerItem = document.createElement('div');
  markerItem.className = 'attached-file-item marker-item';
  markerItem.id = `chat-${marker.id}`;
  markerItem.innerHTML = `
    <div class="file-icon" style="background: linear-gradient(135deg, #3B82F6, #2563EB);">
      <span style="font-size: 18px; font-weight: bold; color: white;">${marker.number}</span>
    </div>
    <div class="file-info">
      <div class="file-name">위치 마커 #${marker.number}</div>
      <div class="file-size">${marker.text || '콘텐츠 영역'}</div>
    </div>
    <button class="file-remove-btn" onclick="removeMarkerFromChat('${marker.id}')" title="마커 제거">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  `;
  
  attachedFilesList.appendChild(markerItem);
  attachedFilesList.style.display = 'flex';
  
  // 첨부 파일 개수 업데이트
  updateAttachmentBadge();
}

// 채팅에서 마커 제거
window.removeMarkerFromChat = function(markerId) {
  // DOM에서 마커 제거
  const markerEl = document.getElementById(markerId);
  if (markerEl) {
    markerEl.remove();
  }
  
  // 채팅 영역에서 제거
  const chatMarker = document.getElementById(`chat-${markerId}`);
  if (chatMarker) {
    chatMarker.remove();
  }
  
  // 배열에서 제거
  positionMarkers = positionMarkers.filter(m => m.id !== markerId);
  
  // 첨부 파일 개수 업데이트
  updateAttachmentBadge();
  
  console.log(`🗑️ 마커 ${markerId} 제거됨`);
};

// 마커 제거
function removeMarker(markerId) {
  removeMarkerFromChat(markerId);
}

// 모든 마커 제거
window.clearAllMarkers = function() {
  positionMarkers.forEach(marker => {
    const markerEl = document.getElementById(marker.id);
    if (markerEl) markerEl.remove();
    
    const chatMarker = document.getElementById(`chat-${marker.id}`);
    if (chatMarker) chatMarker.remove();
  });
  
  positionMarkers = [];
  markerCounter = 0;
  updateAttachmentBadge();
  console.log('🗑️ 모든 마커 제거됨');
};

// 첨부 파일 배지 업데이트
function updateAttachmentBadge() {
  const attachedFilesList = document.getElementById('attachedFilesList');
  if (!attachedFilesList) return;
  
  const items = attachedFilesList.querySelectorAll('.attached-file-item');
  const sendBtn = document.getElementById('sendBtn');
  const badge = sendBtn ? sendBtn.querySelector('.attachment-badge') : null;
  
  if (items.length === 0) {
    attachedFilesList.style.display = 'none';
    if (badge) badge.style.display = 'none';
  } else {
    attachedFilesList.style.display = 'flex';
    if (badge) {
      badge.textContent = items.length;
      badge.style.display = 'flex';
    }
  }
}

// ==================== 초기화 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎓 VI-ZONE 수업 자료 생성 페이지 로드 완료');
  console.log('📍 Position Marker 기능 활성화');
  
  // 위치 지정 버튼 이벤트 바인딩
  const markerBtn = document.getElementById('markerBtn');
  if (markerBtn) {
    console.log('✅ 위치 지정 버튼 찾음:', markerBtn);
    
    // onclick 속성 제거하고 이벤트 리스너로 대체
    markerBtn.removeAttribute('onclick');
    
    markerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('🖱️ 위치 지정 버튼 클릭됨');
      
      // 편집 모드에서는 작동 안 함
      if (isEditMode) {
        console.log('⚠️ 편집 모드에서는 위치 지정 불가');
        return;
      }
      
      // toggleMarkerMode 함수 직접 호출
      if (typeof window.toggleMarkerMode === 'function') {
        console.log('✅ toggleMarkerMode 함수 호출');
        window.toggleMarkerMode();
      } else {
        console.error('❌ toggleMarkerMode 함수를 찾을 수 없습니다');
      }
    });
    
    console.log('✅ 위치 지정 버튼 이벤트 리스너 등록 완료');
  } else {
    console.error('❌ 위치 지정 버튼을 찾을 수 없습니다');
  }
  
  console.log('✅ 모든 기능 준비 완료');
});
