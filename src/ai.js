/**
 * Vertex AI를 브라우저에서 직접 호출하면 인증 및 CORS 문제가 발생하므로,
 * vite.config.js에 설정한 로컬 프록시 서버(/api/ai)를 통해 호출합니다.
 */
export async function askAi(query, settings = {}) {
  // Mock 모드가 활성화된 경우
  if (settings.useMock) {
    return getMockResponse(query, settings);
  }

  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, settings }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '네트워크 응답이 올바르지 않습니다.');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI Error:", error);
    return `오류 발생: ${error.message}. 터미널 로그를 확인하거나 gcloud 인증 상태를 체크해주세요.`;
  }
}

/**
 * API 호출 없이 반환할 가짜(Mock) 데이터
 */
function getMockResponse(query, settings) {
  return new Promise((resolve) => {
    // 실제 AI처럼 보이기 위해 약간의 지연 시간 추가
    setTimeout(() => {
      const lang = settings.lang === 'en' ? 'English' : 'Korean';
      const tone = settings.tone === 'creative' ? '창의적인' : (settings.tone === 'friendly' ? '친절한' : '전문적인');
      
      const responses = {
        "영어": `### [Mock] 영어 학습 전문가 페르소나 프롬프트
        
\`\`\`markdown
당신은 20년 경력의 베테랑 영어 튜터입니다. 
사용자가 "${query}"에 대해 질문하면 다음 규칙을 지켜 답변하세요:
- ${tone} 말투를 유지할 것.
- 답변은 ${lang}로 작성할 것.
- 구체적인 학습 예시를 3가지 이상 포함할 것.
\`\`\`

*이 답변은 Mock(가짜) 모드에서 생성된 예시입니다.*`,

        "코딩": `### [Mock] 풀스택 개발자 프롬프트 가이드
        
\`\`\`markdown
당신은 실무 경험이 풍부한 시니어 개발자입니다.
"${query}"와 관련된 코드 리뷰 및 최적화 전략을 제안하세요.
- 언어: ${lang}
- 분위기: ${tone}
- 코드 가독성과 성능 최적화에 집중하세요.
\`\`\`

*이 답변은 Mock(가짜) 모드에서 생성된 예시입니다.*`,

        "default": `### [Mock] 맞춤형 프롬프트 설계 결과
        
\`\`\`markdown
[시스템 설정]
역할: "${query}" 분야의 전문가
말투: ${tone}
언어: ${lang}

[지시 사항]
입력된 "${query}"와(과) 관련하여 가장 효율적이고 실용적인 가이드를 제공하세요.
구조화된 형식을 사용하여 사용자가 정보를 한눈에 파악할 수 있도록 돕습니다.
\`\`\`

*이 답변은 Mock(가짜) 모드에서 생성된 예시입니다. 실제 API가 연결되지 않은 상태입니다.*`
      };

      // 키워드 매칭 또는 기본값 반환
      const matchedKey = Object.keys(responses).find(key => query.includes(key)) || "default";
      resolve(responses[matchedKey]);
    }, 1500);
  });
}
