"use client";
import { FileDown, FileText } from "lucide-react";
import { exportCSV, exportPDF } from "@/lib/export";

interface ExportBarProps {
  title: string;
  csvData?: { filename: string; headers: string[]; rows: string[][] };
  pdfElementId?: string;
}

export function ExportBar({ title, csvData, pdfElementId }: ExportBarProps) {
  return (
    <div className="flex items-center gap-2">
      {csvData && (
        <button
          onClick={() => exportCSV(csvData.filename, csvData.headers, csvData.rows)}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/40 border border-zinc-700/30 px-2.5 py-1.5 text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
        >
          <FileDown className="h-3 w-3" />
          CSV
        </button>
      )}
      <button
        onClick={() => exportPDF(title, pdfElementId)}
        className="flex items-center gap-1.5 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/40 border border-zinc-700/30 px-2.5 py-1.5 text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
      >
        <FileText className="h-3 w-3" />
        PDF
      </button>
    </div>
  );
}
