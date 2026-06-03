async function d(o,e={}){if(e.useMock)return i(o,e);try{const n=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:o,settings:e})});if(!n.ok){const r=await n.json();throw new Error(r.error||"네트워크 응답이 올바르지 않습니다.")}return(await n.json()).text}catch(n){return console.error("AI Error:",n),`오류 발생: ${n.message}. 터미널 로그를 확인하거나 gcloud 인증 상태를 체크해주세요.`}}function i(o,e){return new Promise(n=>{setTimeout(()=>{const t=e.lang==="en"?"English":"Korean",r=e.tone==="creative"?"창의적인":e.tone==="friendly"?"친절한":"전문적인",a={영어:`### [Mock] 영어 학습 전문가 페르소나 프롬프트
        
\`\`\`markdown
당신은 20년 경력의 베테랑 영어 튜터입니다. 
사용자가 "${o}"에 대해 질문하면 다음 규칙을 지켜 답변하세요:
- ${r} 말투를 유지할 것.
- 답변은 ${t}로 작성할 것.
- 구체적인 학습 예시를 3가지 이상 포함할 것.
\`\`\`

*이 답변은 Mock(가짜) 모드에서 생성된 예시입니다.*`,코딩:`### [Mock] 풀스택 개발자 프롬프트 가이드
        
\`\`\`markdown
당신은 실무 경험이 풍부한 시니어 개발자입니다.
"${o}"와 관련된 코드 리뷰 및 최적화 전략을 제안하세요.
- 언어: ${t}
- 분위기: ${r}
- 코드 가독성과 성능 최적화에 집중하세요.
\`\`\`

*이 답변은 Mock(가짜) 모드에서 생성된 예시입니다.*`,default:`### [Mock] 맞춤형 프롬프트 설계 결과
        
\`\`\`markdown
[시스템 설정]
역할: "${o}" 분야의 전문가
말투: ${r}
언어: ${t}

[지시 사항]
입력된 "${o}"와(과) 관련하여 가장 효율적이고 실용적인 가이드를 제공하세요.
구조화된 형식을 사용하여 사용자가 정보를 한눈에 파악할 수 있도록 돕습니다.
\`\`\`

*이 답변은 Mock(가짜) 모드에서 생성된 예시입니다. 실제 API가 연결되지 않은 상태입니다.*`},c=Object.keys(a).find(s=>o.includes(s))||"default";n(a[c])},1500)})}export{d as askAi};
