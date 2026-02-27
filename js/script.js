// VI-ZONE 수학 교사 플랫폼 JavaScript

// 사이드바 토글 기능
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('collapsed');
  
  // localStorage에 상태 저장
  const isCollapsed = sidebar.classList.contains('collapsed');
  localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// 페이지 로드 시 사이드바 상태 복원
document.addEventListener('DOMContentLoaded', function() {
  const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (sidebarCollapsed) {
    document.querySelector('.sidebar')?.classList.add('collapsed');
  }
  
  // 현재 페이지에 맞는 메뉴 활성화
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });
});

// 정렬 드롭다운 토글
function toggleSortDropdown() {
  const dropdown = document.querySelector('.dropdown-menu');
  dropdown.classList.toggle('active');
}

// 드롭다운 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.dropdown-menu');
  const sortButton = document.querySelector('.sort-button');
  
  if (dropdown && sortButton) {
    if (!dropdown.contains(event.target) && !sortButton.contains(event.target)) {
      dropdown.classList.remove('active');
    }
  }
});

// 정렬 기능
let currentSort = 'latest'; // 기본값: 최신순

function sortResources(sortType) {
  currentSort = sortType;
  const sortButton = document.querySelector('.sort-button');
  const dropdown = document.querySelector('.dropdown-menu');
  
  // 버튼 텍스트 업데이트
  let sortText = '정렬순';
  switch(sortType) {
    case 'name':
      sortText = '이름순';
      break;
    case 'latest':
      sortText = '최신순';
      break;
    case 'type':
      sortText = '유형별';
      break;
  }
  
  sortButton.innerHTML = `${sortText} <span style="font-size: 12px;">▼</span>`;
  dropdown.classList.remove('active');
  
  // 실제 정렬 로직
  const resourcesGrid = document.querySelector('.resources-grid');
  if (!resourcesGrid) return;
  
  const items = Array.from(resourcesGrid.children);
  
  items.sort((a, b) => {
    const isAFolder = a.querySelector('.folder-icon');
    const isBFolder = b.querySelector('.folder-icon');
    
    // 폴더는 항상 위에
    if (isAFolder && !isBFolder) return -1;
    if (!isAFolder && isBFolder) return 1;
    
    const nameA = a.querySelector('.resource-name').textContent;
    const nameB = b.querySelector('.resource-name').textContent;
    
    switch(sortType) {
      case 'name':
        return nameA.localeCompare(nameB, 'ko');
      case 'latest':
        // 최신순 (역순)
        return nameB.localeCompare(nameA, 'ko');
      case 'type':
        // 유형별 정렬
        const getType = (item) => {
          if (item.querySelector('.folder-icon')) return 'folder';
          if (item.querySelector('.ppt-icon')) return 'ppt';
          if (item.querySelector('.excel-icon')) return 'excel';
          if (item.querySelector('.hwp-icon')) return 'hwp';
          if (item.querySelector('.pdf-icon')) return 'pdf';
          if (item.querySelector('.image-icon')) return 'image';
          if (item.querySelector('.video-icon')) return 'video';
          return 'other';
        };
        const typeA = getType(a);
        const typeB = getType(b);
        if (typeA !== typeB) return typeA.localeCompare(typeB);
        return nameA.localeCompare(nameB, 'ko');
      default:
        return 0;
    }
  });
  
  // 재정렬
  items.forEach(item => resourcesGrid.appendChild(item));
}

// 폴더 추가 기능
let folderCount = 0;

function addNewFolder() {
  folderCount++;
  const defaultName = `새 폴더 ${folderCount}`;
  
  // 커스텀 입력 모달 사용
  openInputModal(defaultName, function(folderName) {
    if (!folderName) return;
    
    const resourcesGrid = document.querySelector('.resources-grid');
    if (!resourcesGrid) return;
    
    // 새 폴더 요소 생성
    const folderItem = document.createElement('div');
    folderItem.className = 'resource-item fade-in folder-item';
    folderItem.setAttribute('data-folder', folderName);
    folderItem.setAttribute('onclick', `openFolderModal('${folderName}')`);
    folderItem.innerHTML = `
      <div class="resource-icon folder-icon">📁</div>
      <div class="resource-name">${folderName}</div>
    `;
    
    // 폴더 데이터 초기화
    folderData[folderName] = {
      subfolders: []
    };
    
    // 첫 번째 위치에 추가 (폴더는 항상 위에)
    if (resourcesGrid.firstChild) {
      resourcesGrid.insertBefore(folderItem, resourcesGrid.firstChild);
    } else {
      resourcesGrid.appendChild(folderItem);
    }
    
    // 현재 정렬 방식으로 재정렬
    sortResources(currentSort);
  });
}

// 메뉴 아이템 클릭 효과
document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (!item.getAttribute('href')) {
        e.preventDefault();
      }
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');
    });
  });
});

// 폴더 구조 데이터
const folderData = {
  '2단원_수업자료': {
    subfolders: [
      {
        name: '2-1_정수와 유리수_개념',
        files: [
          { name: '정수와유리수_개념설명.ppt', type: 'ppt' },
          { name: '정수와유리수_학습지.hwp', type: 'hwp' },
          { name: '정수와유리수_정리자료.pdf', type: 'pdf' }
        ]
      },
      {
        name: '2-1_소인수분해_활동',
        files: [
          { name: '소인수분해_활동자료.ppt', type: 'ppt' },
          { name: '소인수분해_워크시트.hwp', type: 'hwp' },
          { name: '소인수분해_문제지.pdf', type: 'pdf' }
        ]
      }
    ]
  },
  '3단원_수업자료': {
    subfolders: [
      {
        name: '3-1_함수의 기초',
        files: [
          { name: '함수의기초_개념.ppt', type: 'ppt' },
          { name: '함수의기초_학습지.hwp', type: 'hwp' },
          { name: '함수의기초_정리.pdf', type: 'pdf' }
        ]
      },
      {
        name: '3-2_일차함수',
        files: [
          { name: '일차함수_설명자료.ppt', type: 'ppt' },
          { name: '일차함수_연습문제.hwp', type: 'hwp' },
          { name: '일차함수_해설.pdf', type: 'pdf' }
        ]
      }
    ]
  },
  '4단원_수업자료': {
    subfolders: [
      {
        name: '4-1_도형의성질',
        files: [
          { name: '도형의성질_강의자료.ppt', type: 'ppt' },
          { name: '도형의성질_워크북.hwp', type: 'hwp' },
          { name: '도형의성질_요약.pdf', type: 'pdf' }
        ]
      },
      {
        name: '4-2_삼각형의성질',
        files: [
          { name: '삼각형_개념정리.ppt', type: 'ppt' },
          { name: '삼각형_활동지.hwp', type: 'hwp' },
          { name: '삼각형_문제풀이.pdf', type: 'pdf' }
        ]
      }
    ]
  },
  '6단원_문항': {
    subfolders: [
      {
        name: '6-1_확률과통계_기본',
        files: [
          { name: '확률기초_문항.ppt', type: 'ppt' },
          { name: '확률기초_평가지.hwp', type: 'hwp' },
          { name: '확률기초_해답.pdf', type: 'pdf' }
        ]
      },
      {
        name: '6-2_확률과통계_심화',
        files: [
          { name: '확률심화_문제.ppt', type: 'ppt' },
          { name: '확률심화_시험지.hwp', type: 'hwp' },
          { name: '확률심화_정답.pdf', type: 'pdf' }
        ]
      }
    ]
  }
};

// 파일 아이콘 매핑
const fileIcons = {
  ppt: 'https://www.genspark.ai/api/files/s/50jcx26m',
  hwp: 'https://www.genspark.ai/api/files/s/674ELGGT', // 한글 이미지
  pdf: 'https://www.genspark.ai/api/files/s/MMaHyqVI'  // PDF 이미지
};

// 현재 열린 폴더 이름 저장
let currentOpenFolder = '';

// 폴더 모달 열기
function openFolderModal(folderName) {
  currentOpenFolder = folderName;
  const modal = document.getElementById('folderModal');
  const modalTitle = document.getElementById('modalTitle');
  const folderContent = document.getElementById('folderContent');
  
  // 모달 제목 설정
  modalTitle.textContent = folderName;
  
  // 폴더 내용 생성
  const data = folderData[folderName];
  if (!data) {
    folderContent.innerHTML = '<p>폴더 내용이 없습니다.</p>';
    modal.classList.add('active');
    return;
  }
  
  let contentHTML = '';
  data.subfolders.forEach((subfolder, subIndex) => {
    contentHTML += `
      <div class="subfolder-section" style="position: relative;">
        <span class="favorite-star" onclick="toggleFavorite(this)" data-favorite="false" style="position: absolute; top: 15px; right: 15px; z-index: 10;">
          ☆
          <span class="tooltip">즐겨찾기에 추가</span>
        </span>
        <div class="subfolder-header">
          <span class="subfolder-icon">📂</span>
          <span class="subfolder-name">${subfolder.name}</span>
        </div>
        <div class="file-list">
    `;
    
    subfolder.files.forEach((file, fileIndex) => {
      const iconSrc = fileIcons[file.type];
      const iconHTML = (file.type === 'ppt' || file.type === 'hwp' || file.type === 'pdf') 
        ? `<img src="${iconSrc}" alt="${file.type}">` 
        : iconSrc;
      
      contentHTML += `
        <div class="file-item" style="position: relative;">
          <span class="favorite-star" onclick="toggleFavorite(this)" data-favorite="false" style="position: absolute; top: 5px; right: 5px; z-index: 10;">
            ☆
            <span class="tooltip">즐겨찾기에 추가</span>
          </span>
          <div class="file-icon">${iconHTML}</div>
          <div class="file-name">${file.name}</div>
        </div>
      `;
    });
    
    contentHTML += `
        </div>
      </div>
    `;
  });
  
  folderContent.innerHTML = contentHTML;
  modal.classList.add('active');
  
  // body 스크롤 막기
  document.body.style.overflow = 'hidden';
}

// 폴더 모달 닫기
function closeFolderModal() {
  const modal = document.getElementById('folderModal');
  modal.classList.remove('active');
  
  // body 스크롤 복원
  document.body.style.overflow = '';
}

// 하위 폴더 추가 기능
function addSubfolder() {
  if (!currentOpenFolder) {
    alert('폴더가 열려있지 않습니다.');
    return;
  }
  
  // 커스텀 입력 모달 사용
  openInputModal('', function(subfolderName) {
    if (!subfolderName) return;
    
    // 폴더 데이터에 추가
    if (!folderData[currentOpenFolder]) {
      folderData[currentOpenFolder] = { subfolders: [] };
    }
    
    const newSubfolder = {
      name: subfolderName,
      files: []
    };
    
    folderData[currentOpenFolder].subfolders.push(newSubfolder);
    
    // 모달 내용 갱신
    openFolderModal(currentOpenFolder);
  });
}

// 모달 배경 클릭 시 닫기
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('folderModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeFolderModal();
      }
    });
  }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeFolderModal();
    closeAIOrganizeModal();
  }
});

// 관리 모드 상태
let isManageMode = false;
let isModalManageMode = false;

// 메인 화면 관리 모드 토글
function toggleManageMode() {
  isManageMode = !isManageMode;
  const grid = document.getElementById('resourcesGrid');
  const bulkActions = document.getElementById('bulkActions');
  
  if (isManageMode) {
    grid.classList.add('manage-mode');
    bulkActions.style.display = 'flex';
    renderResourcesWithManageButtons();
  } else {
    grid.classList.remove('manage-mode');
    bulkActions.style.display = 'none';
    renderResources();
  }
}

// 자료 렌더링 (관리 버튼 포함)
function renderResourcesWithManageButtons() {
  const grid = document.getElementById('resourcesGrid');
  const items = grid.querySelectorAll('.resource-item');
  
  items.forEach((item, index) => {
    if (!item.querySelector('.manage-actions')) {
      // 체크박스 (좌측 상단)
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'item-checkbox';
      checkbox.style.cssText = 'width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary-color); position: absolute; top: 8px; left: 8px; z-index: 10;';
      
      // 관리 버튼들 (우측 상단)
      const manageActions = document.createElement('div');
      manageActions.className = 'manage-actions';
      manageActions.innerHTML = `
        <button class="manage-icon-btn edit-btn" onclick="editResourceName(event, ${index})" title="이름 수정">✏️</button>
        <button class="manage-icon-btn delete-btn" onclick="deleteResource(event, ${index})" title="삭제">🗑️</button>
      `;
      
      item.insertBefore(checkbox, item.firstChild);
      item.insertBefore(manageActions, item.firstChild);
      item.dataset.index = index;
    }
  });
}

// 일반 자료 렌더링
function renderResources() {
  const grid = document.getElementById('resourcesGrid');
  const items = grid.querySelectorAll('.resource-item');
  
  items.forEach(item => {
    const manageActions = item.querySelector('.manage-actions');
    const checkbox = item.querySelector('.item-checkbox');
    if (manageActions) {
      manageActions.remove();
    }
    if (checkbox) {
      checkbox.remove();
    }
  });
}

// 자료 이름 수정
function editResourceName(event, index) {
  // 이벤트 전파 막기 (폴더 팝업이 열리지 않도록)
  event.stopPropagation();
  
  const grid = document.getElementById('resourcesGrid');
  const items = grid.querySelectorAll('.resource-item');
  const item = items[index];
  const nameElement = item.querySelector('.resource-name');
  
  const currentName = nameElement.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'resource-name-editable';
  
  nameElement.replaceWith(input);
  input.focus();
  input.select();
  
  function saveName() {
    const newName = input.value.trim();
    if (newName && newName !== currentName) {
      const newNameElement = document.createElement('div');
      newNameElement.className = 'resource-name';
      newNameElement.textContent = newName;
      input.replaceWith(newNameElement);
      
      // 폴더 데이터 업데이트
      const folderName = item.dataset.folder;
      if (folderName && folderData[folderName]) {
        const oldKey = folderName;
        const newKey = newName;
        folderData[newKey] = folderData[oldKey];
        delete folderData[oldKey];
        item.dataset.folder = newName;
        item.setAttribute('onclick', `openFolderModal('${newName}')`);
      }
    } else {
      const newNameElement = document.createElement('div');
      newNameElement.className = 'resource-name';
      newNameElement.textContent = currentName;
      input.replaceWith(newNameElement);
    }
  }
  
  input.addEventListener('blur', saveName);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      const newNameElement = document.createElement('div');
      newNameElement.className = 'resource-name';
      newNameElement.textContent = currentName;
      input.replaceWith(newNameElement);
    }
  });
}

// 자료 삭제
function deleteResource(event, index) {
  // 이벤트 전파 막기 (폴더 팝업이 열리지 않도록)
  event.stopPropagation();
  
  const grid = document.getElementById('resourcesGrid');
  const items = grid.querySelectorAll('.resource-item');
  const item = items[index];
  const isFolder = item.classList.contains('folder-item');
  const name = item.querySelector('.resource-name').textContent;
  
  let message = isFolder 
    ? `'${name}' 폴더 안의 모든 자료가 삭제됩니다. 삭제하시겠습니까?`
    : `'${name}' 파일을 삭제하시겠습니까?`;
  
  // 커스텀 확인 모달 사용
  openConfirmModal(message, function() {
    // 폴더 데이터에서 제거
    if (isFolder) {
      const folderName = item.dataset.folder;
      if (folderData[folderName]) {
        delete folderData[folderName];
      }
    }
    
    // DOM에서 제거
    item.remove();
  });
}

// 모달 관리 모드 토글
function toggleModalManageMode() {
  isModalManageMode = !isModalManageMode;
  const folderContent = document.getElementById('folderContent');
  
  if (isModalManageMode) {
    folderContent.classList.add('manage-mode');
    addModalManageButtons();
  } else {
    folderContent.classList.remove('manage-mode');
    removeModalManageButtons();
  }
}

// 모달 관리 버튼 추가
function addModalManageButtons() {
  const subfolders = document.querySelectorAll('.subfolder-section');
  subfolders.forEach((section, index) => {
    if (!section.querySelector('.manage-actions')) {
      const header = section.querySelector('.subfolder-header');
      const manageActions = document.createElement('div');
      manageActions.className = 'manage-actions';
      manageActions.style.position = 'relative';
      manageActions.innerHTML = `
        <button class="manage-icon-btn edit-btn" onclick="editSubfolderName(event, ${index})" title="이름 수정">✏️</button>
        <button class="manage-icon-btn delete-btn" onclick="deleteSubfolder(event, ${index})" title="삭제">🗑️</button>
      `;
      header.appendChild(manageActions);
    }
  });
  
  const files = document.querySelectorAll('.file-item');
  files.forEach((file, index) => {
    if (!file.querySelector('.manage-actions')) {
      const manageActions = document.createElement('div');
      manageActions.className = 'manage-actions';
      manageActions.style.position = 'absolute';
      manageActions.style.top = '4px';
      manageActions.style.right = '4px';
      manageActions.innerHTML = `
        <button class="manage-icon-btn delete-btn" onclick="deleteFile(event, ${index})" title="삭제">🗑️</button>
      `;
      file.style.position = 'relative';
      file.appendChild(manageActions);
    }
  });
}

// 모달 관리 버튼 제거
function removeModalManageButtons() {
  const manageActions = document.querySelectorAll('#folderContent .manage-actions');
  manageActions.forEach(action => action.remove());
}

// 하위 폴더 이름 수정
function editSubfolderName(event, index) {
  // 이벤트 전파 막기
  if (event) {
    event.stopPropagation();
  }
  
  const subfolders = document.querySelectorAll('.subfolder-section');
  const section = subfolders[index];
  const nameElement = section.querySelector('.subfolder-name');
  
  const currentName = nameElement.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'resource-name-editable';
  
  nameElement.replaceWith(input);
  input.focus();
  input.select();
  
  function saveName() {
    const newName = input.value.trim();
    const newNameElement = document.createElement('span');
    newNameElement.className = 'subfolder-name';
    newNameElement.textContent = newName || currentName;
    input.replaceWith(newNameElement);
    
    // 데이터 업데이트
    if (newName && newName !== currentName && currentOpenFolder) {
      const data = folderData[currentOpenFolder];
      if (data && data.subfolders[index]) {
        data.subfolders[index].name = newName;
      }
    }
  }
  
  input.addEventListener('blur', saveName);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      const newNameElement = document.createElement('span');
      newNameElement.className = 'subfolder-name';
      newNameElement.textContent = currentName;
      input.replaceWith(newNameElement);
    }
  });
}

// 하위 폴더 삭제
function deleteSubfolder(event, index) {
  // 이벤트 전파 막기
  if (event) {
    event.stopPropagation();
  }
  
  const subfolders = document.querySelectorAll('.subfolder-section');
  const section = subfolders[index];
  const name = section.querySelector('.subfolder-name').textContent;
  
  // 커스텀 확인 모달 사용
  openConfirmModal(`'${name}' 폴더와 모든 내용을 삭제하시겠습니까?`, function() {
    if (currentOpenFolder && folderData[currentOpenFolder]) {
      folderData[currentOpenFolder].subfolders.splice(index, 1);
    }
    section.remove();
  });
}

// 파일 삭제
function deleteFile(event, index) {
  // 이벤트 전파 막기
  if (event) {
    event.stopPropagation();
  }
  
  const files = document.querySelectorAll('.file-item');
  const file = files[index];
  const name = file.querySelector('.file-name').textContent;
  
  // 커스텀 확인 모달 사용
  openConfirmModal(`'${name}' 파일을 삭제하시겠습니까?`, function() {
    file.remove();
  });
}

// 파일 업로드 (시뮬레이션)
function uploadFile() {
  alert('파일 업로드 기능은 데모 버전에서는 지원되지 않습니다.');
}

// AI 정리 모달 열기
function showAIOrganizeModal() {
  const modal = document.getElementById('aiOrganizeModal');
  const favoriteList = document.getElementById('aiFavoriteList');
  
  // AI 추천 항목 생성 (시뮬레이션)
  const recommendations = [
    { name: '도형의 닮음', type: 'PPT', icon: 'https://www.genspark.ai/api/files/s/50jcx26m', isImage: true },
    { name: '피타고라스 정리', type: 'PPT', icon: 'https://www.genspark.ai/api/files/s/50jcx26m', isImage: true },
    { name: '3단원_수업자료', type: '폴더', icon: '📁', isImage: false },
    { name: '소인수분해_형성평가', type: 'HWP', icon: 'https://www.genspark.ai/api/files/s/674ELGGT', isImage: true },
    { name: '3단원_함수_01', type: '이미지', icon: 'https://www.genspark.ai/api/files/s/AP1n8OCE', isImage: true }
  ];
  
  let listHTML = '';
  recommendations.forEach((item, index) => {
    const iconHTML = item.isImage 
      ? `<img src="${item.icon}" alt="${item.type}" style="width: 32px; height: 32px; object-fit: contain;">`
      : item.icon;
    
    listHTML += `
      <label class="ai-favorite-item">
        <input type="checkbox" data-index="${index}" checked>
        <span class="ai-favorite-item-icon">${iconHTML}</span>
        <span class="ai-favorite-item-name">${item.name}</span>
        <span class="ai-favorite-item-type">${item.type}</span>
      </label>
    `;
  });
  
  favoriteList.innerHTML = listHTML;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// AI 즐겨찾기 추천 적용
function applyAIFavorites() {
  const checkboxes = document.querySelectorAll('#aiFavoriteList input[type="checkbox"]:checked');
  const recommendations = ['도형의 닮음', '피타고라스 정리', '3단원_수업자료', '소인수분해_형성평가', '3단원_함수_01'];
  
  const grid = document.getElementById('resourcesGrid');
  const items = grid.querySelectorAll('.resource-item');
  
  let count = 0;
  checkboxes.forEach(checkbox => {
    const index = parseInt(checkbox.dataset.index);
    const itemName = recommendations[index];
    
    // 해당 항목 찾아서 즐겨찾기 설정
    items.forEach(item => {
      const nameElement = item.querySelector('.resource-name');
      if (nameElement && nameElement.textContent.trim() === itemName) {
        const star = item.querySelector('.favorite-star');
        if (star && star.dataset.favorite === 'false') {
          star.dataset.favorite = 'true';
          star.classList.add('active');
          star.innerHTML = '⭐<span class="tooltip">즐겨찾기 해제</span>';
          count++;
        }
      }
    });
  });
  
  closeAIOrganizeModal();
  
  // 완료 메시지
  if (count > 0) {
    alert(`${count}개 항목이 즐겨찾기에 추가되었습니다! ⭐`);
  }
}

// AI 정리 모달 닫기
function closeAIOrganizeModal() {
  const modal = document.getElementById('aiOrganizeModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// AI 자동 정리 실행
function executeAIOrganize() {
  closeAIOrganizeModal();
  
  // 로딩 표시
  alert('AI가 자료를 분석하고 있습니다...');
  
  // 시뮬레이션: 2초 후 완료
  setTimeout(() => {
    alert('AI 자동 정리가 완료되었습니다!\n\n단원별, 개념별, 활동/평가 유형별로 폴더가 정리되었습니다.');
    
    // 실제로는 여기서 자료를 재구성
    // 데모에서는 기존 구조 유지
  }, 2000);
}

// AI 정리 모달 배경 클릭 시 닫기
document.addEventListener('DOMContentLoaded', function() {
  const aiModal = document.getElementById('aiOrganizeModal');
  if (aiModal) {
    aiModal.addEventListener('click', function(e) {
      if (e.target === aiModal) {
        closeAIOrganizeModal();
      }
    });
  }
});

// ========================================
// 커스텀 모달 시스템
// ========================================

let pendingFolderCallback = null;
let pendingDeleteCallback = null;
let isFavoriteFilterActive = false;

// 즐겨찾기 토글 기능
function toggleFavorite(star) {
  const isFavorite = star.dataset.favorite === 'true';
  
  if (isFavorite) {
    star.dataset.favorite = 'false';
    star.classList.remove('active');
    star.innerHTML = '☆<span class="tooltip">즐겨찾기에 추가</span>';
  } else {
    star.dataset.favorite = 'true';
    star.classList.add('active');
    star.innerHTML = '⭐<span class="tooltip">즐겨찾기 해제</span>';
  }
}

// 즐겨찾기 필터 토글
function toggleFavoriteFilter() {
  isFavoriteFilterActive = !isFavoriteFilterActive;
  const btn = document.querySelector('.favorite-filter-btn');
  const text = document.getElementById('favoriteFilterText');
  const grid = document.getElementById('resourcesGrid');
  const items = grid.querySelectorAll('.resource-item');
  
  if (isFavoriteFilterActive) {
    btn.classList.add('active');
    text.textContent = '전체 보기';
    
    // 즐겨찾기가 아닌 항목 숨기기
    items.forEach(item => {
      const star = item.querySelector('.favorite-star');
      if (star && star.dataset.favorite === 'false') {
        item.style.display = 'none';
      }
    });
  } else {
    btn.classList.remove('active');
    text.textContent = '즐겨찾기만 보기';
    
    // 모든 항목 보이기
    items.forEach(item => {
      item.style.display = '';
    });
  }
}

// 일괄 즐겨찾기 추가
function bulkAddFavorite() {
  const grid = document.getElementById('resourcesGrid');
  const checkboxes = grid.querySelectorAll('.item-checkbox:checked');
  
  if (checkboxes.length === 0) {
    alert('항목을 선택해주세요.');
    return;
  }
  
  checkboxes.forEach(checkbox => {
    const item = checkbox.closest('.resource-item');
    const star = item.querySelector('.favorite-star');
    if (star && star.dataset.favorite === 'false') {
      star.dataset.favorite = 'true';
      star.classList.add('active');
      star.innerHTML = '⭐<span class="tooltip">즐겨찾기 해제</span>';
    }
  });
  
  alert(`${checkboxes.length}개 항목이 즐겨찾기에 추가되었습니다! ⭐`);
}

// 일괄 즐겨찾기 해제
function bulkRemoveFavorite() {
  const grid = document.getElementById('resourcesGrid');
  const checkboxes = grid.querySelectorAll('.item-checkbox:checked');
  
  if (checkboxes.length === 0) {
    alert('항목을 선택해주세요.');
    return;
  }
  
  checkboxes.forEach(checkbox => {
    const item = checkbox.closest('.resource-item');
    const star = item.querySelector('.favorite-star');
    if (star && star.dataset.favorite === 'true') {
      star.dataset.favorite = 'false';
      star.classList.remove('active');
      star.innerHTML = '☆<span class="tooltip">즐겨찾기에 추가</span>';
    }
  });
  
  alert(`${checkboxes.length}개 항목의 즐겨찾기가 해제되었습니다.`);
}

// 일괄 삭제
function bulkDelete() {
  const grid = document.getElementById('resourcesGrid');
  const checkboxes = grid.querySelectorAll('.item-checkbox:checked');
  
  if (checkboxes.length === 0) {
    alert('항목을 선택해주세요.');
    return;
  }
  
  openConfirmModal(`선택한 ${checkboxes.length}개 항목을 삭제하시겠습니까?`, function() {
    checkboxes.forEach(checkbox => {
      const item = checkbox.closest('.resource-item');
      
      // 폴더 데이터에서도 제거
      if (item.classList.contains('folder-item')) {
        const folderName = item.dataset.folder;
        if (folderData[folderName]) {
          delete folderData[folderName];
        }
      }
      
      item.remove();
    });
    
    alert(`${checkboxes.length}개 항목이 삭제되었습니다.`);
  });
}

// 입력 모달 열기
function openInputModal(defaultValue = '', callback) {
  const modal = document.getElementById('inputModal');
  const input = document.getElementById('folderNameInput');
  
  input.value = defaultValue;
  pendingFolderCallback = callback;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => {
    input.focus();
    input.select();
  }, 100);
}

// 입력 모달 닫기
function closeInputModal() {
  const modal = document.getElementById('inputModal');
  const input = document.getElementById('folderNameInput');
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  input.value = '';
  pendingFolderCallback = null;
}

// 폴더 이름 확인
function confirmFolderName() {
  const input = document.getElementById('folderNameInput');
  const folderName = input.value.trim();
  
  if (!folderName) {
    alert('폴더 이름을 입력해주세요.');
    input.focus();
    return;
  }
  
  if (pendingFolderCallback) {
    pendingFolderCallback(folderName);
  }
  
  closeInputModal();
}

// 확인 모달 열기
function openConfirmModal(message, callback) {
  const modal = document.getElementById('confirmModal');
  const messageElement = document.getElementById('confirmMessage');
  
  messageElement.textContent = message;
  pendingDeleteCallback = callback;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// 확인 모달 닫기
function closeConfirmModal() {
  const modal = document.getElementById('confirmModal');
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  pendingDeleteCallback = null;
}

// 삭제 확인
function confirmDelete() {
  if (pendingDeleteCallback) {
    pendingDeleteCallback();
  }
  closeConfirmModal();
}

// Enter 키로 입력 모달 확인
document.addEventListener('DOMContentLoaded', function() {
  const inputModal = document.getElementById('inputModal');
  if (inputModal) {
    inputModal.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        confirmFolderName();
      } else if (e.key === 'Escape') {
        closeInputModal();
      }
    });
  }
  
  // ESC 키로 확인 모달 닫기
  const confirmModal = document.getElementById('confirmModal');
  if (confirmModal) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && confirmModal.classList.contains('active')) {
        closeConfirmModal();
      }
    });
  }
  
  // 배경 클릭으로 모달 닫기
  const modals = ['inputModal', 'confirmModal'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          if (modalId === 'inputModal') closeInputModal();
          if (modalId === 'confirmModal') closeConfirmModal();
        }
      });
    }
  });
});

