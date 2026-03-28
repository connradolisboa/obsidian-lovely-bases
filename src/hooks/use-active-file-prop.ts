import type { App } from "obsidian";
import { useCallback, useEffect, useState } from "react";

import { useObsidian } from "@/components/Obsidian/Context";

const resolveFileProp = (app: App, raw: string): string | undefined => {
	if (!raw.startsWith("this.")) return raw;
	const propName = raw.slice(5);
	const activeFile = app.workspace.getActiveFile();
	if (!activeFile) return undefined;
	const frontmatter = app.metadataCache.getFileCache(activeFile)?.frontmatter;
	const value = frontmatter?.[propName];
	return value != null ? String(value) : undefined;
};

/**
 * Resolves a config value that may reference the active note's frontmatter.
 *
 * If the value starts with `"this."`, the remainder is treated as a frontmatter
 * property name on the currently active file. The resolved value updates
 * reactively whenever the active file or its metadata changes.
 *
 * @example
 * // In view settings, user types: this.journal-start-date
 * // Returns the journal-start-date frontmatter value of the active note.
 */
export const useActiveFileProp = (raw: string | undefined): string | undefined => {
	const { app } = useObsidian();

	const compute = useCallback(
		(): string | undefined => (raw != null ? resolveFileProp(app, raw) : undefined),
		[raw, app],
	);

	const [value, setValue] = useState<string | undefined>(compute);

	useEffect(() => {
		setValue(compute());
		if (!raw?.startsWith("this.")) return;

		const update = () => setValue(compute());
		app.workspace.on("active-leaf-change", update);
		app.metadataCache.on("changed", update);
		return () => {
			app.workspace.off("active-leaf-change", update);
			app.metadataCache.off("changed", update);
		};
	}, [compute, raw, app]);

	return value;
};
