/** 로그인 여부 확인용 쿠키 이름 (Proxy에서 리다이렉트 판단, 클라이언트에서 설정) */
export const USER_COOKIE_NAME = "tdp-user";

export const machineList = {
  기계공학: [
    { name: "로봇 팔", img: "/images/Arm.png" },
    { name: "드론", img: "/images/Drone.png" },
    { name: "V4 Engine", img: "/images/Engine.png" },
    { name: "Leaf Spring", img: "/images/Spring.png" },
    { name: "Robot Gripper", img: "/images/Gripper.png" },
    { name: "Machine Vice", img: "/images/Vice.png" },
    { name: "Suspension", img: "/images/Suspension.png" }
  ],
  생명공학: [{ name: "생명공학1", img: "/images/Vice.png" }],
  의공학: [{ name: "의공학1", img: "/images/Suspension.png" }]
};

export const ActionButtons = [
  {
    icon: "/icons/Home.svg",
    label: "홈"
  },
  {
    icon: "/icons/See.svg",
    label: "보기"
  },
  {
    icon: "/icons/Explode.svg",
    label: "분해"
  },
  {
    icon: "/icons/Reset.svg",
    label: "초기화"
  }
];

export const PartListMock: IPart[] = [
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  },
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  },
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  },
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  },
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  },
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  },
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  },
  {
    name: "로봇팔",
    image: "/images/Arm.png",
    title: "제트엔진 > 연소실",
    status: "작동 온도 약 1,500°C ~ 2,000°C",
    descript: `압축기로부터 들어온 고압의 공기에 연료를 분사하여 폭발시키고, 그 팽창 에너지를 터빈으로 전달하는 기계의 '심장'부입니다.`
  }
];

export const AXIS_OPTIONS: { label: string; value: AxisType }[] = [
  { label: "중앙", value: "Center" },
  { label: "X축", value: "X" },
  { label: "Y축", value: "Y" },
  { label: "Z축", value: "Z" }
];

export function parseSnapshot(meta: string): ViewerState | null {
  try {
    const s = JSON.parse(meta);
    if (!s?.camera?.position || !s?.controls?.target) return null;
    return s as ViewerState;
  } catch {
    return null;
  }
}

export const CHIP_LEVEL_CONFIG = {
  "마스터 엔지니어": { label: "마스터 엔지니어", className: "bg-[#FFE4A0] text-[#FF9421]" },
  "수석 설계자": { label: "수석 설계자", className: "bg-[#F6E4FF] text-[#AC76CC]" },
  "전문 기술자": { label: "전문 기술자", className: "bg-[#FFDFDE] text-[#EA544C]" },
  메커닉: { label: "메커닉", className: "bg-[#BBF4F8] text-[#0F9BB6]" },
  테크니션: { label: "테크니션", className: "bg-[#C7F2CE] text-[#3D913B]" },
  "입문 지망생": { label: "입문 지망생", className: "bg-[#B8E4FF] text-[#335C6F]" }
} as const;

export type ChipLevel = keyof typeof CHIP_LEVEL_CONFIG;

export const MENU_TOP_ITEMS = [
  { label: "나의 학습 데이터", icon: "/icons/Graph.svg", href: "/learning-data" },
  { label: "워크 플로우", icon: "/icons/Workflow.svg" },
  { label: "PDF 내보내기", icon: "/icons/Pdf.svg", href: "/pdf" }
] as const;

export const MENU_BOTTOM_ITEMS = [
  { label: "홈화면", icon: "/icons/Home.svg", href: "/select" },
  { label: "로그아웃", icon: "/icons/Logout.svg", isLogout: true }
] as const;

export const FALLBACK_GRADES: GradeRule[] = [
  { grade: "마스터 엔지니어", minSolved: 100 },
  { grade: "수석 설계자", minSolved: 71, maxSolved: 99 },
  { grade: "전문 기술자", minSolved: 51, maxSolved: 70 },
  { grade: "메커닉", minSolved: 31, maxSolved: 50 },
  { grade: "테크니션", minSolved: 16, maxSolved: 30 },
  { grade: "입문 지망생", minSolved: 0, maxSolved: 15 }
];

export const MODEL_PATH_BY_IDX: Record<number, string> = {
  7: "/models/Drone4.glb",
  8: "/models/RobotArm3.glb",
  9: "/models/Engine5.glb",
  10: "/models/RobotGripper6.glb"
};

export const MODEL_NAME_BY_IDX: Record<number, string> = {
  7: "드론(Drone)",
  8: "산업용 로봇 암",
  9: "4기통 엔진 구동계",
  10: "기어 구동 로봇 그리퍼"
};
