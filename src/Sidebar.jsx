import React from 'react';
import { 
  Terminal, 
  FileText, 
  Coffee, 
  Bookmark,
  ChevronLeft,
  Menu,
  Settings,
  Sun,
  Moon
} from 'lucide-react';

export const CATEGORIES = [
  { name: "전체", icon: <Menu size={20} /> },
  { name: "저장됨", icon: <Bookmark size={20} /> },
  { name: "학습", icon: <Terminal size={20} /> },
  { name: "업무", icon: <FileText size={20} /> },
  { name: "일상", icon: <Coffee size={20} /> },
  { name: "코딩", icon: <Terminal size={20} /> },
  { name: "창작", icon: <FileText size={20} /> },
];

export default function Sidebar({ activeCategory, setActiveCategory, setView, isCollapsed, setIsCollapsed, theme, toggleTheme }) {
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* AI 모드 시 모서리에 도는 무지개 효과 */}
      <div className="sidebar-rainbow-corners">
        <div className="corner-dot top-left"></div>
        <div className="corner-dot top-right"></div>
        <div className="corner-dot bottom-left"></div>
        <div className="corner-dot bottom-right"></div>
      </div>

      <div className="sidebar-header-wrapper">
        <div 
          className="sidebar-header" 
          onClick={() => {
            setActiveCategory('전체');
            setView('main');
          }}
        >
          <div className="logo-brace">{'{ }'}</div>
          {!isCollapsed && <span>PROMPT.HUB</span>}
        </div>
        
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          <ChevronLeft size={28} className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex flex-col gap-2 mb-12">
        {!isCollapsed && <p className="sidebar-label">탐색</p>}
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.name}
            onClick={() => {
              setActiveCategory(cat.name);
              setView('main');
            }}
            className={`sidebar-item ${activeCategory === cat.name ? 'active' : ''}`}
            title={isCollapsed ? cat.name : ""}
          >
            {cat.icon}
            {!isCollapsed && <span>{cat.name}</span>}
          </div>
        ))}
        
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <div 
            className="sidebar-item" 
            onClick={toggleTheme}
            title={isCollapsed ? (theme === 'dark' ? '라이트 모드' : '다크 모드') : ""}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {!isCollapsed && <span>{theme === 'dark' ? '라이트 모드' : '다크 모드'}</span>}
          </div>
          <div 
            className="sidebar-item" 
            onClick={() => setView('settings')}
            title={isCollapsed ? "설정" : ""}
          >
            <Settings size={20} />
            {!isCollapsed && <span>설정</span>}
          </div>
        </div>
      </nav>
    </aside>
  );
}
