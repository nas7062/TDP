interface IPart {
  name: string;
  image: string;
  title: string;
  status: string;
  descript: string;
}

interface IUser {
  idx: number;
  userId: string;
};

interface ICategoryItem {
  idx: number;
  name: string;
  image: string;
}

interface ICategory {
  totalCount: number;
  contents: ICategoryItem[];
};


interface IModelParts {
  idx: number;
  name: string;
  image: string;
  statusInfo: string;
  description: string;
}

interface IModelDetail {
  idx: number;
  name: string;
  image: string;
  asset: string;
  meta: string;
  description: string;
  items: IModelParts[]
}


type AxisType = 'Center' | 'X' | 'Y' | 'Z'

type TabType = "기계공학" | "생명공학" | "의공학";

// 우측패널

type RightPannelUIType = "default" | "expanded" | "full"; // 기본 상태 / 아래위로 열린 상태 / 왼쪽패널도 있는 상태
type RightPannelContentType = "AI 어시스턴스" | "메모장";
type RightPannelSideContentType = "history" | "search"; // 기록 / 검색창
