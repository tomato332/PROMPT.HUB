import React from 'react';
import { X } from 'lucide-react';

export default function SubmitModal({ 
  showSubmitModal, 
  setShowSubmitModal, 
  handleSubmit, 
  newPrompt, 
  setNewPrompt 
}) {
  if (!showSubmitModal) return null;

  return (
    <div className="detail-view">
      <div className="detail-header">
        <h1 style={{fontSize: '1.75rem', fontWeight: 800}}>프롬프트 공유하기</h1>
        <button onClick={() => setShowSubmitModal(false)} className="close-btn">
          <X size={24} />
        </button>
      </div>
        
        <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label">제목</label>
          <div className="rainbow-input-wrapper">
            <div className="search-rainbow-container">
              <div className="search-rainbow-border"></div>
            </div>
            <input 
              required
              type="text" 
              placeholder="예: 초보자용 여행 계획 프롬프트"
              className="input-field"
              value={newPrompt.title}
              onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">한 줄 설명</label>
          <div className="rainbow-input-wrapper">
            <div className="search-rainbow-container">
              <div className="search-rainbow-border"></div>
            </div>
            <input 
              required
              type="text" 
              placeholder="이 프롬프트를 한 줄로 소개해주세요"
              className="input-field"
              value={newPrompt.description}
              onChange={(e) => setNewPrompt({...newPrompt, description: e.target.value})}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label className="form-label">카테고리</label>
            <div className="rainbow-input-wrapper">
              <div className="search-rainbow-container">
                <div className="search-rainbow-border"></div>
              </div>
              <select 
                className="select-field"
                value={newPrompt.category}
                onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})}
              >
                <option value="학습">학습</option>
                <option value="업무">업무</option>
                <option value="일상">일상</option>
                <option value="코딩">코딩</option>
                <option value="창작">창작</option>
              </select>
            </div>
          </div>
          <div className="form-group half">
            <label className="form-label">추천 모델</label>
            <div className="rainbow-input-wrapper">
              <div className="search-rainbow-container">
                <div className="search-rainbow-border"></div>
              </div>
              <select 
                className="select-field"
                value={newPrompt.model}
                onChange={(e) => setNewPrompt({...newPrompt, model: e.target.value})}
              >
                <option value="GPT-5.5">GPT-5.5</option>
                <option value="Claude 4.7 Opus">Claude 4.7 Opus</option>
                <option value="Gemini 3.5">Gemini 3.5</option>
                <option value="Llama 4">Llama 4</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">프롬프트 내용</label>
          <div style={{fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem'}}>
            팁: <code style={{color: 'var(--accent)'}}>[변수명]</code> 형식을 사용하면 복사용 입력창이 자동으로 생성됩니다.
          </div>
          <div className="rainbow-input-wrapper" style={{borderRadius: '0.75rem'}}>
            <div className="search-rainbow-container">
              <div className="search-rainbow-border"></div>
            </div>
            <textarea 
              required
              placeholder="예: [도시명]의 맛집을 추천해줘."
              className="textarea-field"
              rows={8}
              value={newPrompt.content}
              onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">태그 (쉼표로 구분)</label>
          <div className="rainbow-input-wrapper">
            <div className="search-rainbow-container">
              <div className="search-rainbow-border"></div>
            </div>
            <input 
              type="text" 
              placeholder="예: 교육, 비유, 쉬운설명"
              className="input-field"
              value={newPrompt.tags}
              onChange={(e) => setNewPrompt({...newPrompt, tags: e.target.value})}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem'}}>
          프롬프트 등록하기
        </button>
      </form>
    </div>
  );
}
