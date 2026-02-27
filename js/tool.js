// ==================== 도구 제작 페이지 (tool.html) 전용 스크립트 ====================
console.log('🔧 VI-ZONE 도구 제작 페이지 로드됨');

// 선택된 템플릿 저장
let selectedTemplate = null;

// 페이지 로드 시 템플릿 선택 모달 표시
document.addEventListener('DOMContentLoaded', function() {
  console.log('📋 템플릿 선택 모달 표시 준비');
  
  const templateModal = document.getElementById('templateModal');
  if (templateModal) {
    console.log('✅ templateModal 요소 찾음');
    // 모달 표시
    templateModal.style.display = 'flex';
    console.log('✅ 모달 display 설정 완료:', templateModal.style.display);
    
    // 오버레이 클릭 시 닫기 (X 버튼이 있으므로 오버레이 클릭도 허용)
    const overlay = templateModal.querySelector('.template-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        closeTemplateModal();
      });
      console.log('✅ 오버레이 클릭 이벤트 등록 완료');
    }
  } else {
    console.error('❌ templateModal 요소를 찾을 수 없습니다');
  }
});

// 템플릿 모달 닫기 함수 (전역으로 노출)
window.closeTemplateModal = function closeTemplateModal() {
  console.log('❌ 템플릿 모달 닫기 (템플릿 선택하지 않음)');
  
  const templateModal = document.getElementById('templateModal');
  if (templateModal) {
    templateModal.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(() => {
      templateModal.style.display = 'none';
      
      // AI 메시지 추가
      addAIMessage('안녕하세요! 어떤 도구를 만들고 싶으신가요? 원하시는 기능이나 목적을 알려주세요!\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 도구를 생성할 수 있습니다!');
      
      // 입력창 placeholder 변경
      const chatInput = document.getElementById('chatInput');
      if (chatInput) {
        chatInput.placeholder = '예: 이차함수 그래프를 그려주는 계산기를 만들어주세요';
      }
      
    }, 300);
  }
}

// 템플릿 선택 함수 (전역으로 노출)
window.selectTemplate = function selectTemplate(templateType) {
  console.log('✅ 템플릿 선택됨:', templateType);
  
  selectedTemplate = templateType;
  
  // 템플릿 이름 매핑
  const templateNames = {
    'video': '영상 생성',
    'audio': '음성 생성',
    'image': '이미지 생성',
    'webtemplate': '웹툰 제작',
    'storybook': '스토리북',
    'chatbot': '챗봇 생성',
    'summary': '내용 요약',
    'game': '학습 게임',
    'engineering': '공학도구',
    'math': '수학도구'
  };
  
  // 템플릿별 맞춤형 AI 초기 멘트
  const templateMessages = {
    'video': '🎬 영상 생성 도구를 선택하셨네요!\n\n어떤 주제의 영상을 만들고 싶으신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 영상을 생성할 수 있습니다!',
    
    'audio': '🎤 음성 생성 도구를 선택하셨네요!\n\n어떤 목적의 오디오가 필요하신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 음성을 생성할 수 있습니다!',
    
    'image': '🖼️ 이미지 생성 도구를 선택하셨네요!\n\n어떤 이미지를 만들고 싶으신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 이미지를 생성할 수 있습니다!',
    
    'webtemplate': '🗺️ 웹툰 제작 도구를 선택하셨네요!\n\n어떤 스토리의 웹툰을 만들고 싶으신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 웹툰을 생성할 수 있습니다!',
    
    'storybook': '📚 스토리북 도구를 선택하셨네요!\n\n어떤 이야기를 담은 스토리북을 만들고 싶으신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 스토리북을 생성할 수 있습니다!',
    
    'chatbot': '🤖 챗봇 생성 도구를 선택하셨네요!\n\n어떤 역할의 챗봇을 만들고 싶으신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 챗봇을 생성할 수 있습니다!',
    
    'summary': '📝 내용 요약 도구를 선택하셨네요!\n\n어떤 내용을 요약하고 싶으신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 자동으로 요약할 수 있습니다!',
    
    'game': '🎮 학습 게임 도구를 선택하셨네요!\n\n어떤 게임 형식을 원하시나요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 게임을 생성할 수 있습니다!',
    
    'engineering': '⚙️ 공학도구를 선택하셨네요!\n\n어떤 공학 계산이나 시뮬레이션이 필요하신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 도구를 생성할 수 있습니다!',
    
    'math': '📐 수학도구를 선택하셨네요!\n\n어떤 수학 기능이 필요하신가요?\n\n💡 참고 자료를 업로드하시면 자료 내용을 기반으로 도구를 생성할 수 있습니다!'
  };
  
  // 템플릿별 placeholder 텍스트 (중고등학교 수학 예시)
  const templatePlaceholders = {
    'video': '예: 피타고라스의 정리를 설명하는 3분 영상을 만들어주세요',
    'audio': '예: 이차방정식 해의 공식을 설명하는 음성을 만들어주세요',
    'image': '예: 정규분포 그래프를 시각화한 이미지를 만들어주세요',
    'webtemplate': '예: 삼각함수를 배우는 학생의 이야기를 웹툰으로 만들어주세요',
    'storybook': '예: 함수의 개념을 이해하는 모험 이야기를 만들어주세요',
    'chatbot': '예: 미적분 질문에 답하는 수학 챗봇을 만들어주세요',
    'summary': '예: 행렬 단원의 핵심 내용을 요약해주세요',
    'game': '예: 인수분해를 연습할 수 있는 퀴즈 게임을 만들어주세요',
    'engineering': '예: 이차함수 그래프를 그려주는 계산기를 만들어주세요',
    'math': '예: 삼각비를 계산하는 도구를 만들어주세요'
  };
  
  const templateName = templateNames[templateType] || templateType;
  const aiMessage = templateMessages[templateType] || `좋아요! "${templateName}" 도구를 만들어드리겠습니다. 어떤 기능이 필요하신가요?`;
  const placeholderText = templatePlaceholders[templateType] || '예: 중2 일차함수 단원 PPT를 만들어주세요';
  
  console.log('📝 선택된 템플릿:', templateType);
  console.log('📝 Placeholder 텍스트:', placeholderText);
  
  // 모달 닫기 애니메이션
  const templateModal = document.getElementById('templateModal');
  if (templateModal) {
    templateModal.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(() => {
      templateModal.style.display = 'none';
      
      // AI 메시지 추가
      addAIMessage(aiMessage);
      
      // 미리보기 제목 변경
      updatePreviewTitle(templateName);
      
      // 입력창 placeholder 변경
      const chatInput = document.getElementById('chatInput');
      if (chatInput) {
        console.log('✅ chatInput 요소 찾음');
        console.log('🔄 Placeholder 변경 전:', chatInput.placeholder);
        chatInput.placeholder = placeholderText;
        console.log('✅ Placeholder 변경 후:', chatInput.placeholder);
      } else {
        console.error('❌ chatInput 요소를 찾을 수 없음');
      }
      
    }, 300);
  }
}

// AI 메시지 추가 함수
function addAIMessage(message) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  // 메시지를 줄바꿈 기준으로 분리하여 <p> 태그로 감싸기
  const paragraphs = message.split('\n').filter(line => line.trim() !== '');
  const messageHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      ${messageHTML}
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  
  // 스크롤을 아래로
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 미리보기 제목 업데이트 함수
function updatePreviewTitle(templateName) {
  const previewMainTitle = document.getElementById('previewMainTitle');
  if (previewMainTitle) {
    // '공학도구'와 '수학도구'는 이미 '도구'가 포함되어 있으므로 중복 제거
    let displayTitle = '';
    if (templateName === '공학도구' || templateName === '수학도구') {
      // 이미 '도구'가 포함되어 있으므로 중복하지 않음
      displayTitle = `🔧 ${templateName}`;
    } else {
      // 다른 템플릿은 '도구'를 추가
      displayTitle = `🔧 ${templateName} 도구`;
    }
    previewMainTitle.textContent = displayTitle;
    console.log('✅ 미리보기 제목 업데이트:', displayTitle);
  }
  
  // 미리보기 메타 정보 업데이트
  const previewMeta = document.getElementById('previewMeta');
  if (previewMeta) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    previewMeta.textContent = `${templateName} | ${dateStr}`;
  }
  
  // 템플릿 아이콘 활성화 상태 업데이트
  updateTemplateIconActive();
}

// 템플릿 바에서 선택 (전역 함수)
window.selectTemplateFromBar = function(templateType) {
  console.log('📌 템플릿 바에서 선택:', templateType);
  
  // 기존 selectTemplate 함수 호출
  selectTemplate(templateType);
  
  // 템플릿 아이콘 활성화 상태 업데이트
  updateTemplateIconActive();
}

// 템플릿 아이콘 활성화 상태 업데이트
function updateTemplateIconActive() {
  const iconButtons = document.querySelectorAll('.template-icon-btn');
  iconButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 현재 선택된 템플릿에 해당하는 버튼 활성화
  if (selectedTemplate) {
    const templateIndex = {
      'video': 0,
      'audio': 1,
      'image': 2,
      'webtemplate': 3,
      'storybook': 4,
      'chatbot': 5,
      'summary': 6,
      'game': 7,
      'engineering': 8,
      'math': 9
    };
    
    const index = templateIndex[selectedTemplate];
    if (index !== undefined && iconButtons[index]) {
      iconButtons[index].classList.add('active');
    }
  }
}

// fadeOut 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('✅ 도구 제작 페이지 준비 완료');

// 대화 상태 관리
let toolConversationState = {
  step: 0,
  templateType: null,
  data: {}
};

// tool.html에서 사용할 sendMessage 함수 (lesson.js의 함수를 오버라이드)
function sendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  // 메시지가 없으면 리턴
  if (!message) {
    return;
  }
  
  // 사용자 메시지 추가
  addUserMessageTool(message);
  
  // 입력 필드 초기화
  input.value = '';
  
  // AI 응답 처리
  handleToolConversation(message);
}

// 사용자 메시지 추가 함수
function addUserMessageTool(message) {
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <img src="https://www.genspark.ai/api/files/s/wfAbSpUF" alt="User">
      </div>
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// AI 응답 처리 함수
function handleToolConversation(message) {
  const lowerMessage = message.toLowerCase();
  
  // 각 템플릿별 시뮬레이션
  if (selectedTemplate === 'video') {
    handleVideoToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'audio') {
    handleAudioToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'image') {
    handleImageToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'webtemplate') {
    handleWebtoonToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'storybook') {
    handleStorybookToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'chatbot') {
    handleChatbotToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'summary') {
    handleSummaryToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'game') {
    handleGameToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'engineering') {
    handleEngineeringToolSimulation(message, lowerMessage);
  } else if (selectedTemplate === 'math') {
    handleMathToolSimulation(message, lowerMessage);
  } else {
    setTimeout(() => {
      addAIMessage('죄송합니다. 현재 이 도구는 시뮬레이션 모드입니다. 실제 기능은 개발 중입니다. 😊');
    }, 1000);
  }
}

// 영상 생성 도구 시뮬레이션
function handleVideoToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    // Step 1: 영상 스타일 선택
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! 피타고라스의 정리를 설명하는 영상을 만들어드리겠습니다. 🎬\n\n어떤 스타일의 영상을 원하시나요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '📊 애니메이션 설명', value: 'animation' },
          { text: '📝 칠판 강의', value: 'lecture' },
          { text: '🎨 인포그래픽', value: 'infographic' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    // Step 2: 영상 생성 시작
    toolConversationState.step = 2;
    toolConversationState.data.style = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 영상 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      // 진행 상황 표시
      setTimeout(() => {
        showVideoGenerationProgress();
      }, 1500);
      
      // 영상 생성 완료
      setTimeout(() => {
        completeVideoGeneration();
      }, 8000);
    }, 1000);
  }
}

// 선택지가 있는 AI 메시지 추가
function addAIMessageWithOptions(options) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const optionsHTML = options.map(opt => 
    `<button class="tool-option-btn" onclick="selectToolOption('${opt.value}', '${opt.text}')">${opt.text}</button>`
  ).join('');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="tool-options">
        ${optionsHTML}
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 선택지 클릭 처리 (전역으로 노출)
window.selectToolOption = function selectToolOption(value, text) {
  // 사용자가 선택한 것처럼 메시지 추가
  addUserMessageTool(text);
  
  // AI 응답 처리
  handleToolConversation(value);
}

// 영상 생성 진행 상황 표시
function showVideoGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">스크립트 생성 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 30%; transition: width 2s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // 진행률 업데이트
  setTimeout(() => {
    updateProgress('🎨 영상 장면 구성 중...', 60);
  }, 2000);
  
  setTimeout(() => {
    updateProgress('🎬 영상 렌더링 중...', 90);
  }, 4000);
}

// 진행률 업데이트
function updateProgress(text, percent) {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) {
    const progressText = progressMessage.querySelector('.progress-text');
    const progressFill = progressMessage.querySelector('.progress-fill');
    
    if (progressText) progressText.textContent = text;
    if (progressFill) progressFill.style.width = percent + '%';
  }
}

// 영상 생성 완료
function completeVideoGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) {
    progressMessage.remove();
  }
  
  addAIMessage('✅ 영상 생성이 완료되었습니다!\n\n피타고라스의 정리를 설명하는 3분 분량의 영상이 준비되었습니다.');
  
  setTimeout(() => {
    displayVideoPreview();
  }, 1000);
  
  // 대화 상태 초기화
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

// 영상 미리보기 표시
function displayVideoPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="video-preview-container">
      <div class="video-info-header">
        <h3 class="video-title">📹 피타고라스의 정리 설명 영상</h3>
        <div class="video-meta">
          <span class="video-duration">⏱️ 3분 00초</span>
          <span class="video-resolution">📐 1920x1080 (Full HD)</span>
        </div>
      </div>
      
      <div class="video-preview-box">
        <div class="video-thumbnail">
          <div class="play-button">▶</div>
          <div class="video-thumbnail-content">
            <div class="theorem-visual">
              <div class="triangle-diagram">
                <svg width="300" height="300" viewBox="0 0 300 300">
                  <!-- 직각삼각형 -->
                  <polygon points="50,250 250,250 50,50" fill="#4A90E2" opacity="0.3" stroke="#4A90E2" stroke-width="3"/>
                  
                  <!-- 정사각형 a² -->
                  <rect x="50" y="10" width="40" height="40" fill="#FF6B6B" opacity="0.7" stroke="#FF6B6B" stroke-width="2"/>
                  <text x="70" y="35" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">a²</text>
                  
                  <!-- 정사각형 b² -->
                  <rect x="250" y="210" width="40" height="40" fill="#51CF66" opacity="0.7" stroke="#51CF66" stroke-width="2"/>
                  <text x="270" y="235" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">b²</text>
                  
                  <!-- 정사각형 c² -->
                  <rect x="120" y="255" width="60" height="60" fill="#A855F7" opacity="0.7" stroke="#A855F7" stroke-width="2"/>
                  <text x="150" y="290" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">c²</text>
                  
                  <!-- 변 레이블 -->
                  <text x="30" y="150" fill="#333" font-size="16" font-weight="bold">a</text>
                  <text x="265" y="150" fill="#333" font-size="16" font-weight="bold">b</text>
                  <text x="150" y="270" fill="#333" font-size="16" font-weight="bold">c</text>
                </svg>
              </div>
              <div class="formula-display">
                <div class="formula">a² + b² = c²</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="video-details">
        <h4>📝 영상 구성</h4>
        <div class="video-scenes">
          <div class="scene-item">
            <span class="scene-time">00:00 - 00:30</span>
            <span class="scene-desc">도입: 피타고라스의 정리 소개</span>
          </div>
          <div class="scene-item">
            <span class="scene-time">00:30 - 01:30</span>
            <span class="scene-desc">개념 설명: 직각삼각형과 변의 관계</span>
          </div>
          <div class="scene-item">
            <span class="scene-time">01:30 - 02:30</span>
            <span class="scene-desc">증명 과정: 정사각형을 이용한 시각적 증명</span>
          </div>
          <div class="scene-item">
            <span class="scene-time">02:30 - 03:00</span>
            <span class="scene-desc">실생활 예시: 건축물에서의 활용</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// 음성 생성 도구 시뮬레이션
// ========================================
function handleAudioToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "이차방정식 해의 공식을 설명하는 음성"을 만들어드리겠습니다. 🎤\n\n이차방정식 ax² + bx + c = 0의 해를 구하는 공식인 x = (-b ± √(b² - 4ac)) / 2a에 대해 쉽고 명확하게 설명하는 내용으로 구성됩니다.\n\n어떤 목소리 톤을 원하시나요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '👨‍🏫 남성 선생님 목소리', value: 'male_teacher' },
          { text: '👩‍🏫 여성 선생님 목소리', value: 'female_teacher' },
          { text: '🎙️ 내레이션 목소리', value: 'narrator' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.voice = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 음성 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showAudioGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeAudioGeneration();
      }, 6000);
    }, 1000);
  }
}

function showAudioGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">텍스트 분석 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 40%; transition: width 1.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('🎤 음성 합성 중...', 80);
  }, 2000);
}

function completeAudioGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 음성 생성이 완료되었습니다!\n\n이차방정식 해의 공식을 설명하는 음성이 준비되었습니다.');
  
  setTimeout(() => {
    displayAudioPreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayAudioPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="audio-preview-container">
      <div class="audio-info-header">
        <h3 class="audio-title">🎤 이차방정식 해의 공식 설명</h3>
        <div class="audio-meta">
          <span class="audio-duration">⏱️ 2분 30초</span>
          <span class="audio-quality">🎵 고음질 (48kHz)</span>
        </div>
      </div>
      
      <div class="audio-player-box">
        <div class="audio-waveform">
          <svg width="100%" height="120" viewBox="0 0 800 120">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:#4A90E2;stop-opacity:0.3" />
              </linearGradient>
            </defs>
            ${generateWaveformBars()}
          </svg>
        </div>
        <div class="audio-controls">
          <button class="play-audio-btn" onclick="alert('음성 재생 기능은 개발 중입니다.')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <div class="audio-timeline">
            <span class="current-time">0:00</span>
            <div class="timeline-bar">
              <div class="timeline-progress" style="width: 0%"></div>
            </div>
            <span class="total-time">2:30</span>
          </div>
        </div>
      </div>
      
      <div class="audio-script">
        <h4>📝 스크립트</h4>
        <div class="script-content">
          <p>이차방정식의 해의 공식에 대해 알아보겠습니다.</p>
          <p>이차방정식 ax² + bx + c = 0에서, x의 값은 다음 공식으로 구할 수 있습니다.</p>
          <p>x = (-b ± √(b² - 4ac)) / 2a</p>
          <p>이 공식을 사용하면 모든 이차방정식의 해를 구할 수 있습니다.</p>
          <p>근호 안의 b² - 4ac를 판별식이라고 하며, 이 값에 따라 근의 개수가 결정됩니다.</p>
        </div>
      </div>
    </div>
  `;
}

function generateWaveformBars() {
  let bars = '';
  for (let i = 0; i < 80; i++) {
    const height = Math.random() * 60 + 20;
    const x = i * 10;
    bars += `<rect x="${x}" y="${60 - height/2}" width="6" height="${height}" fill="url(#waveGradient)" rx="3"/>`;
  }
  return bars;
}

// ========================================
// 이미지 생성 도구 시뮬레이션
// ========================================
function handleImageToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "정규분포 그래프 이미지"를 생성하겠습니다. 🖼️\n\n통계학의 핵심 개념인 정규분포(Normal Distribution)를 시각화한 이미지입니다. 평균(μ)을 중심으로 좌우 대칭인 종 모양의 곡선을 표현하며, 표준편차(σ) 범위와 데이터 분포 비율(68%, 95%, 99.7%)을 명확하게 보여줍니다.\n\n어떤 스타일을 원하시나요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '📊 그래프/차트', value: 'chart' },
          { text: '🎨 일러스트', value: 'illustration' },
          { text: '📐 다이어그램', value: 'diagram' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.style = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 이미지 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showImageGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeImageGeneration();
      }, 5000);
    }, 1000);
  }
}

function showImageGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">이미지 생성 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 50%; transition: width 1.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('🎨 스타일 적용 중...', 90);
  }, 1500);
}

function completeImageGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 이미지 생성이 완료되었습니다!\n\n정규분포 그래프 이미지가 준비되었습니다.');
  
  setTimeout(() => {
    displayImagePreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayImagePreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="image-preview-container">
      <div class="image-info-header">
        <h3 class="image-title">🖼️ 정규분포 그래프</h3>
        <div class="image-meta">
          <span class="image-size">📐 1920 × 1080</span>
          <span class="image-format">🎨 PNG</span>
        </div>
      </div>
      
      <div class="image-display-box">
        <svg width="100%" height="400" viewBox="0 0 800 400" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); border-radius: 12px;">
          <defs>
            <linearGradient id="bellGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:0.9" />
              <stop offset="100%" style="stop-color:#A855F7;stop-opacity:0.9" />
            </linearGradient>
          </defs>
          
          <!-- 좌표축 -->
          <line x1="100" y1="350" x2="700" y2="350" stroke="white" stroke-width="2"/>
          <line x1="400" y1="50" x2="400" y2="350" stroke="white" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
          
          <!-- 정규분포 곡선 -->
          <path d="M 100,350 Q 250,300 300,200 T 400,100 T 500,200 T 600,300 Q 650,325 700,350" 
                fill="url(#bellGradient)" opacity="0.7"/>
          <path d="M 100,350 Q 250,300 300,200 T 400,100 T 500,200 T 600,300 Q 650,325 700,350" 
                fill="none" stroke="white" stroke-width="3"/>
          
          <!-- 레이블 -->
          <text x="400" y="380" text-anchor="middle" fill="white" font-size="18" font-weight="bold">μ (평균)</text>
          <text x="300" y="380" text-anchor="middle" fill="white" font-size="14">-σ</text>
          <text x="500" y="380" text-anchor="middle" fill="white" font-size="14">+σ</text>
          
          <!-- 제목 -->
          <text x="400" y="40" text-anchor="middle" fill="white" font-size="24" font-weight="bold">정규분포 (Normal Distribution)</text>
          
          <!-- 수직선 -->
          <line x1="300" y1="200" x2="300" y2="350" stroke="white" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
          <line x1="500" y1="200" x2="500" y2="350" stroke="white" stroke-width="1" stroke-dasharray="3,3" opacity="0.6"/>
          
          <!-- 68% 표시 -->
          <text x="400" y="260" text-anchor="middle" fill="white" font-size="16" font-weight="bold">68%</text>
        </svg>
      </div>
      
      <div class="image-description">
        <h4>📊 이미지 설명</h4>
        <p>정규분포의 종 모양 곡선을 시각화한 그래프입니다. 평균(μ)을 중심으로 좌우 대칭인 형태를 보이며, 표준편차(σ) 범위 내에 약 68%의 데이터가 분포합니다.</p>
      </div>
    </div>
  `;
}

// ========================================
// 웹툰 제작 도구 시뮬레이션
// ========================================
function handleWebtoonToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "삼각함수 모험기" 웹툰을 만들어드리겠습니다. 🗺️\n\n삼각함수를 어려워하는 학생 주인공이 수학 요정을 만나 삼각함수의 개념을 배우고 이해하는 과정을 담은 학습 웹툰입니다. sin, cos, tan의 의미와 공식을 재미있게 풀어내며, 문제를 해결하고 기뻐하는 주인공의 성장 스토리로 구성됩니다.\n\n몇 컷으로 구성할까요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '4컷 웹툰', value: '4cut' },
          { text: '6컷 웹툰', value: '6cut' },
          { text: '8컷 웹툰', value: '8cut' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.cuts = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 웹툰 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showWebtoonGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeWebtoonGeneration();
      }, 7000);
    }, 1000);
  }
}

function showWebtoonGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">스토리보드 작성 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 30%; transition: width 2s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('🎨 일러스트 생성 중...', 70);
  }, 2500);
}

function completeWebtoonGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 웹툰 생성이 완료되었습니다!\n\n삼각함수를 배우는 학생의 이야기 웹툰이 준비되었습니다.');
  
  setTimeout(() => {
    displayWebtoonPreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayWebtoonPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="webtoon-preview-container">
      <div class="webtoon-info-header">
        <h3 class="webtoon-title">🗺️ 삼각함수 모험기</h3>
        <div class="webtoon-meta">
          <span class="webtoon-author">👤 VI-ZONE 선생님</span>
          <span class="webtoon-date">📅 2026.02.09</span>
        </div>
      </div>
      
      <div class="webtoon-scroll-container">
        <!-- 컷 1: 고민하는 학생 -->
        <div class="webtoon-cut">
          <div class="cut-scene" style="background: linear-gradient(135deg, #FFE5B4 0%, #FFF8DC 100%);">
            <div class="scene-background">
              <div class="classroom-bg">
                <div class="window"></div>
                <div class="blackboard">
                  <span style="color: white; font-size: 14px;">삼각함수</span>
                </div>
              </div>
            </div>
            <div class="scene-content">
              <div class="character student-worried">
                <div class="character-body">
                  <div class="face">😰</div>
                  <div class="body-shape"></div>
                </div>
                <div class="speech-bubble bubble-left">
                  <div class="bubble-text">삼각함수가 뭔지 전혀 모르겠어...</div>
                  <div class="bubble-tail"></div>
                </div>
              </div>
              <div class="math-book">
                <div style="font-size: 12px; color: #666;">📖 수학</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 컷 2: 수학 요정 등장 -->
        <div class="webtoon-cut">
          <div class="cut-scene" style="background: linear-gradient(135deg, #E0F2F7 0%, #B3E5FC 100%);">
            <div class="sparkles">✨✨✨</div>
            <div class="scene-content">
              <div class="character student-surprised" style="left: 20%;">
                <div class="character-body">
                  <div class="face">😲</div>
                  <div class="body-shape"></div>
                </div>
                <div class="thought-bubble">
                  <div class="bubble-text" style="font-size: 12px;">누구지?</div>
                </div>
              </div>
              
              <div class="character fairy-appear" style="right: 20%;">
                <div class="character-body fairy">
                  <div class="wings">🦋</div>
                  <div class="face">🧚‍♀️</div>
                </div>
                <div class="speech-bubble bubble-right" style="background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); color: white;">
                  <div class="bubble-text">안녕! 나는 수학 요정이야! 도와줄게!</div>
                  <div class="bubble-tail" style="border-top-color: #667EEA;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 컷 3: 삼각함수 설명 -->
        <div class="webtoon-cut">
          <div class="cut-scene" style="background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);">
            <div class="scene-content">
              <div class="character fairy-teaching" style="left: 15%;">
                <div class="character-body fairy">
                  <div class="wings">🦋</div>
                  <div class="face">🧚‍♀️</div>
                </div>
              </div>
              
              <div class="explanation-board">
                <div class="board-title">삼각함수란?</div>
                <div class="triangle-diagram">
                  <svg width="180" height="140" viewBox="0 0 180 140">
                    <defs>
                      <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                      </filter>
                    </defs>
                    <!-- 직각삼각형 -->
                    <polygon points="30,120 150,120 30,30" 
                             fill="#FFE082" 
                             stroke="#F57C00" 
                             stroke-width="3"
                             filter="url(#shadow)"/>
                    
                    <!-- 직각 표시 -->
                    <rect x="30" y="105" width="15" height="15" 
                          fill="none" 
                          stroke="#F57C00" 
                          stroke-width="2"/>
                    
                    <!-- 각도 표시 -->
                    <path d="M 150,120 Q 135,115 130,105" 
                          fill="none" 
                          stroke="#E91E63" 
                          stroke-width="2"/>
                    <text x="125" y="115" fill="#E91E63" font-size="14" font-weight="bold">θ</text>
                    
                    <!-- 변 레이블 -->
                    <text x="10" y="75" fill="#333" font-size="13" font-weight="bold">대변</text>
                    <line x1="22" y1="78" x2="28" y2="75" stroke="#333" stroke-width="1.5"/>
                    
                    <text x="80" y="138" fill="#333" font-size="13" font-weight="bold">밑변</text>
                    
                    <text x="100" y="70" fill="#333" font-size="13" font-weight="bold">빗변</text>
                    <line x1="110" y1="73" x2="90" y2="80" stroke="#333" stroke-width="1.5"/>
                  </svg>
                </div>
                <div class="formula-box">
                  <div class="formula-item">sin θ = 대변 / 빗변</div>
                  <div class="formula-item">cos θ = 밑변 / 빗변</div>
                  <div class="formula-item">tan θ = 대변 / 밑변</div>
                </div>
              </div>
              
              <div class="character student-learning" style="right: 15%;">
                <div class="character-body">
                  <div class="face">🤔</div>
                  <div class="body-shape"></div>
                </div>
                <div class="thought-bubble">
                  <div class="bubble-text" style="font-size: 11px;">아하! 비율이구나!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 컷 4: 이해하는 순간 -->
        <div class="webtoon-cut">
          <div class="cut-scene" style="background: linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%);">
            <div class="light-effect">💡</div>
            <div class="scene-content">
              <div class="character student-understanding">
                <div class="character-body">
                  <div class="face" style="font-size: 80px;">😃</div>
                  <div class="body-shape"></div>
                </div>
                <div class="speech-bubble bubble-center" style="background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%);">
                  <div class="bubble-text" style="font-size: 18px; font-weight: bold;">이제 완전히 이해했어!</div>
                  <div class="bubble-tail" style="border-top-color: #FFD54F;"></div>
                </div>
              </div>
              
              <div class="understanding-symbols">
                <span class="symbol">sin ✓</span>
                <span class="symbol">cos ✓</span>
                <span class="symbol">tan ✓</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 컷 5: 문제 풀이 성공 -->
        <div class="webtoon-cut">
          <div class="cut-scene" style="background: linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%);">
            <div class="scene-content">
              <div class="problem-paper">
                <div class="paper-title">문제</div>
                <div class="problem-text">sin 30° = ?</div>
                <div class="answer-text">답: 1/2 ✓</div>
              </div>
              
              <div class="character student-happy">
                <div class="character-body">
                  <div class="face" style="font-size: 70px;">😊</div>
                  <div class="body-shape"></div>
                </div>
                <div class="speech-bubble bubble-left" style="background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%); color: white;">
                  <div class="bubble-text" style="font-weight: bold;">맞았다! 이제 자신있어!</div>
                  <div class="bubble-tail" style="border-top-color: #66BB6A;"></div>
                </div>
              </div>
              
              <div class="character fairy-proud" style="right: 15%;">
                <div class="character-body fairy">
                  <div class="wings">🦋</div>
                  <div class="face">🧚‍♀️</div>
                </div>
                <div class="speech-bubble bubble-right" style="background: linear-gradient(135deg, #AB47BC 0%, #BA68C8 100%); color: white;">
                  <div class="bubble-text">잘했어! 👏</div>
                  <div class="bubble-tail" style="border-top-color: #AB47BC;"></div>
                </div>
              </div>
            </div>
            <div class="celebration">🎉 🎊 ✨</div>
          </div>
        </div>
        
        <!-- 마지막 컷: 감사 인사 -->
        <div class="webtoon-cut">
          <div class="cut-scene" style="background: linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%);">
            <div class="scene-content">
              <div class="character student-grateful" style="left: 30%;">
                <div class="character-body">
                  <div class="face" style="font-size: 70px;">🥰</div>
                  <div class="body-shape"></div>
                </div>
                <div class="speech-bubble bubble-left">
                  <div class="bubble-text" style="font-size: 16px;">수학 요정님, 정말 감사해요! 덕분에 이해했어요!</div>
                  <div class="bubble-tail"></div>
                </div>
              </div>
              
              <div class="character fairy-goodbye" style="right: 30%;">
                <div class="character-body fairy">
                  <div class="wings">🦋</div>
                  <div class="face">🧚‍♀️</div>
                </div>
                <div class="speech-bubble bubble-right" style="background: linear-gradient(135deg, #FF6B9D 0%, #FFC371 100%); color: white;">
                  <div class="bubble-text">언제든지 환영이야! 화이팅! 💪</div>
                  <div class="bubble-tail" style="border-top-color: #FF6B9D;"></div>
                </div>
              </div>
            </div>
            <div class="ending-text">- 끝 -</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// 스토리북 도구 시뮬레이션
// ========================================
function handleStorybookToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "함수 왕국의 비밀" 스토리북을 만들어드리겠습니다. 📚\n\n주인공 민수가 신비로운 함수 왕국에 도착하여 \'입력\'과 \'출력\'이라는 두 친구를 만나는 이야기입니다. 함수의 규칙을 하나씩 배워가며 왕국의 비밀을 풀어나가는 흥미진진한 모험으로, 초등 고학년 학생들이 함수의 개념을 쉽고 재미있게 이해할 수 있도록 구성됩니다.\n\n몇 페이지로 구성할까요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '📖 5페이지', value: '5pages' },
          { text: '📚 10페이지', value: '10pages' },
          { text: '📕 15페이지', value: '15pages' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.pages = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 스토리북 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showStorybookGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeStorybookGeneration();
      }, 7000);
    }, 1000);
  }
}

function showStorybookGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">스토리 구성 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 35%; transition: width 2s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('🎨 일러스트 제작 중...', 75);
  }, 2500);
}

function completeStorybookGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 스토리북 생성이 완료되었습니다!\n\n함수의 개념을 이해하는 모험 이야기가 준비되었습니다.');
  
  setTimeout(() => {
    displayStorybookPreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayStorybookPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  // 스토리북 페이지 데이터
  const storybookPages = [
    {
      number: 1,
      title: '표지',
      background: 'linear-gradient(135deg, #FF6B9D 0%, #FFC371 100%)',
      illustration: `
        <div style="padding: 30px; color: white; text-align: center;">
          <h2 style="font-size: 32px; margin-bottom: 20px;">🏰 함수 왕국의 비밀</h2>
          <div style="font-size: 64px; margin: 30px 0;">📖</div>
          <p style="font-size: 18px;">수학 모험 이야기</p>
        </div>
      `,
      text: '옛날 옛적, 수학 세계에는 신비로운 함수 왕국이 있었습니다...'
    },
    {
      number: 2,
      title: '함수를 만나다',
      background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      illustration: `
        <div style="padding: 30px; color: white; text-align: center;">
          <h2 style="font-size: 28px; margin-bottom: 20px;">🚪 함수 왕국에 도착하다</h2>
          <div style="font-size: 80px; margin: 30px 0;">🏰</div>
          <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px;">
            <div style="font-size: 50px;">🧒</div>
            <div style="font-size: 40px;">✨</div>
          </div>
        </div>
      `,
      text: '주인공 민수는 어느 날 신비로운 문을 발견합니다. 문을 열고 들어가자 눈 앞에 펼쳐진 것은 아름다운 함수 왕국이었습니다. "와! 여기가 함수 왕국이구나!" 민수는 감탄했습니다.'
    },
    {
      number: 3,
      title: '입력과 출력',
      background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      illustration: `
        <div style="padding: 30px; color: white; text-align: center;">
          <h2 style="font-size: 28px; margin-bottom: 20px;">🤝 새로운 친구들</h2>
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin: 30px 0;">
            <div style="text-align: center;">
              <div style="font-size: 60px;">📥</div>
              <div style="font-size: 18px; margin-top: 10px;">입력</div>
            </div>
            <div style="font-size: 40px;">➡️</div>
            <div style="font-size: 60px;">⚙️</div>
            <div style="font-size: 40px;">➡️</div>
            <div style="text-align: center;">
              <div style="font-size: 60px;">📤</div>
              <div style="font-size: 18px; margin-top: 10px;">출력</div>
            </div>
          </div>
        </div>
      `,
      text: '왕국에서 민수는 "입력"과 "출력"이라는 두 친구를 만났습니다. "안녕! 나는 입력이야. 함수에게 값을 전달하는 역할을 해." "나는 출력이야! 함수가 계산한 결과를 보여주지." 두 친구가 민수에게 말했습니다.'
    },
    {
      number: 4,
      title: '함수의 규칙',
      background: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
      illustration: `
        <div style="padding: 30px; color: white; text-align: center;">
          <h2 style="font-size: 28px; margin-bottom: 20px;">📜 마법의 규칙</h2>
          <div style="background: white; color: #333; padding: 20px; border-radius: 16px; margin: 20px auto; max-width: 300px;">
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">f(x) = 2x + 1</div>
            <div style="display: flex; justify-content: space-around; margin-top: 15px;">
              <div>
                <div style="font-size: 16px; color: #666;">입력: 3</div>
                <div style="font-size: 20px; font-weight: bold; color: #F5576C; margin-top: 5px;">출력: 7</div>
              </div>
              <div>
                <div style="font-size: 16px; color: #666;">입력: 5</div>
                <div style="font-size: 20px; font-weight: bold; color: #F5576C; margin-top: 5px;">출력: 11</div>
              </div>
            </div>
          </div>
        </div>
      `,
      text: '"함수는 특별한 규칙을 가지고 있어. 예를 들어 f(x) = 2x + 1이라는 규칙이 있다면, 3을 넣으면 2×3+1=7이 나오고, 5를 넣으면 2×5+1=11이 나오지!" 입력이 설명했습니다. "같은 숫자를 넣으면 항상 같은 결과가 나와. 그게 함수의 규칙이야!" 출력이 덧붙였습니다.'
    },
    {
      number: 5,
      title: '비밀을 풀다',
      background: 'linear-gradient(135deg, #FFD89B 0%, #19547B 100%)',
      illustration: `
        <div style="padding: 30px; color: white; text-align: center;">
          <h2 style="font-size: 28px; margin-bottom: 20px;">🎉 비밀을 발견하다!</h2>
          <div style="font-size: 80px; margin: 20px 0;">🔓</div>
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
            <div style="font-size: 50px;">🧒</div>
            <div style="font-size: 50px;">📥</div>
            <div style="font-size: 50px;">📤</div>
          </div>
          <div style="font-size: 40px; margin-top: 20px;">✨🎊✨</div>
        </div>
      `,
      text: '"이제 알겠어! 함수는 입력과 출력을 규칙으로 연결하는 거구나!" 민수가 외쳤습니다. "맞아! 네가 함수 왕국의 비밀을 풀었어!" 입력과 출력이 기뻐하며 말했습니다. 민수는 함수의 원리를 완전히 이해하게 되었고, 이제 수학이 더 이상 어렵지 않게 느껴졌습니다. - 끝 -'
    }
  ];
  
  previewContent.innerHTML = `
    <div class="storybook-preview-container">
      <div class="storybook-info-header">
        <h3 class="storybook-title">📚 함수 왕국의 비밀</h3>
        <div class="storybook-meta">
          <span class="storybook-pages">📄 5페이지</span>
          <span class="storybook-age">👶 초등 고학년</span>
        </div>
      </div>
      
      <div class="storybook-viewer" id="storybookViewer">
        <!-- 페이지 내용이 여기에 동적으로 표시됩니다 -->
      </div>
      
      <div class="storybook-pages-list" id="storybookPagesList">
        <!-- 페이지 썸네일이 여기에 동적으로 표시됩니다 -->
      </div>
      
      <div class="story-summary">
        <h4>📖 줄거리</h4>
        <p>주인공 민수는 함수 왕국에 도착하여 '입력'과 '출력'이라는 두 친구를 만납니다. 함수의 규칙을 하나씩 배워가며 왕국의 비밀을 풀어나가는 흥미진진한 이야기입니다.</p>
      </div>
    </div>
  `;
  
  // 페이지 데이터를 전역 변수로 저장
  window.storybookPagesData = storybookPages;
  window.currentStorybookPage = 0;
  
  // 초기 페이지 표시
  showStorybookPage(0);
}

// 스토리북 페이지 표시 함수
window.showStorybookPage = function(pageIndex) {
  const viewer = document.getElementById('storybookViewer');
  const pagesList = document.getElementById('storybookPagesList');
  
  if (!viewer || !pagesList || !window.storybookPagesData) return;
  
  const pages = window.storybookPagesData;
  const page = pages[pageIndex];
  
  // 현재 페이지 저장
  window.currentStorybookPage = pageIndex;
  
  // 페이지 내용 표시
  viewer.innerHTML = `
    <div class="storybook-page active">
      <div class="page-illustration" style="background: ${page.background};">
        ${page.illustration}
      </div>
      <div class="page-text">
        <h4>${page.title}</h4>
        <p>${page.text}</p>
      </div>
    </div>
  `;
  
  // 페이지 썸네일 생성
  const thumbnailsHTML = pages.map((p, index) => `
    <div class="page-thumbnail ${index === pageIndex ? 'active' : ''}" onclick="showStorybookPage(${index})">
      <div class="thumb-number">${p.number}</div>
      <div class="thumb-title">${p.title}</div>
    </div>
  `).join('');
  
  pagesList.innerHTML = thumbnailsHTML;
}

// ========================================
// 챗봇 생성 도구 시뮬레이션
// ========================================
function handleChatbotToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "미적분 도우미 챗봇"을 만들어드리겠습니다. 🤖\n\n미적분학의 개념, 공식, 문제 풀이 방법을 학생들에게 쉽고 친절하게 설명해주는 AI 챗봇입니다. 미분의 정의부터 적분의 응용까지, 학생들의 질문에 24시간 실시간으로 답변하며, 단계별 풀이와 실생활 예시를 제공하여 미적분을 더욱 쉽게 이해할 수 있도록 돕습니다.\n\n챗봇의 성격을 선택해주세요.');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '👨‍🏫 친절한 선생님', value: 'teacher' },
          { text: '🤝 친구같은 도우미', value: 'friend' },
          { text: '🎓 전문가', value: 'expert' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.personality = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 챗봇 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showChatbotGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeChatbotGeneration();
      }, 6000);
    }, 1000);
  }
}

function showChatbotGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">지식 베이스 구축 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 40%; transition: width 1.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('🤖 챗봇 학습 중...', 85);
  }, 2000);
}

function completeChatbotGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 챗봇 생성이 완료되었습니다!\n\n미적분 질문에 답하는 수학 챗봇이 준비되었습니다.');
  
  setTimeout(() => {
    displayChatbotPreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayChatbotPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="chatbot-preview-container">
      <div class="chatbot-info-header">
        <h3 class="chatbot-title">🤖 미적분 도우미 챗봇</h3>
        <div class="chatbot-meta">
          <span class="chatbot-status">🟢 활성화됨</span>
          <span class="chatbot-type">🎓 수학 전문</span>
        </div>
      </div>
      
      <div class="chatbot-demo-window">
        <div class="chatbot-demo-header">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-info">
            <div class="chatbot-name">미적분 도우미</div>
            <div class="chatbot-online">● 온라인</div>
          </div>
        </div>
        
        <div class="chatbot-demo-messages" id="chatbotDemoMessages">
          <div class="demo-message bot-message">
            <div class="demo-avatar">🤖</div>
            <div class="demo-bubble">안녕하세요! 미적분 도우미입니다. 무엇을 도와드릴까요?</div>
          </div>
        </div>
        
        <div class="chatbot-demo-input">
          <input type="text" id="chatbotDemoInput" placeholder="메시지를 입력하세요..." onkeypress="handleChatbotDemoKeyPress(event)">
          <button onclick="sendChatbotDemoMessage()">전송</button>
        </div>
      </div>
      
      <div class="chatbot-capabilities">
        <h4>🎯 챗봇 기능</h4>
        <div class="capability-list">
          <div class="capability-item">✅ 미적분 개념 설명</div>
          <div class="capability-item">✅ 문제 풀이 도움</div>
          <div class="capability-item">✅ 예시 제공</div>
          <div class="capability-item">✅ 24시간 질문 응답</div>
        </div>
      </div>
    </div>
  `;
}

// 챗봇 데모 메시지 전송
window.sendChatbotDemoMessage = function() {
  const input = document.getElementById('chatbotDemoInput');
  const messagesContainer = document.getElementById('chatbotDemoMessages');
  
  if (!input || !messagesContainer) return;
  
  const message = input.value.trim();
  if (!message) return;
  
  // 사용자 메시지 추가
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'demo-message user-message';
  userMessageDiv.innerHTML = `
    <div class="demo-bubble">${message}</div>
    <div class="demo-avatar">👤</div>
  `;
  messagesContainer.appendChild(userMessageDiv);
  
  // 입력 초기화
  input.value = '';
  
  // 스크롤 아래로
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // AI 응답 생성
  setTimeout(() => {
    const botResponse = getChatbotResponse(message);
    
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'demo-message bot-message';
    botMessageDiv.innerHTML = `
      <div class="demo-avatar">🤖</div>
      <div class="demo-bubble">${botResponse}</div>
    `;
    messagesContainer.appendChild(botMessageDiv);
    
    // 스크롤 아래로
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 800);
}

// 챗봇 Enter 키 처리
window.handleChatbotDemoKeyPress = function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendChatbotDemoMessage();
  }
}

// 챗봇 응답 생성 함수
function getChatbotResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // 미분 관련 질문
  if (lowerMessage.includes('미분') && !lowerMessage.includes('적분')) {
    if (lowerMessage.includes('뭐') || lowerMessage.includes('무엇') || lowerMessage.includes('정의')) {
      return '미분은 함수의 순간 변화율을 구하는 방법입니다!<br><br>예를 들어, f(x) = x²를 미분하면 f\'(x) = 2x가 됩니다.<br><br>이것은 각 점에서 함수의 기울기를 나타냅니다. 더 자세히 설명해드릴까요?';
    } else if (lowerMessage.includes('예시') || lowerMessage.includes('예제')) {
      return '좋습니다! 미분 예시를 들어볼게요.<br><br>• f(x) = 3x² → f\'(x) = 6x<br>• f(x) = x³ → f\'(x) = 3x²<br>• f(x) = sin(x) → f\'(x) = cos(x)<br><br>더 알고 싶은 것이 있나요? 😊';
    } else {
      return '미분에 대해 질문하셨군요!<br><br>미분의 기본 공식은 다음과 같습니다:<br>• 거듭제곱 미분: d/dx(xⁿ) = nxⁿ⁻¹<br><br>어떤 부분이 궁금하신가요?';
    }
  }
  
  // 적분 관련 질문
  if (lowerMessage.includes('적분')) {
    if (lowerMessage.includes('뭐') || lowerMessage.includes('무엇') || lowerMessage.includes('정의')) {
      return '적분은 미분의 역연산으로, 함수의 넓이나 누적값을 구하는 방법입니다!<br><br>예를 들어, f(x) = 2x를 적분하면 ∫2x dx = x² + C가 됩니다.<br><br>(C는 적분상수입니다)';
    } else if (lowerMessage.includes('예시') || lowerMessage.includes('예제')) {
      return '적분 예시를 보여드릴게요!<br><br>• ∫x² dx = (1/3)x³ + C<br>• ∫3x² dx = x³ + C<br>• ∫cos(x) dx = sin(x) + C<br><br>정적분도 궁금하신가요?';
    } else {
      return '적분에 대해 질문하셨네요!<br><br>적분의 기본 공식:<br>• ∫xⁿ dx = (1/(n+1))xⁿ⁺¹ + C<br><br>더 자세한 설명이 필요하신가요?';
    }
  }
  
  // 도함수 관련
  if (lowerMessage.includes('도함수')) {
    return '도함수는 미분을 통해 얻은 새로운 함수입니다.<br><br>f(x) = x²의 도함수는 f\'(x) = 2x<br><br>도함수는 원래 함수의 각 점에서 접선의 기울기를 나타냅니다!';
  }
  
  // 극값 관련
  if (lowerMessage.includes('극값') || lowerMessage.includes('극대') || lowerMessage.includes('극소')) {
    return '극값은 함수의 최댓값이나 최솟값을 의미합니다.<br><br>극값을 구하는 방법:<br>1. f\'(x) = 0인 점 찾기<br>2. f\'\'(x)로 극대/극소 판별<br><br>구체적인 문제가 있으신가요?';
  }
  
  // 인사
  if (lowerMessage.includes('안녕') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
    return '안녕하세요! 😊<br><br>미적분에 관한 어떤 질문이든 환영합니다!<br>개념, 공식, 문제 풀이 모두 도와드릴 수 있어요.';
  }
  
  // 감사
  if (lowerMessage.includes('감사') || lowerMessage.includes('고마') || lowerMessage.includes('thanks')) {
    return '천만에요! 😊<br><br>더 궁금한 것이 있으면 언제든지 물어보세요!<br>미적분 공부 화이팅입니다! 💪';
  }
  
  // 이해
  if (lowerMessage.includes('이해') || lowerMessage.includes('알겠') || lowerMessage.includes('ok')) {
    return '잘 이해하셨다니 기쁩니다! 🎉<br><br>다른 질문이 있으면 언제든지 말씀해주세요!';
  }
  
  // 기본 응답
  return '흥미로운 질문이네요!<br><br>미적분과 관련된 구체적인 개념이나 문제를 말씀해주시면 더 자세히 설명해드릴 수 있습니다.<br><br>예: "미분이 뭔가요?", "적분 예시를 알려주세요", "극값을 어떻게 구하나요?" 등';
}

// ========================================
// 내용 요약 도구 시뮬레이션
// ========================================
function handleSummaryToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! 내용을 요약해드리겠습니다. 📝\n\n어떤 형식으로 요약할까요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '📋 요약본', value: 'summary' },
          { text: '🎯 핵심 포인트', value: 'keypoints' },
          { text: '🗺️ 마인드맵', value: 'mindmap' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.format = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 요약을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showSummaryGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeSummaryGeneration();
      }, 5000);
    }, 1000);
  }
}

function showSummaryGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">내용 분석 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 50%; transition: width 1.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('📝 요약 생성 중...', 90);
  }, 1500);
}

function completeSummaryGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 요약이 완료되었습니다!\n\n행렬 단원의 핵심 내용 요약이 준비되었습니다.');
  
  setTimeout(() => {
    displaySummaryPreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displaySummaryPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="summary-preview-container">
      <div class="summary-info-header">
        <h3 class="summary-title">📝 행렬 단원 핵심 요약</h3>
        <div class="summary-meta">
          <span class="summary-type">🎯 핵심 포인트</span>
          <span class="summary-length">📄 5개 항목</span>
        </div>
      </div>
      
      <div class="summary-content-box">
        <div class="summary-section">
          <div class="section-number">1</div>
          <div class="section-content">
            <h4>행렬의 정의</h4>
            <p>수나 문자를 직사각형 모양으로 배열한 것을 행렬이라고 합니다. 가로줄을 행(row), 세로줄을 열(column)이라고 합니다.</p>
          </div>
        </div>
        
        <div class="summary-section">
          <div class="section-number">2</div>
          <div class="section-content">
            <h4>행렬의 덧셈과 뺄셈</h4>
            <p>같은 크기의 행렬끼리만 덧셈과 뺄셈이 가능하며, 같은 위치의 성분끼리 계산합니다.</p>
          </div>
        </div>
        
        <div class="summary-section">
          <div class="section-number">3</div>
          <div class="section-content">
            <h4>행렬의 곱셈</h4>
            <p>A가 m×n 행렬이고 B가 n×p 행렬일 때, AB는 m×p 행렬이 됩니다. 앞 행렬의 행과 뒤 행렬의 열을 곱하여 더합니다.</p>
          </div>
        </div>
        
        <div class="summary-section">
          <div class="section-number">4</div>
          <div class="section-content">
            <h4>전치행렬</h4>
            <p>행렬의 행과 열을 바꾼 것을 전치행렬이라 하고, A의 전치행렬을 A^T로 나타냅니다.</p>
          </div>
        </div>
        
        <div class="summary-section">
          <div class="section-number">5</div>
          <div class="section-content">
            <h4>단위행렬과 역행렬</h4>
            <p>대각선 성분이 모두 1이고 나머지가 0인 정사각행렬을 단위행렬이라 하며, AA⁻¹ = A⁻¹A = I를 만족하는 A⁻¹을 역행렬이라 합니다.</p>
          </div>
        </div>
      </div>
      
      <div class="summary-tags">
        <h4>🏷️ 주요 키워드</h4>
        <div class="tag-list">
          <span class="tag">행렬</span>
          <span class="tag">행과 열</span>
          <span class="tag">행렬의 연산</span>
          <span class="tag">전치행렬</span>
          <span class="tag">역행렬</span>
          <span class="tag">단위행렬</span>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// 학습 게임 도구 시뮬레이션
// ========================================
function handleGameToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "인수분해 마스터" 학습 게임을 만들어드리겠습니다. 🎮\n\n인수분해 문제를 풀면서 재미있게 연습할 수 있는 게임입니다. 총 10개의 문제가 제공되며, 각 문제마다 30초의 제한시간이 주어집니다. 4개의 선택지 중 정답을 골라 점수를 획득하고, 힌트 시스템을 활용하여 어려운 문제도 해결할 수 있습니다. 랭킹 시스템을 통해 자신의 실력을 확인하고 친구들과 경쟁해보세요!\n\n어떤 게임 형식을 원하시나요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '❓ 퀴즈 게임', value: 'quiz' },
          { text: '🎯 타겟 맞추기', value: 'target' },
          { text: '🧩 퍼즐 게임', value: 'puzzle' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.gameType = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 게임 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showGameGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeGameGeneration();
      }, 6000);
    }, 1000);
  }
}

function showGameGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">문제 생성 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 40%; transition: width 1.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('🎮 게임 시스템 구축 중...', 85);
  }, 2000);
}

function completeGameGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 게임 생성이 완료되었습니다!\n\n인수분해 연습 퀴즈 게임이 준비되었습니다.');
  
  setTimeout(() => {
    displayGamePreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayGamePreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="game-preview-container">
      <div class="game-info-header">
        <h3 class="game-title">🎮 인수분해 마스터</h3>
        <div class="game-meta">
          <span class="game-type">❓ 퀴즈 게임</span>
          <span class="game-questions">📝 10문제</span>
        </div>
      </div>
      
      <div class="game-demo-window">
        <div class="game-header">
          <div class="game-score">
            <span class="score-label">점수</span>
            <span class="score-value">0</span>
          </div>
          <div class="game-progress">
            <span class="progress-label">문제</span>
            <span class="progress-value">1 / 10</span>
          </div>
          <div class="game-timer">
            <span class="timer-icon">⏱️</span>
            <span class="timer-value">30</span>
          </div>
        </div>
        
        <div class="game-question-area">
          <div class="question-number">문제 1</div>
          <div class="question-text">다음 식을 인수분해 하시오.</div>
          <div class="question-formula">x² + 5x + 6</div>
        </div>
        
        <div class="game-answers">
          <button class="answer-btn" onclick="alert('게임 플레이 기능은 개발 중입니다.')">
            <span class="answer-label">A</span>
            <span class="answer-text">(x + 2)(x + 3)</span>
          </button>
          <button class="answer-btn" onclick="alert('게임 플레이 기능은 개발 중입니다.')">
            <span class="answer-label">B</span>
            <span class="answer-text">(x + 1)(x + 6)</span>
          </button>
          <button class="answer-btn" onclick="alert('게임 플레이 기능은 개발 중입니다.')">
            <span class="answer-label">C</span>
            <span class="answer-text">(x - 2)(x - 3)</span>
          </button>
          <button class="answer-btn" onclick="alert('게임 플레이 기능은 개발 중입니다.')">
            <span class="answer-label">D</span>
            <span class="answer-text">(x + 4)(x + 2)</span>
          </button>
        </div>
        
        <div class="game-hint">
          <button class="hint-btn" onclick="alert('힌트: 두 수의 곱이 6이고 합이 5인 수를 찾아보세요!')">
            💡 힌트 보기
          </button>
        </div>
      </div>
      
      <div class="game-features">
        <h4>✨ 게임 특징</h4>
        <div class="feature-list">
          <div class="feature-item">🎯 10개의 인수분해 문제</div>
          <div class="feature-item">⏱️ 문제당 30초 제한시간</div>
          <div class="feature-item">💡 힌트 시스템</div>
          <div class="feature-item">🏆 점수 및 랭킹 시스템</div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// 공학도구 시뮬레이션
// ========================================
function handleEngineeringToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "이차함수 그래프 계산기" 공학도구를 만들어드리겠습니다. ⚙️\n\n이차함수 y = ax² + bx + c의 그래프를 실시간으로 그려주는 인터랙티브 계산기입니다. 계수 a, b, c 값을 입력하면 자동으로 포물선이 그려지며, 꼭짓점, 축의 방정식, 개형 정보를 함께 제공합니다. 샘플 함수 버튼으로 다양한 이차함수 예시를 빠르게 확인할 수 있어 학습과 탐구에 최적화되어 있습니다.\n\n어떤 기능이 필요하신가요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '📊 데이터 시각화', value: 'visualization' },
          { text: '🧮 계산 도구', value: 'calculator' },
          { text: '📈 시뮬레이션', value: 'simulation' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.feature = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 도구 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showEngineeringGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeEngineeringGeneration();
      }, 6000);
    }, 1000);
  }
}

function showEngineeringGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">인터페이스 설계 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 45%; transition: width 1.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('⚙️ 계산 엔진 구축 중...', 85);
  }, 2000);
}

function completeEngineeringGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 공학도구 생성이 완료되었습니다!\n\n이차함수 그래프 계산기가 준비되었습니다.');
  
  setTimeout(() => {
    displayEngineeringPreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayEngineeringPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="engineering-preview-container">
      <div class="engineering-info-header">
        <h3 class="engineering-title">⚙️ 이차함수 그래프 계산기</h3>
        <div class="engineering-meta">
          <span class="engineering-type">📈 시각화 도구</span>
        </div>
      </div>
      
      <div class="engineering-tool-window">
        <div class="tool-input-panel">
          <h4>📝 함수 입력</h4>
          <div class="input-group">
            <label>y = </label>
            <input type="number" placeholder="a" value="1" style="width: 60px;"> x² + 
            <input type="number" placeholder="b" value="0" style="width: 60px;"> x + 
            <input type="number" placeholder="c" value="0" style="width: 60px;">
          </div>
          <button class="calculate-btn" onclick="alert('계산 기능은 개발 중입니다.')">
            📊 그래프 그리기
          </button>
          
          <div class="preset-functions">
            <h5>🎯 샘플 함수</h5>
            <button class="preset-btn" onclick="alert('함수 적용 기능은 개발 중입니다.')">y = x²</button>
            <button class="preset-btn" onclick="alert('함수 적용 기능은 개발 중입니다.')">y = x² - 4</button>
            <button class="preset-btn" onclick="alert('함수 적용 기능은 개발 중입니다.')">y = -x² + 2x + 3</button>
          </div>
        </div>
        
        <div class="tool-graph-panel">
          <h4>📈 그래프</h4>
          <svg width="100%" height="350" viewBox="0 0 400 350" style="background: #f8f9fa; border-radius: 8px;">
            <!-- 좌표축 -->
            <line x1="200" y1="0" x2="200" y2="350" stroke="#dee2e6" stroke-width="2"/>
            <line x1="0" y1="175" x2="400" y2="175" stroke="#dee2e6" stroke-width="2"/>
            
            <!-- 격자 -->
            <g stroke="#e9ecef" stroke-width="1">
              <line x1="100" y1="0" x2="100" y2="350"/>
              <line x1="300" y1="0" x2="300" y2="350"/>
              <line x1="0" y1="87.5" x2="400" y2="87.5"/>
              <line x1="0" y1="262.5" x2="400" y2="262.5"/>
            </g>
            
            <!-- 이차함수 그래프 (y = x²) -->
            <path d="M 50,315 Q 125,225 200,175 T 350,315" 
                  fill="none" 
                  stroke="#4A90E2" 
                  stroke-width="3"/>
            
            <!-- 포물선 강조 -->
            <circle cx="200" cy="175" r="5" fill="#4A90E2"/>
            
            <!-- 축 레이블 -->
            <text x="390" y="170" fill="#495057" font-size="14">x</text>
            <text x="205" y="15" fill="#495057" font-size="14">y</text>
            
            <!-- 원점 -->
            <text x="205" y="190" fill="#495057" font-size="12">O</text>
            
            <!-- 함수식 표시 -->
            <text x="20" y="30" fill="#4A90E2" font-size="16" font-weight="bold">y = x²</text>
          </svg>
          
          <div class="graph-info">
            <div class="info-item">
              <span class="info-label">꼭짓점:</span>
              <span class="info-value">(0, 0)</span>
            </div>
            <div class="info-item">
              <span class="info-label">축의 방정식:</span>
              <span class="info-value">x = 0</span>
            </div>
            <div class="info-item">
              <span class="info-label">개형:</span>
              <span class="info-value">위로 볼록 (a > 0)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// 수학도구 시뮬레이션
// ========================================
function handleMathToolSimulation(message, lowerMessage) {
  if (toolConversationState.step === 0) {
    toolConversationState.step = 1;
    toolConversationState.data.topic = message;
    
    setTimeout(() => {
      addAIMessage('좋습니다! "삼각비 계산기" 수학도구를 만들어드리겠습니다. 📐\n\n직각삼각형의 각도와 한 변의 길이를 입력하면 sin, cos, tan 값과 나머지 변의 길이를 자동으로 계산해주는 도구입니다. 시각적인 삼각형 다이어그램으로 각 변과 각도의 관계를 명확하게 보여주며, 삼각비 공식(sin = 대변/빗변, cos = 밑변/빗변, tan = 대변/밑변)을 함께 제공하여 개념 이해와 문제 풀이에 도움을 줍니다.\n\n어떤 종류의 도구를 원하시나요?');
      
      setTimeout(() => {
        addAIMessageWithOptions([
          { text: '🧮 계산기', value: 'calculator' },
          { text: '📊 그래프 도구', value: 'graph' },
          { text: '📏 측정 도구', value: 'measurement' }
        ]);
      }, 500);
    }, 1000);
    
  } else if (toolConversationState.step === 1) {
    toolConversationState.step = 2;
    toolConversationState.data.toolType = message;
    
    setTimeout(() => {
      addAIMessage('완벽합니다! 도구 생성을 시작하겠습니다. ✨\n\n잠시만 기다려주세요...');
      
      setTimeout(() => {
        showMathGenerationProgress();
      }, 1500);
      
      setTimeout(() => {
        completeMathGeneration();
      }, 6000);
    }, 1000);
  }
}

function showMathGenerationProgress() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message';
  messageDiv.id = 'progressMessage';
  messageDiv.innerHTML = `
    <div class="message-avatar">
      <img src="https://www.genspark.ai/api/files/s/YgU0f6Ii" alt="AI">
    </div>
    <div class="message-content">
      <div class="generation-progress">
        <div class="progress-item">
          <span class="progress-icon">⏳</span>
          <span class="progress-text">수학 엔진 구축 중...</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 45%; transition: width 1.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  setTimeout(() => {
    updateProgress('📐 인터페이스 생성 중...', 85);
  }, 2000);
}

function completeMathGeneration() {
  const progressMessage = document.getElementById('progressMessage');
  if (progressMessage) progressMessage.remove();
  
  addAIMessage('✅ 수학도구 생성이 완료되었습니다!\n\n삼각비 계산기가 준비되었습니다.');
  
  setTimeout(() => {
    displayMathPreview();
  }, 1000);
  
  toolConversationState.step = 0;
  toolConversationState.data = {};
}

function displayMathPreview() {
  const previewContent = document.getElementById('previewContent');
  if (!previewContent) return;
  
  previewContent.innerHTML = `
    <div class="math-preview-container">
      <div class="math-info-header">
        <h3 class="math-title">📐 삼각비 계산기</h3>
        <div class="math-meta">
          <span class="math-type">🧮 계산 도구</span>
        </div>
      </div>
      
      <div class="math-tool-window">
        <div class="triangle-display">
          <svg width="100%" height="300" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#A855F7;stop-opacity:0.3" />
              </linearGradient>
            </defs>
            
            <!-- 직각삼각형 -->
            <polygon points="80,230 320,230 80,80" 
                     fill="url(#triangleGradient)" 
                     stroke="#4A90E2" 
                     stroke-width="3"/>
            
            <!-- 직각 표시 -->
            <rect x="80" y="210" width="20" height="20" fill="none" stroke="#4A90E2" stroke-width="2"/>
            
            <!-- 각도 표시 -->
            <path d="M 320,230 Q 300,220 290,205" fill="none" stroke="#FF6B6B" stroke-width="2"/>
            <text x="280" y="220" fill="#FF6B6B" font-size="16" font-weight="bold">θ</text>
            
            <!-- 변 레이블 -->
            <text x="40" y="160" fill="#333" font-size="18" font-weight="bold">대변 (a)</text>
            <line x1="60" y1="165" x2="75" y2="155" stroke="#333" stroke-width="1.5"/>
            
            <text x="180" y="255" fill="#333" font-size="18" font-weight="bold">밑변 (b)</text>
            
            <text x="220" y="150" fill="#333" font-size="18" font-weight="bold">빗변 (c)</text>
            <line x1="240" y1="145" x2="200" y2="155" stroke="#333" stroke-width="1.5"/>
          </svg>
        </div>
        
        <div class="calculator-panel">
          <div class="input-section">
            <h4>🎯 값 입력</h4>
            <div class="calc-input-group">
              <label>각도 (θ):</label>
              <input type="number" placeholder="30" value="30"> °
            </div>
            <div class="calc-input-group">
              <label>빗변 (c):</label>
              <input type="number" placeholder="10" value="10">
            </div>
            <button class="calc-btn" onclick="alert('계산 기능은 개발 중입니다.')">
              🧮 계산하기
            </button>
          </div>
          
          <div class="result-section">
            <h4>📊 계산 결과</h4>
            <div class="result-item">
              <span class="result-label">sin(θ) =</span>
              <span class="result-value">0.5000</span>
            </div>
            <div class="result-item">
              <span class="result-label">cos(θ) =</span>
              <span class="result-value">0.8660</span>
            </div>
            <div class="result-item">
              <span class="result-label">tan(θ) =</span>
              <span class="result-value">0.5774</span>
            </div>
            <div class="result-divider"></div>
            <div class="result-item">
              <span class="result-label">대변 (a) =</span>
              <span class="result-value">5.00</span>
            </div>
            <div class="result-item">
              <span class="result-label">밑변 (b) =</span>
              <span class="result-value">8.66</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="formula-reference">
        <h4>📖 공식 참고</h4>
        <div class="formula-box">
          <div class="formula-item">sin(θ) = 대변 / 빗변</div>
          <div class="formula-item">cos(θ) = 밑변 / 빗변</div>
          <div class="formula-item">tan(θ) = 대변 / 밑변</div>
        </div>
      </div>
    </div>
  `;
}

// Enter 키 처리
function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
