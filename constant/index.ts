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
    return JSON.parse(meta) as ViewerState;
  } catch {
    return null;
  }
}

export const CHIP_LEVEL_CONFIG = {
  6: {
    label: "마스터 엔지니어",
    className: "bg-[#FFE4A0] text-[#FF9421]"
  },
  5: {
    label: "수석 설계자",
    className: "bg-[#F6E4FF] text-[#AC76CC]"
  },
  4: {
    label: "전문 기술자",
    className: "bg-[#FFDFDE] text-[#EA544C]"
  },
  3: {
    label: "매커닉",
    className: "bg-[#BBF4F8] text-[#0F9BB6]"
  },
  2: {
    label: "테크니션",
    className: "bg-[#C7F2CE] text-[#3D913B]"
  },
  1: {
    label: "입문 지망생",
    className: "bg-[#B8E4FF] text-[#335C6F]"
  }
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

