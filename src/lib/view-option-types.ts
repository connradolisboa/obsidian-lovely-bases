import type { BasesViewConfig } from "obsidian";

type ShouldHide = (config: BasesViewConfig) => boolean;

export type GroupOption = {
	type: "group";
	displayName: string;
	items: ViewOption[];
	shouldHide?: ShouldHide;
};

export type SliderOption = {
	type: "slider";
	displayName: string;
	key: string;
	default?: number;
	min: number;
	max: number;
	step: number;
	shouldHide?: ShouldHide;
};

export type DropdownOption = {
	type: "dropdown";
	displayName: string;
	key: string;
	default?: string;
	options: Record<string, string>;
	shouldHide?: ShouldHide;
};

export type ToggleOption = {
	type: "toggle";
	displayName: string;
	key: string;
	default?: boolean;
	shouldHide?: ShouldHide;
};

export type TextOption = {
	type: "text";
	displayName: string;
	key: string;
	default?: string;
	placeholder?: string;
	shouldHide?: ShouldHide;
};

export type PropertyOption = {
	type: "property";
	displayName: string;
	key: string;
	default?: string;
	shouldHide?: ShouldHide;
};

export type ViewOption =
	| GroupOption
	| SliderOption
	| DropdownOption
	| ToggleOption
	| TextOption
	| PropertyOption;
