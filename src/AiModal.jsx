import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Sparkles, Copy, Check, Share2 } from 'lucide-react';
import GeminiIcon from './GeminiIcon';

const AiModal = ({ isOpen, onClose, query, response, isLoading, onShare }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (response) {
      const cleanContent = response.replace(/```markdown\n|```/g, '').trim();
      navigator.clipboard.writeText(cleanContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareClick = () => {
    const cleanContent = response.replace(/```markdown\n|```/g, '').trim();
    onShare(cleanContent);
  };

  return (
    <div className="ai-studio-overlay">
      <div className="ai-studio-container" style={{ maxWidth: '900px' }}>
        <header className="ai-studio-header">
          <div className="ai-studio-branding">
            <div className="ai-sparkle-container" style={{ background: 'transparent', boxShadow: 'none' }}>
              <GeminiIcon size={32} />
            </div>
            <div className="ai-studio-info">
              <h1>AI 프롬프트 생성</h1>
              <span className="ai-studio-status">
                {isLoading ? '최적의 결과를 만드는 중...' : '프롬프트 완성'}
              </span>
            </div>
          </div>
          <button className="ai-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <main className="ai-studio-main">
          <section className="ai-studio-content">
            <div className="ai-content-inner">
              <div className="ai-query-display" style={{ marginBottom: '2rem' }}>
                <div className="query-header">
                  <span className="query-tag">입력된 질문</span>
                  <div className="query-line"></div>
                </div>
                <h2 style={{ fontSize: '1.5rem' }}>"{query}"</h2>
              </div>

              <div className="ai-result-panel">
                <div className="panel-header">
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>생성된 프롬프트</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {response && !isLoading && (
                      <>
                        <button className="ai-copy-btn" onClick={handleShareClick} style={{ background: 'var(--surface-hover)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                          <Share2 size={16} />
                          <span>플랫폼에 공유하기</span>
                        </button>
                        <button className={`ai-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                          <span>{copied ? '복사됨' : '전체 복사'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="panel-body">
                  {isLoading ? (
                    <div className="ai-loading-container">
                      <div className="ai-shimmer-line"></div>
                      <div className="ai-shimmer-line short"></div>
                      <div className="ai-shimmer-line medium"></div>
                      <div className="ai-loading-text">Gemini가 프롬프트를 설계하고 있습니다</div>
                    </div>
                  ) : response ? (
                    <div className="ai-markdown-wrapper">
                      <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="ai-empty-state">생성된 결과가 없습니다.</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AiModal;
