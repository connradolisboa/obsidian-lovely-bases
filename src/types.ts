import type { BasesQueryResult, BasesViewConfig, BasesViewFactory } from "obsidian";

import type { ViewOption } from "@/lib/view-option-types";

export type EntryClickEventHandler = (entryId: string, event: React.MouseEvent | React.KeyboardEvent) => void;
export type EntryHoverEventHandler = (entryId: string, linkRef: React.RefObject<HTMLAnchorElement>, event: React.MouseEvent | React.KeyboardEvent) => void;

export type ReactBaseViewProps = {
  config: BasesViewConfig;
  data: BasesQueryResult;
  isEmbedded: boolean;
  onEntryClick: EntryClickEventHandler;
  onEntryHover: EntryHoverEventHandler;
}

export type BaseViewDef = {
  id: string;
  name: string;
  icon: string;
  factory: BasesViewFactory;
  options: () => ViewOption[];
}
