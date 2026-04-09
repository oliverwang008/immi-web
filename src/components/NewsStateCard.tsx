"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Calendar, AlertCircle } from "lucide-react";
import clsx from "clsx";
import type { StateNewsGroup } from "@/lib/immigration-news";

interface Props {
  group: StateNewsGroup;
  defaultOpen?: boolean;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function NewsStateCard({ group, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const hasItems = group.items.length > 0;

  return (
    <div
      className={clsx(
        "glass-card overflow-hidden transition-all duration-200",
        open && "border-[rgba(255,210,0,0.2)]"
      )}
    >
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[rgba(0,43,110,0.3)] transition-colors text-left"
        aria-expanded={open}
      >
        {/* State badge */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
          style={{ background: group.stateColor }}
        >
          {group.state}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F0F4FF]">{group.stateName}</span>
            {!hasItems && !group.error && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(0,61,165,0.2)] text-[#3D6080] border border-[rgba(0,61,165,0.3)]">
                No recent updates
              </span>
            )}
            {group.error && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(200,16,46,0.1)] text-[#C8102E] border border-[rgba(200,16,46,0.2)]">
                Unavailable
              </span>
            )}
            {hasItems && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(0,166,81,0.1)] text-[#00A651] border border-[rgba(0,166,81,0.2)]">
                {group.items.length} update{group.items.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#3D6080] mt-0.5">
            {group.error
              ? "Could not load — source temporarily unavailable"
              : hasItems
              ? group.items[0].title
              : "No immigration news found at this time"}
          </div>
        </div>

        <ChevronDown
          size={16}
          className={clsx(
            "flex-shrink-0 text-[#3D6080] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-[rgba(0,61,165,0.3)] px-5 py-4">
          {group.error ? (
            <div className="flex items-start gap-3 py-2 text-[#3D6080]">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-[#C8102E]/60" />
              <div>
                <p className="text-sm text-[#8BB8DC]/70">Unable to load news from this source.</p>
                <a
                  href={group.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#3D6080] hover:text-[#FFD200] transition-colors"
                >
                  <ExternalLink size={11} />
                  Visit official website directly
                </a>
              </div>
            </div>
          ) : !hasItems ? (
            <div className="py-2 text-sm text-[#3D6080]">
              No immigration-related updates found at this time.{" "}
              <a
                href={group.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#3D6080] hover:text-[#FFD200] transition-colors"
              >
                Visit site <ExternalLink size={11} />
              </a>
            </div>
          ) : (
            <ul className="space-y-4">
              {group.items.map((item) => (
                <li key={item.id} className="group/item">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl p-3 -mx-1 hover:bg-[rgba(0,43,110,0.4)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-[#F0F4FF] group-hover/item:text-[#FFD200] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <ExternalLink
                        size={12}
                        className="flex-shrink-0 mt-0.5 text-[#3D6080] group-hover/item:text-[#FFD200] transition-colors"
                      />
                    </div>
                    {item.date && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Calendar size={11} className="text-[#3D6080]" />
                        <span className="text-[11px] text-[#3D6080]">{formatDate(item.date)}</span>
                      </div>
                    )}
                    {item.summary && item.summary !== "Click to read more." && (
                      <p className="text-xs text-[#8BB8DC]/70 mt-1.5 leading-relaxed line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* View all link */}
          <div className="mt-4 pt-3 border-t border-[rgba(0,61,165,0.2)]">
            <a
              href={group.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-[#3D6080] hover:text-[#FFD200] transition-colors font-medium"
            >
              <ExternalLink size={11} />
              View all updates on the official {group.state} immigration website
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
