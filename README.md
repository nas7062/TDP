# SIMVEX (2026 블레이버스 MVP 해커톤 최우수상)

> 교과서 그림만으로는 이해하기 어려운 복잡한 기계 구조, 이제 3D로 돌려보고 분해하며 배우세요.

SIMVEX는 3D 기계 모델을 활용한 인터랙티브 학습 플랫폼입니다. 사용자는 다양한 기계 구조를 3D로 시각화하고, 분해하며, 퀴즈를 통해 학습할 수 있습니다.

## 🚀 주요 기능

### 3D 모델 뷰어
- Three.js 기반의 고성능 3D 모델 렌더링
- 모델 회전, 확대/축소, 분해(Explode) 기능
- 다양한 뷰 모드 지원 (전면, 측면, 상면 등)
- 모델 부품 선택 및 상세 정보 확인

### 학습 관리
- 사용자별 학습 데이터 추적
- 퀴즈 기능을 통한 학습 평가
- 학습 진행도 및 성적 관리
- 학습 이력 및 통계 확인

### AI 어시스턴트
- 실시간 AI 채팅을 통한 학습 지원
- SSE(Server-Sent Events) 기반 스트리밍 응답
- 모델 및 부품에 대한 질의응답

### PDF 뷰어
- 교재 PDF 파일 뷰어
- 3D 모델과 연동된 학습 자료 제공

### 메모 기능
- 학습 중 메모 작성 및 관리
- 부품별 메모 연결

## 🛠 기술 스택

### 프론트엔드
- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **3D Graphics**: Three.js 0.182.0, @react-three/fiber, @react-three/drei
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **State Management**: React Hooks

### 주요 라이브러리
- `lucide-react`: 아이콘
- `jspdf`, `html2canvas-pro`: PDF 생성 및 이미지 처리
- `radix-ui`: 접근성 있는 UI 컴포넌트
- `class-variance-authority`, `clsx`, `tailwind-merge`: 스타일 유틸리티

## 📋 사전 요구사항

- Node.js 20 이상
- npm, yarn, pnpm 또는 bun 중 하나

## 🔧 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd frontend
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
```

### 4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 📁 프로젝트 구조

```
frontend/
├── app/                    # Next.js App Router 페이지
│   ├── api/               # API 라우트 핸들러
│   ├── learning-data/     # 학습 데이터 페이지
│   ├── pdf/               # PDF 뷰어 페이지
│   ├── profile/           # 사용자 프로필 페이지
│   ├── select/            # 모델 선택 페이지
│   └── viewer/            # 3D 뷰어 페이지
├── components/            # React 컴포넌트
│   ├── LearningData/     # 학습 데이터 관련 컴포넌트
│   ├── QuizButton/       # 퀴즈 관련 컴포넌트
│   ├── RightPannel/      # 우측 패널 컴포넌트
│   ├── ThreeView/        # 3D 뷰어 컴포넌트
│   └── ui/               # 공통 UI 컴포넌트
├── lib/                   # 유틸리티 및 헬퍼 함수
│   ├── api/              # API 클라이언트 함수
│   ├── hook/             # 커스텀 훅
│   └── util/             # 유틸리티 함수
├── types/                 # TypeScript 타입 정의
├── public/                # 정적 파일
│   ├── icons/            # SVG 아이콘
│   ├── images/           # 이미지 파일
│   └── models/           # 3D 모델 파일 (.glb)
└── constant/              # 상수 정의
```

## 🎯 주요 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format

# 코드 포맷팅 검사
npm run format:check
```

## 🔌 API 연동

프로젝트는 백엔드 API와 통신하기 위해 프록시를 사용합니다. `next.config.ts`에서 API 경로를 설정할 수 있습니다.

- API 요청은 `/proxy/:path*` 경로를 통해 백엔드로 전달됩니다.
- 환경 변수 `NEXT_PUBLIC_API_BASE_URL`에 백엔드 API 기본 URL을 설정하세요.

## 🎨 스타일링

- **Tailwind CSS 4**를 사용한 유틸리티 기반 스타일링
- **Pretendard** 폰트 사용
- SVG 아이콘은 `@svgr/webpack`을 통해 React 컴포넌트로 변환

## 📦 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

빌드가 완료되면 `.next` 디렉토리에 최적화된 프로덕션 빌드가 생성됩니다.

### 배포

이 프로젝트는 Vercel, Render 등 Next.js를 지원하는 플랫폼에 배포할 수 있습니다.



