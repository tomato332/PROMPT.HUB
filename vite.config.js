import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VertexAI } from '@google-cloud/vertexai'

// Vertex AI 설정
const project = 'deft-orb-494315-v4';
const location = 'us-central1';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vertex-ai-proxy',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/ai' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { query, settings } = JSON.parse(body);
                const vertex_ai = new VertexAI({ project: project, location: location });
                const generativeModel = vertex_ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

                const rulesText = settings?.rules?.join(', ') || '없음';
                const toneMap = { professional: '전문적이고 신중함', creative: '창의적이고 자유로움', friendly: '친절하고 부드러움' };
                const langMap = { ko: '한국어', en: 'English' };

                const prompt = `
                  [역할: 전문 프롬프트 디자이너]
                  사용자 요청 키워드: "${query}"
                  
                  [설정 옵션]
                  - 출력 형식: ${rulesText}
                  - 말투: ${toneMap[settings?.tone] || '전문적'}
                  - 언어: ${langMap[settings?.lang] || '한국어'}

                  [지시 사항]
                  1. 당신의 미션은 사용자가 입력한 주제에 대해 '재사용 가능한 고성능 프롬프트 템플릿'을 만드는 것입니다.
                  2. **핵심 규칙: 사용자가 상황에 맞게 수정해야 하는 모든 정보는 반드시 [변수명] 형태로 작성하세요.**
                     - 예시 (나쁜 예): "영어를 공부하는 학생을 위해..."
                     - 예시 (좋은 예): "[학습_대상]을(를) 위해 [학습_주제]에 대한 가이드를..."
                  3. 결과물은 반드시 다른 AI(ChatGPT 등)에게 입력할 페르소나, 지시사항, 제약조건이 포함된 완성된 형태여야 합니다.
                  4. 서론이나 설명 없이 바로 마크다운 코드 블록(\`\`\`markdown ... \`\`\`) 안에 프롬프트 템플릿을 제공하세요.
                  5. [변수]는 최소 3개 이상 포함하여 사용자가 커스텀할 수 있는 범위를 넓히세요..!
                `;

                const resp = await generativeModel.generateContent(prompt);
                const contentResponse = await resp.response;
                const resultText = contentResponse.candidates[0].content.parts[0].text;

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ text: resultText }));
              } catch (error) {
                console.error('Vertex AI Proxy Error:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: error.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    allowedHosts: true,
  }
})
