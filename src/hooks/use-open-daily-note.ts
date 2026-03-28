import moment from "moment";
import { Keymap } from "obsidian";
import { useCallback } from "react";

import { useObsidian } from "@/components/Obsidian/Context";

export const useOpenDailyNote = () => {
	const { app } = useObsidian();

	return useCallback(
		(date: Date, event?: React.MouseEvent | React.KeyboardEvent) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const dailyPlugin = (app as any).internalPlugins?.getPluginById(
				"daily-notes",
			);
			const options = dailyPlugin?.instance?.options ?? {};
			const format: string = options.format ?? "YYYY-MM-DD";
			const folder: string = options.folder ?? "";

			const dateStr = moment(date).format(format);
			const linkText = folder ? `${folder}/${dateStr}` : dateStr;

			const modEvent = event
				? Keymap.isModEvent(event.nativeEvent as MouseEvent | KeyboardEvent)
				: false;

			void app.workspace.openLinkText(linkText, "", modEvent);
		},
		[app],
	);
};
