import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Copy 
} from 'lucide-react';

export default function PromptDetail({ 
  selectedPrompt, 
  setView, 
  handleCopy, 
  copyStatus 
}) {
  const [variables, setVariables] = useState({});
  const [parsedText, setParsedText] = useState("");

  if (!selectedPrompt) return null;

  // 프롬프트 본문에서 [...] 스타일의 변수를 추출합니다.
  const variableMatches = selectedPrompt.content.match(/\[(.*?)\]/g) || [];
  const uniqueVars = [...new Set(variableMatches.map(v => v.slice(1, -1)))];

  useEffect(() => {
    // 변수 초기화
    const initialVars = {};
    uniqueVars.forEach(v => {
      initialVars[v] = "";
    });
    setVariables(initialVars);
  }, [selectedPrompt.content]);

  useEffect(() => {
    // 변수가 치환된 텍스트 생성
    let currentText = selectedPrompt.content;
    uniqueVars.forEach(v => {
      const value = variables[v] || `[${v}]`;
      // 모든 발생 위치를 치환 (정규식 Escape 필요할 수 있으나 단순 구현)
      currentText = currentText.split(`[${v}]`).join(value);
    });
    setParsedText(currentText);
  }, [variables, selectedPrompt.content]);

  const handleInputChange = (varName, value) => {
    setVariables(prev => ({ ...prev, [varName]: value }));
  };

  return (
    <div className="detail-view">
      <button 
        onClick={() => setView('main')}
        className="back-btn"
      >
        <ArrowLeft size={16} />
        <span>목록으로 돌아가기</span>
      </button>

      <header>
          <div className="meta">
            <span>{selectedPrompt.model}</span>
            <span style={{opacity: 0.3}}>|</span>
            <span>{selectedPrompt.category}</span>
          </div>
          <h1>{selectedPrompt.title}</h1>
          <p className="description">{selectedPrompt.description}</p>
        </header>

        {uniqueVars.length > 0 && (
          <div className="variable-section" style={{marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid var(--border)'}}>
            <h3 style={{fontSize: '0.875rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: '600'}}>이 프롬프트에는 입력이 필요합니다</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {uniqueVars.map(v => (
                <div key={v} style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <label style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>{v}</label>
                  <input 
                    type="text"
                    value={variables[v] ?? ''}
                    onChange={(e) => handleInputChange(v, e.target.value)}
                    placeholder={`${v}을(를) 입력하세요...`}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="content-box">
          <div className="content-header">
            <span className="label">치환된 프롬프트 결과</span>
            <button 
              onClick={() => handleCopy(parsedText, 'main')}
              className="copy-btn"
            >
              {copyStatus === 'main' ? <Check size={12} /> : <Copy size={12} />}
              {copyStatus === 'main' ? "복사완료" : "복사하기"}
            </button>
          </div>
          <div className="content-body" style={{whiteSpace: 'pre-wrap'}}>
            {parsedText}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="section-title">작성자 팁</span>
          <p className="tips-text">{selectedPrompt.tips}</p>
        </div>
    </div>
  );
}
