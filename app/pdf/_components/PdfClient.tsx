"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { fetchModelByIdx } from "@/lib/api/model";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import Image from "next/image";
import { XIcon } from "lucide-react";
import RightPannelInPdf from "@/components/RightPannel/RightPannelInPdf";
import { BottomToolbar, TopToolbar } from "@/components/Toolbar";
import { Toast } from "@/components/Toast";

// A4 크기 (mm → px 변환, 96 DPI 기준)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.779527559; // 1mm = 3.779527559px (96 DPI)
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX; // 약 794px
const A4_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX; // 약 1123px

// 화면 표시용 스케일 (드래그/리사이즈가 자연스럽게 작동하도록 실제 크기 조정)
const DISPLAY_SCALE = 0.605;
const DISPLAY_WIDTH_PX = A4_WIDTH_PX * DISPLAY_SCALE; // 약 595px
const DISPLAY_HEIGHT_PX = A4_HEIGHT_PX * DISPLAY_SCALE; // 약 842px

/** PDF 출력 시 CORS 회피: 외부 이미지 src를 같은 오리진 프록시 URL로 치환 */
function rewriteContentImageSrcForExport(html: string): string {
  if (typeof window === "undefined") return html;
  return html.replace(/<img([^>]*?)src="([^"]+)"/gi, (_, attrs, src) => {
    try {
      const u = new URL(src, window.location.href);
      if (u.origin === window.location.origin) return `<img${attrs}src="${src}"`;
      return `<img${attrs}src="/api/image-proxy?url=${encodeURIComponent(src)}"`;
    } catch {
      return `<img${attrs}src="${src}"`;
    }
  });
}

export default function PdfClient() {
  const searchParams = useSearchParams();
  const modelIdx = searchParams.get("modelIdx") ? Number(searchParams.get("modelIdx")) : null;
  const [model, setModel] = useState<IModelDetail | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [pages, setPages] = useState<Array<{ id: string; content: string }>>([
    { id: "1", content: "" }
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pdfName, setPdfName] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const userData =
      typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") ?? "{}") : null;
    setUser(userData);
  }, []);

  // 모델 정보를 첫 페이지에 초기 콘텐츠로 추가
  useEffect(() => {
    if (!modelIdx || !user?.idx) return;
    const loadModel = async () => {
      try {
        const data = await fetchModelByIdx({ userIdx: Number(user.idx), modelIdx });
        setModel(data);
        if (data) {
          setPages([
            {
              id: "1",
              content: `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">${data.name}</h1>${
                data.description
                  ? `<p style="margin-bottom: 16px; line-height: 1.6;">${data.description}</p>`
                  : ""
              }${
                data.image
                  ? `<img src="${data.image}" alt="${data.name}" style="max-width: 100%; height: auto; margin: 16px 0;" />`
                  : ""
              }`
            }
          ]);
          // PDF 이름 기본값을 모델명으로 설정
          setPdfName(data.name || "");
        }
      } catch {
        setModel(null);
      }
    };

    loadModel();
  }, [modelIdx, user?.idx]);

  // TODO:a4 수정인데 (안에 변경되어야함)
  const handleContentChange = (content: string) => {
    setPages((prev) => {
      const next = [...prev];
      next[currentPageIndex] = { ...next[currentPageIndex], content };
      return next;
    });
  };

  const handleAddPage = () => {
    setPages((prev) => [...prev, { id: Date.now().toString(), content: "" }]);
    setCurrentPageIndex(pages.length);
  };
  const handleDeletePage = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 버튼 클릭 이벤트 전파 방지
    if (pages.length <= 1) {
      alert("최소 1개의 페이지가 필요합니다.");
      return;
    }
    setPages((prev) => prev.filter((_, index) => index !== indexToDelete));
    // 삭제된 페이지가 현재 페이지거나 그 이후 페이지면 인덱스 조정
    if (currentPageIndex >= indexToDelete) {
      setCurrentPageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleExportPDF = async () => {
    if (!editorRef.current) return;

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // 편집기와 동일한 스타일을 적용할 임시 컨테이너 (화면 밖에 배치)
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: ${DISPLAY_WIDTH_PX}px;
        min-height: ${DISPLAY_HEIGHT_PX}px;
        padding: ${50 * DISPLAY_SCALE}px;
        background-color: #ffffff;
        box-sizing: border-box;
      `;
      document.body.appendChild(container);

      try {
        for (let i = 0; i < pages.length; i++) {
          if (i > 0) pdf.addPage();

          const pageContent = rewriteContentImageSrcForExport(pages[i].content);
          const pageEl = document.createElement("div");
          pageEl.className = "outline-none min-h-full";
          pageEl.style.cssText =
            "fontSize: 14px; lineHeight: 1.6; color: #000000; min-height: 100%;";
          pageEl.innerHTML = pageContent;
          container.innerHTML = "";
          container.appendChild(pageEl);

          // 이미지 로드 대기 (해당 페이지 내 img가 있으면 로드 후 캡처)
          const imgs = pageEl.querySelectorAll("img");
          if (imgs.length > 0) {
            await Promise.all(
              Array.from(imgs).map(
                (img) =>
                  new Promise<void>((resolve) => {
                    if (img.complete) resolve();
                    else img.onload = () => resolve();
                    img.onerror = () => resolve();
                  })
              )
            );
          }

          const canvas = await html2canvas(pageEl, {
            scale: 2 / DISPLAY_SCALE,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff"
          });

          const imgData = canvas.toDataURL("image/png");
          const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;
          const finalHeight = imgHeight > A4_HEIGHT_MM ? A4_HEIGHT_MM : imgHeight;
          const finalWidth = (canvas.width * finalHeight) / canvas.height;

          pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);
        }
      } finally {
        container.remove();
      }

      // PDF 다운로드
      const fileName = pdfName
        ? `${pdfName}_${new Date().getTime()}.pdf`
        : model?.name
          ? `${model.name}_${new Date().getTime()}.pdf`
          : `document_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  const currentPage = pages[currentPageIndex];

  return (
    <div className="bg-[#FBFBFB] h-[calc(100vh-64px)] w-screen ">
      <div className="flex gap-2">
        {/* PDF 이름 입력 */}
        <div className="relative">
          <input
            type="text"
            id="pdf-name-input"
            value={pdfName}
            maxLength={20}
            onChange={(e) => setPdfName(e.target.value.slice(0, 20))}
            placeholder={model?.name || "문서 이름"}
            className="w-[170px] px-2 py-1.5 pr-[36px] text-[16px] rounded-lg font-semibold rounded focus:outline-none focus:bg-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
          <Image
            src="/icons/Edit.svg"
            alt="edit-icon"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            role="button"
            onClick={() => document.getElementById("pdf-name-input")?.focus()}
          />
        </div>
        <Button
          size="sm"
          onClick={handleExportPDF}
          className="bg-blue-500 text-white hover:bg-blue-600 "
        >
          PDF 출력
        </Button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="mt-3 grid grid-cols-[100px_3fr_auto] gap-4 ">
        {/* 페이지 목록 */}
        <div className="w-[fit-content]  pl-5 h-full overflow-y-auto">
          {pages.map((page, index) => (
            <div key={page.id} className="relative mb-2 overflow-show group">
              <button
                onClick={() => setCurrentPageIndex(index)}
                className={`w-13 h-16 border-1 shadow-xs ${
                  index === currentPageIndex
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                } flex items-center justify-center text-xs font-medium text-gray-600 relative`}
              >
                {index + 1}
              </button>
              <button
                onClick={(e) => handleDeletePage(index, e)}
                className="absolute top-1 right-1 w-3.5 h-3.5 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 hidden group-hover:flex"
                aria-label="페이지 삭제"
                title="페이지 삭제"
              >
                <XIcon className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddPage}
            className="w-13 h-16 border border-dashed border-gray-300  hover:border-gray-400 flex items-center justify-center text-gray-400 hover:text-gray-600"
            aria-label="페이지 추가"
          >
            +
          </button>
        </div>

        {/* a4 미리보기 */}
        <div className="flex flex-col gap-3 justify-center items-center">
          <div
            ref={editorRef}
            className="bg-white shadow-lg relative"
            style={{
              width: `${DISPLAY_WIDTH_PX}px`,
              minHeight: `${DISPLAY_HEIGHT_PX}px`,
              padding: `${50 * DISPLAY_SCALE}px`,
              paddingTop: `${110 * DISPLAY_SCALE}px`
            }}
          >
            <div
              id={`page-editor-${currentPageIndex}`}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: currentPage.content }}
              className="outline-none min-h-full"
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#000000"
              }}
            />
            <TopToolbar className="absolute top-2 left-[30px] scale-75" />
            <BottomToolbar className="absolute bottom-2 scale-75 left-1/2 -translate-x-1/2" />
            <div className="text-sm text-gray-500 relative top-[36px] right-[20px]">
              {currentPageIndex + 1} / {pages.length}
            </div>
          </div>
        </div>

        {/* 오른쪽 ai 및 메모장 내용 */}
        <RightPannelInPdf />
      </div>
    </div>
  );
}
