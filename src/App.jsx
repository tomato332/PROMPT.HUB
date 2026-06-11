import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  ChevronRight,
  Trash2,
  Sparkles
} from 'lucide-react';
import Sidebar from './Sidebar';
import SubmitModal from './SubmitModal';
import PromptDetail from './PromptDetail';
import AiModal from './AiModal';
import GeminiIcon from './GeminiIcon';
import { prompts as initialPrompts } from './data/prompts';

export default function App() {
  const [prompts, setPrompts] = useState([]);

  // 단순 무식하게 로컬스토리지와 JSON 파일로 초기화
  useEffect(() => {
    const saved = localStorage.getItem('my_db');
    if (saved) {
      setPrompts(JSON.parse(saved));
    } else {
      // 데이터가 없으면 초기값 세팅 (생성된 100가지 추가)
      const initialData = [
        ...initialPrompts
      ];
      setPrompts(initialData);
      localStorage.setItem('my_db', JSON.stringify(initialData));
    }
  }, []);

  const [activeCategory, setActiveCategory] = useState("전체");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalQuery, setAiModalQuery] = useState("");

  // AI 설정 상태
  const [aiSettings, setAiSettings] = useState({
    rules: ['structured'],
    tone: 'professional',
    lang: 'ko',
    useMock: false,
    provider: 'vertex',   // 'vertex' | 'openrouter'
    model: '',            // OpenRouter 모델 ID (비우면 첫 번째 무료 모델)
  });
  const [freeModels, setFreeModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // OpenRouter 무료 모델 목록 불러오기
  useEffect(() => {
    if (aiSettings.provider === 'openrouter' && freeModels.length === 0) {
      setModelsLoading(true);
      import('./ai').then(({ getFreeModels }) => {
        getFreeModels().then(models => {
          setFreeModels(models);
          if (models.length > 0 && !aiSettings.model) {
            setAiSettings(prev => ({ ...prev, model: models[0].id }));
          }
          setModelsLoading(false);
        });
      });
    }
  }, [aiSettings.provider]);

  const handleAiSettingToggle = (rule) => {
    setAiSettings(prev => ({
      ...prev,
      rules: prev.rules.includes(rule) 
        ? prev.rules.filter(r => r !== rule)
        : [...prev.rules, rule]
    }));
  };

  const handleProviderChange = (provider) => {
    setAiSettings(prev => ({ ...prev, provider, model: '' }));
    setFreeModels([]);
  };
  const [copyStatus, setCopyStatus] = useState(null);
  const [view, setView] = useState('main');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showStickySearch, setShowStickySearch] = useState(false);

  useEffect(() => {
    // 카테고리나 뷰, 모달 상태가 바뀌면 스티키 검색바 초기화 및 스크롤 상단으로
    setShowStickySearch(false);
    const container = document.querySelector('.content-body-wrapper');
    if (container) {
      container.scrollTop = 0;
    }
  }, [activeCategory, view, showSubmitModal]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.content-body-wrapper');
      if (container) {
        // 상세 페이지가 아닐 때만 스티키 동작
        if (view === 'main' && !showSubmitModal) {
          setShowStickySearch(container.scrollTop > 300);
        }
      }
    };

    const container = document.querySelector('.content-body-wrapper');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [view]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [newPrompt, setNewPrompt] = useState({
    title: "",
    description: "",
    content: "",
    category: "일상",
    model: "GPT-5.5",
    tags: ""
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('정말 이 프롬프트를 삭제하시겠습니까?')) {
      const updated = prompts.filter(p => p.id !== id);
      setPrompts(updated);
      localStorage.setItem('my_db', JSON.stringify(updated));
      if (selectedPrompt?.id === id) {
        setView('main');
        setSelectedPrompt(null);
      }
    }
  };

  const filteredPrompts = prompts.filter(p => {
    const categoryMatch = activeCategory === "전체"
      || (activeCategory === "저장됨" && bookmarks.includes(p.id))
      || p.category === activeCategory;
    const searchMatch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const promptToAdd = {
      ...newPrompt,
      id: Date.now(),
      likes: 0,
      tags: newPrompt.tags.split(',').map(t => t.trim()),
      tips: "작성자가 직접 추가한 프롬프트입니다."
    };

    // 단순 무식하게 새 데이터 넣고 로컬스토리지 전체 덮어쓰기
    const updated = [promptToAdd, ...prompts];
    setPrompts(updated);
    localStorage.setItem('my_db', JSON.stringify(updated));

    setShowSubmitModal(false);
    setNewPrompt({
      title: "",
      description: "",
      content: "",
      category: "일상",
      model: "GPT-4o",
      tags: ""
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (isAiMode) {
      setAiModalQuery(searchQuery);
      setIsAiModalOpen(true);
      setIsAiLoading(true);
      setAiResponse("");
      try {
        const { askAi } = await import('./ai');
        const response = await askAi(searchQuery, aiSettings);
        setAiResponse(response);
      } catch (error) {
        setAiResponse("AI 모드 작동 중 오류가 발생했습니다.");
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleShareAiPrompt = (content) => {
    setNewPrompt({
      ...newPrompt,
      content: content,
      title: `${aiModalQuery} 관련 AI 추천 프롬프트`,
      category: "일상"
    });
    setIsAiModalOpen(false);
    setShowSubmitModal(true);
  };

  const handleCardClick = (prompt) => {
    setSelectedPrompt(prompt);
    setView('detail');
    setShowSubmitModal(false);
  };

  const handleOpenSubmit = () => {
    setShowSubmitModal(true);
    setView('main');
    setSelectedPrompt(null);
  };

  const handleAiButtonMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    button.style.setProperty('--mouse-x', `${x}%`);
    button.style.setProperty('--mouse-y', `${y}%`);
  };

  const toggleAiMode = () => {
    setIsAiMode(!isAiMode);
  };

  return (
    <div className={`page-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isAiMode ? 'ai-mode-active' : ''}`}>
      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setView('main');
          setShowSubmitModal(false);
          setSelectedPrompt(null);
        }}
        setView={setView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        {/* 헤더는 모든 페이지에서 일관되게 보여줍니다 (단, 상세페이지나 모달에서는 검색창을 가리는 식) */}
        <header className="main-header">
          <div className="header-title">
            <h1 className="text-lg font-bold tracking-tight">
              {view === 'main' ? (activeCategory === "전체" ? "프롬프트 탐색" : `${activeCategory} 프롬프트`) :
                view === 'detail' ? "상세 보기" :
                  showSubmitModal ? "프롬프트 공유" : "설정"}
            </h1>
          </div>

          <div className="header-search-container">
            <div className={`header-search-box ${(showStickySearch && view === 'main' && !showSubmitModal) ? 'visible' : ''} ${isAiMode ? 'ai-active' : ''}`}>
              <div className="search-rainbow-container">
                <div className="search-rainbow-border"></div>
              </div>
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder={isAiMode ? "AI에게 무엇이든 물어보세요..." : "프롬프트 검색..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className={`ai-button ${isAiMode ? 'active' : ''}`}
                onClick={toggleAiMode}
                onMouseMove={handleAiButtonMouseMove}
              >
                <div className="rainbow-container">
                  <div className="rainbow-border"></div>
                </div>
                <div className="button-content" style={{ padding: '6px 12px', height: '32px', fontSize: '13px' }}>
                  <GeminiIcon size={16} className={isAiMode ? 'sparkle-icon-active' : ''} />
                  <span>AI 모드</span>
                </div>
              </button>
            </div>          </div>

          <div className="header-actions">
            {view !== 'main' && !showSubmitModal && (
              <button className="popular-tag-btn" onClick={() => setView('main')}>돌아가기</button>
            )}
            <button className="btn-primary" onClick={handleOpenSubmit}>공유하기</button>
          </div>
        </header>

        <div className="content-body-wrapper scrollbar">
          {view === 'main' && !showSubmitModal && (
            <>
              {/* 대형 히어로 섹션 */}
              <div className="hero-section">
                <div className="hero-title-group">
                  <h2 className="hero-title">
                    {isAiMode ? "안녕하세요. 어떤 프롬프트가 필요하신가요?" : "당신의 영감을 찾는 가장 빠른 방법"}
                  </h2>
                  <p className="hero-subtitle">
                    {isAiMode ? "Gemini AI가 당신의 의도를 분석하여 최적의 프롬프트를 설계해드립니다." : "수천 개의 검증된 프롬프트를 탐색하고 바로 적용해보세요."}
                  </p>
                </div>

                <div className="hero-search-box-container">
                  <div className={`hero-search-box ${isAiMode ? 'ai-active' : ''}`}>
                    <div className="search-rainbow-container">
                      <div className="search-rainbow-border"></div>
                    </div>
                    <Search size={24} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder={isAiMode ? "AI에게 프롬프트 추천을 받아보세요..." : "어떤 프롬프트를 찾고 계신가요?"}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                      className={`ai-button ${isAiMode ? 'active' : ''}`}
                      onClick={toggleAiMode}
                      onMouseMove={handleAiButtonMouseMove}
                    >
                      <div className="rainbow-container">
                        <div className="rainbow-border"></div>
                      </div>
                      <div className="button-content">
                        <GeminiIcon size={20} className={isAiMode ? 'sparkle-icon-active' : ''} />
                        <span>AI 모드</span>
                      </div>
                    </button>
                  </div>
                  
                  {isAiMode && (
                    <div className="ai-pre-settings">
                      {/* 프로바이더 선택 */}
                      <div className="settings-group">
                        <button
                          className={`setting-chip provider-chip ${aiSettings.provider === 'vertex' ? 'active' : ''}`}
                          onClick={() => handleProviderChange('vertex')}
                        >Vertex AI</button>
                        <button
                          className={`setting-chip provider-chip ${aiSettings.provider === 'openrouter' ? 'active' : ''}`}
                          onClick={() => handleProviderChange('openrouter')}
                        >OpenRouter</button>
                      </div>
                      <div className="settings-divider"></div>
                      <div className="settings-group">
                        <button 
                          className={`setting-chip ${aiSettings.rules.includes('structured') ? 'active' : ''}`}
                          onClick={() => handleAiSettingToggle('structured')}
                        >구조화</button>
                        <button 
                          className={`setting-chip ${aiSettings.rules.includes('persona') ? 'active' : ''}`}
                          onClick={() => handleAiSettingToggle('persona')}
                        >페르소나</button>
                        <button 
                          className={`setting-chip ${aiSettings.rules.includes('fewshot') ? 'active' : ''}`}
                          onClick={() => handleAiSettingToggle('fewshot')}
                        >예시포함</button>
                      </div>
                      <div className="settings-divider"></div>
                      <select 
                        className="setting-select" 
                        value={aiSettings.tone}
                        onChange={(e) => setAiSettings({...aiSettings, tone: e.target.value})}
                      >
                        <option value="professional">전문적인 톤</option>
                        <option value="creative">창의적인 톤</option>
                        <option value="friendly">친절한 톤</option>
                      </select>
                      <select 
                        className="setting-select"
                        value={aiSettings.lang}
                        onChange={(e) => setAiSettings({...aiSettings, lang: e.target.value})}
                      >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                      </select>
                      <div className="settings-divider"></div>
                      {/* 모델 드롭다운 — 항상 자리 차지, OpenRouter 아니면 disabled */}
                      <select
                        className="setting-select model-select"
                        value={aiSettings.model}
                        disabled={aiSettings.provider !== 'openrouter'}
                        onChange={(e) => setAiSettings({...aiSettings, model: e.target.value})}
                      >
                        {modelsLoading ? (
                          <option value="">불러오는 중...</option>
                        ) : freeModels.length === 0 ? (
                          <option value="">무료 모델 없음</option>
                        ) : (
                          freeModels.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))
                        )}
                      </select>
                      <div className="settings-divider"></div>
                      <button 
                        className={`setting-chip ${aiSettings.useMock ? 'active mock' : ''}`}
                        onClick={() => setAiSettings({...aiSettings, useMock: !aiSettings.useMock})}
                        title="실제 API 호출 대신 가짜 데이터를 사용합니다"
                      >Mock AI</button>
                    </div>
                  )}
                </div>
                {/* <div className="popular-tags">
                  <span className="label">추천 키워드</span>
                  {["#GPT4o", "#이메일작성", "#여행일정", "#코딩가이드", "#마케팅"].map(tag => (
                    <button
                      key={tag}
                      className="tag-chip"
                      onClick={() => setSearchQuery(tag.replace('#', ''))}
                    >
                      {tag}
                    </button>
                  ))}
                </div> */}
              </div>

              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xs font-bold text-dim uppercase tracking-widest">탐색하기</h2>
              </div>

              <div className="prompt-list">
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className={`card ${selectedPrompt?.id === prompt.id ? 'active' : ''}`}
                    onClick={() => handleCardClick(prompt)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="card-tag">{prompt.model}</span>
                      <div className="flex gap-3 text-dim">
                        <button
                          className="delete-btn"
                          onClick={(e) => handleDelete(e, prompt.id)}
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className={`bookmark-btn ${bookmarks.includes(prompt.id) ? 'active' : ''}`}
                          onClick={(e) => toggleBookmark(e, prompt.id)}
                        >
                          <Bookmark size={18} fill={bookmarks.includes(prompt.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>

                    <h3>{prompt.title}</h3>
                    <p>{prompt.description}</p>

                    <div className="card-footer">
                      <div className="tag-list">
                        {prompt.tags.map(tag => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                      <ChevronRight size={14} className="chevron text-dim transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'detail' && selectedPrompt && !showSubmitModal && (
            <PromptDetail
              selectedPrompt={selectedPrompt}
              setView={setView}
              handleCopy={handleCopy}
              copyStatus={copyStatus}
            />
          )}

          {showSubmitModal && (
            <SubmitModal
              showSubmitModal={showSubmitModal}
              setShowSubmitModal={setShowSubmitModal}
              handleSubmit={handleSubmit}
              newPrompt={newPrompt}
              setNewPrompt={setNewPrompt}
            />
          )}

          {view === 'settings' && (
            <div className="detail-view">
              <h2>설정</h2>
              <p>환경 설정 페이지입니다. (준비 중)</p>
              <button className="btn-primary" onClick={() => setView('main')}>홈으로 돌아가기</button>
            </div>
          )}
        </div>
      </main>

      {/* AI 전용 모달 */}
      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        query={aiModalQuery}
        response={aiResponse}
        isLoading={isAiLoading}
        onShare={handleShareAiPrompt}
      />
    </div>
  );
}