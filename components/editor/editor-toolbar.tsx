"use client";

import { useEffect, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  ChevronDown,
  Download,
  Eraser,
  Highlighter,
  Image as ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  MoreVertical,
  PaintBucket,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Printer,
  Redo2,
  Sigma,
  SquarePen,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  Underline,
  FlaskConical,
  Undo2,
} from "lucide-react";
import { FORMAT_LABELS, FONT_OPTIONS } from "@/lib/editor-model";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/ui/dropdown";
import { ScrollHint } from "./scroll-hint";

const toolBtn =
  "flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-1.5 text-[12.5px] text-ink-2 outline-none transition-colors hover:bg-surface-3 hover:text-ink disabled:opacity-40 [&_svg]:size-[17px]";

function Sep() {
  return (
    <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-line" />
  );
}

function ToolButton({
  label,
  onClick,
  children,
  className,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(toolBtn, className)}
    >
      {children}
    </button>
  );
}

function normalizeLegacyFontNodes(surface: HTMLElement | null) {
  if (!surface) return;
  const FONT_SIZE_PX: Record<string, string> = {
    '1': '10px',
    '2': '12px',
    '3': '14px',
    '4': '15.33px',
    '5': '18px',
    '6': '24px',
    '7': '32px',
  };
  for (const fontEl of Array.from(surface.querySelectorAll('font'))) {
    const span = document.createElement('span');
    const color = fontEl.getAttribute('color');
    const face = fontEl.getAttribute('face');
    const size = fontEl.getAttribute('size');
    if (color) span.style.color = color;
    if (face) span.style.fontFamily = face;
    if (size && FONT_SIZE_PX[size]) span.style.fontSize = FONT_SIZE_PX[size];
    while (fontEl.firstChild) span.appendChild(fontEl.firstChild);
    fontEl.replaceWith(span);
  }
}

function activeTableCell(): { cell: HTMLTableCellElement; row: HTMLTableRowElement; table: HTMLTableElement } | null {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return null;
  let node: Node | null = sel.getRangeAt(0).startContainer;
  while (node && node.nodeType !== Node.ELEMENT_NODE) node = node.parentNode;
  const el = node as HTMLElement | null;
  const cell = el?.closest?.('td, th') as HTMLTableCellElement | null;
  const row = cell?.closest?.('tr') as HTMLTableRowElement | null;
  const table = row?.closest?.('table') as HTMLTableElement | null;
  return cell && row && table ? { cell, row, table } : null;
}

function mutateActiveTable(op: 'add-row' | 'del-row' | 'add-col' | 'del-col') {
  const ctx = activeTableCell();
  if (!ctx) return;
  const { cell, row, table } = ctx;
  const colIndex = cell.cellIndex;
  const surface = document.getElementById('doc-surface');
  if (op === 'add-row') {
    const nextRow = table.insertRow(row.rowIndex + 1);
    for (let i = 0; i < row.cells.length; i += 1) {
      const td = nextRow.insertCell();
      td.innerHTML = '&nbsp;';
    }
  } else if (op === 'del-row') {
    if (table.rows.length > 1) table.deleteRow(row.rowIndex);
    else table.remove();
  } else if (op === 'add-col') {
    for (const r of Array.from(table.rows)) {
      const td = r.insertCell(Math.min(colIndex + 1, r.cells.length));
      td.innerHTML = '&nbsp;';
    }
  } else if (op === 'del-col') {
    if (row.cells.length <= 1) table.remove();
    else {
      for (const r of Array.from(table.rows)) {
        if (colIndex < r.cells.length) r.deleteCell(colIndex);
      }
    }
  }
  surface?.dispatchEvent(new Event('input', { bubbles: true }));
}

export function EditorToolbar({
  zoom,
  onZoom,
  outlineOpen,
  onToggleOutline,
  aiOpen,
  onToggleAi,
  onInsert,
  onPageBreak,
  onOpenFigure,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
  onInsertMath,
  onUploadImage,
  onOpenBank,
}: {
  zoom: number;
  onZoom: (z: number) => void;
  outlineOpen: boolean;
  onToggleOutline: () => void;
  aiOpen: boolean;
  onToggleAi: () => void;
  onInsert: (snippet: string) => void;
  onPageBreak: () => void;
  onOpenFigure: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onInsertMath?: () => void;
  onUploadImage?: () => void;
  onOpenBank?: () => void;
}) {
  const [size, setSize] = useState(15);
  const [font, setFont] = useState<string>("Times New Roman");
  const [format, setFormat] = useState<string>("Văn bản thường");

  const exec = (cmd: string, value?: string) => {
    const surface = document.getElementById("doc-surface");
    surface?.focus();
    document.execCommand(cmd, false, value);
    normalizeLegacyFontNodes(surface);
    surface?.dispatchEvent(new Event("input", { bubbles: true }));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "p") {
        e.preventDefault();
        window.print();
        return;
      }
      const surface = document.getElementById("doc-surface");
      if (!surface || !surface.contains(e.target as Node)) return;
      if (k === "b") {
        e.preventDefault();
        exec("bold");
      } else if (k === "i") {
        e.preventDefault();
        exec("italic");
      } else if (k === "u") {
        e.preventDefault();
        exec("underline");
      } else if (k === "z" && !e.shiftKey) {
        if (onUndo) {
          e.preventDefault();
          onUndo();
        }
      } else if (k === "y" || (k === "z" && e.shiftKey)) {
        if (onRedo) {
          e.preventDefault();
          onRedo();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        onPageBreak();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPageBreak, onUndo, onRedo]);

  return (
    <div
      role="toolbar"
      aria-label="Công cụ soạn thảo"
      aria-orientation="horizontal"
      className="no-print relative z-30 flex h-11 shrink-0 items-center gap-1 border-b border-line bg-surface px-2"
    >
      <ScrollHint className="flex h-full min-w-0 flex-1 basis-0 flex-nowrap items-center">
        <div className="scrollbar-none flex h-full min-w-0 flex-1 flex-nowrap items-center overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden">
          <div className="flex w-[max-content] shrink-0 flex-nowrap items-center gap-x-0.5">
            <ToolButton label="Hoàn tác (Ctrl+Z)" disabled={!canUndo} onClick={() => (onUndo ? onUndo() : exec("undo"))}>
              <Undo2 />
            </ToolButton>
            <ToolButton label="Làm lại (Ctrl+Y)" disabled={!canRedo} onClick={() => (onRedo ? onRedo() : exec("redo"))}>
              <Redo2 />
            </ToolButton>
            <ToolButton label="In (Ctrl+P)" onClick={() => window.print()}>
              <Printer />
            </ToolButton>

            <Dropdown
              align="start"
              className="w-[120px]"
              trigger={({ toggle }) => (
                <button
                  type="button"
                  aria-label="Thu phóng"
                  onClick={toggle}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[13px] text-ink-2 hover:bg-black/[0.06]"
                >
                  {zoom}%
                  <ChevronDown className="size-3.5 opacity-60" aria-hidden />
                </button>
              )}
            >
              {(close) => (
                <div>
                  {[50, 75, 90, 100, 125, 150, 200].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => {
                        onZoom(z);
                        close();
                      }}
                      className={cn(
                        "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[13.5px] hover:bg-surface-3",
                        z === zoom ? "font-semibold" : "",
                      )}
                    >
                      {z}%
                    </button>
                  ))}
                </div>
              )}
            </Dropdown>

            <MenuButton
              label="Kiểu đoạn"
              value={format}
              items={FORMAT_LABELS.map((label) => ({
                label,
                run: () => {
                  setFormat(label);
                  const tag = label.endsWith("1")
                    ? "H1"
                    : label.endsWith("2")
                      ? "H2"
                      : label.endsWith("3")
                        ? "H3"
                        : "P";
                  exec("formatBlock", `<${tag}>`);
                },
              }))}
            />

            <MenuButton
              label="Phông chữ"
              value={font}
              items={FONT_OPTIONS.map((f) => ({
                label: f,
                style: { fontFamily: f },
                run: () => {
                  setFont(f);
                  exec("fontName", f);
                },
              }))}
            />

            <Sep />

            <ToolButton
              label="Giảm cỡ chữ"
              onClick={() => {
                const next = Math.max(8, size - 1);
                setSize(next);
                exec("fontSize", String(sizeToLegacy(next)));
              }}
            >
              <Minus />
            </ToolButton>
            <div className="flex h-7 w-9 shrink-0 items-center justify-center rounded-sm bg-surface-3 text-[12.5px] font-medium text-ink-2">
              {size}
            </div>
            <ToolButton
              label="Tăng cỡ chữ"
              onClick={() => {
                const next = Math.min(72, size + 1);
                setSize(next);
                exec("fontSize", String(sizeToLegacy(next)));
              }}
            >
              <Plus />
            </ToolButton>

            <Sep />

            <ToolButton label="Đậm (Ctrl+B)" onClick={() => exec("bold")}>
              <Bold />
            </ToolButton>
            <ToolButton label="Nghiêng (Ctrl+I)" onClick={() => exec("italic")}>
              <Italic />
            </ToolButton>
            <ToolButton
              label="Gạch chân (Ctrl+U)"
              onClick={() => exec("underline")}
            >
              <Underline />
            </ToolButton>
            <ToolButton
              label="Căn trái"
              onClick={() => exec("justifyLeft")}
            >
              <AlignLeft />
            </ToolButton>
            <ToolButton
              label="Công thức toán"
              onClick={() => (onInsertMath ? onInsertMath() : onInsert('$x^{2}$'))}
            >
              <Sigma />
            </ToolButton>
            <ToolButton
              label="Công thức hoá học"
              onClick={() => onInsert("H<sub>2</sub>O")}
            >
              <FlaskConical />
            </ToolButton>
            {onOpenBank ? (
              <ToolButton label="Chèn câu từ kho" onClick={onOpenBank} className="px-2">
                <Plus />
                <span className="hidden md:inline">Kho câu hỏi</span>
              </ToolButton>
            ) : null}

            <InsertMenu
              onInsert={onInsert}
              exec={exec}
              onPageBreak={onPageBreak}
              onOpenFigure={onOpenFigure}
              onUploadImage={onUploadImage}
            />
          </div>
        </div>
      </ScrollHint>

      {/* Only the reopeners live here. While a pane is open its own header
          chevron closes it, so showing both would put two controls for the same
          pane a few pixels apart. */}
      <div className="ml-2 flex shrink-0 flex-nowrap items-center justify-end gap-1">
        {!outlineOpen ? (
          <ToolButton label="Hiện dàn ý và mẫu chèn" onClick={onToggleOutline}>
            <ChevronsRight />
          </ToolButton>
        ) : null}
        {!aiOpen ? (
          <ToolButton label="Hiện trợ lý AI" onClick={onToggleAi}>
            <ChevronsLeft />
          </ToolButton>
        ) : null}
      </div>
    </div>
  );
}

/* Colours written into the document itself (not the interface): they must stay
   literal so the exported file keeps them. */
const DOC_RED = '#c4342d';
const DOC_HIGHLIGHT = '#fdecc8';
const DOC_GREY = '#f1eef7';

function MenuButton({
  label,
  value,
  items,
}: {
  label: string;
  value: string;
  items: Array<{ label: string; run: () => void; style?: React.CSSProperties }>;
}) {
  return (
    <Dropdown
      align="start"
      className="min-w-[180px]"
      trigger={({ toggle }) => (
        <button
          type="button"
          aria-label={label}
          onClick={toggle}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-[13px] text-ink-2 hover:bg-surface-3 hover:text-ink"
        >
          <span className="max-w-[116px] truncate">{value}</span>
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </button>
      )}
    >
      {(close) => (
        <div>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              style={item.style}
              onClick={() => {
                item.run();
                close();
              }}
              className="flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[13.5px] hover:bg-surface-3"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}

function InsertMenu({
  onInsert,
  exec,
  onPageBreak,
  onOpenFigure,
  onUploadImage,
}: {
  onInsert: (snippet: string) => void;
  exec: (cmd: string, value?: string) => void;
  onPageBreak: () => void;
  onOpenFigure: () => void;
  onUploadImage?: () => void;
}) {
  const items = [
    { label: "Chỉ số trên", icon: Superscript, run: () => exec("superscript") },
    { label: "Chỉ số dưới", icon: Subscript, run: () => exec("subscript") },
    {
      label: "Gạch ngang",
      icon: Strikethrough,
      run: () => exec("strikeThrough"),
    },
    { label: "Xoá định dạng", icon: Eraser, run: () => exec("removeFormat") },
    {
      label: "Danh sách đánh số",
      icon: ListOrdered,
      run: () => exec("insertOrderedList"),
    },
    {
      label: "Danh sách dấu đầu dòng",
      icon: List,
      run: () => exec("insertUnorderedList"),
    },
    { label: "Giảm thụt lề", icon: IndentDecrease, run: () => exec("outdent") },
    { label: "Tăng thụt lề", icon: IndentIncrease, run: () => exec("indent") },
    { label: "Căn trái", icon: AlignLeft, run: () => exec("justifyLeft") },
    { label: "Căn giữa", icon: AlignCenter, run: () => exec("justifyCenter") },
    { label: "Căn phải", icon: AlignRight, run: () => exec("justifyRight") },
    {
      label: "Căn đều hai bên",
      icon: AlignJustify,
      run: () => exec("justifyFull"),
    },
    {
      label: "Màu chữ",
      icon: Baseline,
      run: () => exec("foreColor", DOC_RED),
    },
    {
      label: "Màu nền chữ",
      icon: Highlighter,
      run: () => exec("hiliteColor", DOC_HIGHLIGHT),
    },
    {
      label: "Màu nền đoạn",
      icon: PaintBucket,
      run: () => exec("hiliteColor", DOC_GREY),
    },
    {
      label: "Chữ đóng khung",
      icon: SquarePen,
      run: () => onInsert('<span class="doc-boxed">Đề chính thức</span>'),
    },
    {
      label: "Chèn bảng",
      icon: Table,
      run: () =>
        onInsert(
          "<table><tbody><tr><td>Ô 1</td><td>Ô 2</td></tr><tr><td></td><td></td></tr></tbody></table><p><br></p>",
        ),
    },
    {
      label: "Vẽ hình toán",
      icon: ImageIcon,
      run: onOpenFigure,
    },
    ...(onUploadImage
      ? [
          {
            label: "Tải ảnh từ máy",
            icon: Download,
            run: onUploadImage,
          },
        ]
      : []),
    {
      label: "Xoá định dạng khối",
      icon: Link2,
      run: () => exec("formatBlock", "<p>"),
    },
    { label: "Ngắt trang", icon: Minus, run: onPageBreak },
  ];
  return (
    <Dropdown
      align="end"
      className="w-[260px]"
      trigger={({ toggle }) => (
        <button
          type="button"
          aria-label="Thêm công cụ"
          title="Thêm công cụ"
          onClick={toggle}
          className={toolBtn}
        >
          <MoreVertical />
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="grid grid-cols-4 gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => {
                    item.run();
                    close();
                  }}
                  className="flex size-9 items-center justify-center rounded-md text-ink-2 hover:bg-surface-3 [&_svg]:size-[17px]"
                >
                  <Icon />
                </button>
              );
            })}
          </div>
          <div className="mt-2 border-t border-line pt-1.5">
            <p className="px-1 pb-1 text-[10.5px] font-semibold tracking-wide text-ink-4 uppercase">
              Bảng (tại vị trí con trỏ)
            </p>
            <div className="grid grid-cols-2 gap-1 text-[12px]">
              <button type="button" onClick={() => { mutateActiveTable('add-row'); close(); }} className="rounded-sm px-2 py-1 text-left text-ink-2 hover:bg-surface-3">+ Thêm dòng</button>
              <button type="button" onClick={() => { mutateActiveTable('add-col'); close(); }} className="rounded-sm px-2 py-1 text-left text-ink-2 hover:bg-surface-3">+ Thêm cột</button>
              <button type="button" onClick={() => { mutateActiveTable('del-row'); close(); }} className="rounded-sm px-2 py-1 text-left text-danger hover:bg-danger-soft">- Xoá dòng</button>
              <button type="button" onClick={() => { mutateActiveTable('del-col'); close(); }} className="rounded-sm px-2 py-1 text-left text-danger hover:bg-danger-soft">- Xoá cột</button>
            </div>
          </div>
        </div>
      )}
    </Dropdown>
  );
}

function sizeToLegacy(px: number) {
  if (px <= 10) return 1;
  if (px <= 12) return 2;
  if (px <= 14) return 3;
  if (px <= 17) return 4;
  if (px <= 20) return 5;
  if (px <= 24) return 6;
  return 7;
}
