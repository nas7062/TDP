"use client";

import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { makeMemo, updateMemo } from "@/lib/api/memo";
import { useSearchParams } from "next/navigation";
import useDebounce from "@/lib/hook/useDebounce";

type Props = {
  uiType: RightPannelUIType;
  setUiType: Dispatch<SetStateAction<RightPannelUIType>>;
  memoIdx?: number | null;
  setMemoIdx: Dispatch<SetStateAction<number | null>>;
  selectedMemo?: MemoContent;
  setMemoList: Dispatch<SetStateAction<MemoContent[]>>;
};

const MIN_HEIGHT = 40;

export default function MemoContent({
  uiType,
  setUiType,
  memoIdx,
  setMemoIdx,
  selectedMemo,
  setMemoList
}: Props) {
  const userIdx =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}")?.idx : "";
  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? parseInt(searchParams.get("modelIdx")!) : 0;

  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // selectedMemo가 변경되면 inputValue 업데이트
  useEffect(() => {
    if (memoIdx !== null && selectedMemo) {
      setInputValue(selectedMemo?.memo || "");
    } else {
      setInputValue("");
    }
  }, [memoIdx, selectedMemo]);

  // setMemoIdx(null);

  // 입력 시작 시 패널 확장
  useEffect(() => {
    if (uiType !== "default") return;
    if (inputValue.trim().length > 0) {
      setUiType("expanded");
    }
  }, [inputValue, uiType, setUiType]);

  // textarea 높이 조정 (expanded일 때는 전체 높이)
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (uiType !== "default") {
      ta.style.height = "100%";
    } else {
      ta.style.height = `${MIN_HEIGHT}px`;
    }
  }, [uiType]);

  // debouncedInputValue가 변경될 때마다 저장
  useEffect(() => {
    if (!userIdx) return;

    const save = async () => {
      try {
        console.log("save");
        if ((memoIdx === null || memoIdx === undefined) && debouncedInputValue.trim().length > 0) {
          const res = await makeMemo({
            userIdx: parseInt(userIdx),
            memo: debouncedInputValue,
            modelIdx
          });
          setMemoIdx(res.idx);
          setMemoList((prev) => [{ idx: res.idx, memo: debouncedInputValue }, ...prev]);
        } else if (memoIdx !== null && memoIdx !== undefined) {
          await updateMemo({
            userIdx: parseInt(userIdx),
            memo: debouncedInputValue,
            modelIdx,
            memoIdx
          });
          setMemoList((prev) =>
            prev.map((memo) =>
              memo.idx === memoIdx ? { ...memo, memo: debouncedInputValue } : memo
            )
          );
        }
      } catch (error) {
        console.error("메모 저장 실패:", error);
      }
    };
    save();
  }, [debouncedInputValue]);

  return (
    <div
      className={`flex flex-col h-full min-h-0 ${uiType === "default" ? "justify-end" : "justify-start"}`}
    >
      <textarea
        id="memoInput"
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="원하는 내용을 적어보세요."
        className={`w-full resize-none px-4 py-2 text-[15px] leading-6 placeholder:text-gray-400 outline-none ${
          uiType === "expanded" ? "flex-1 min-h-0" : ""
        }`}
        style={{ height: uiType !== "default" ? "100%" : MIN_HEIGHT }}
      />
    </div>
  );
}
