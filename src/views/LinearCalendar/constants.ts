import type { ViewOption } from "@/lib/view-option-types";
import type { LinearCalendarConfig } from "@/components/LinearCalendar/types";
import { detectLocale, type NamespacedTranslationKey, translate } from "@/lib/i18n";

const locale = detectLocale();
const t = (key: NamespacedTranslationKey<'linearCalendar'>) => translate(locale, 'linearCalendar', key);

export const DEFAULTS: LinearCalendarConfig = {
  /* Data */
  startDateProperty: undefined,
  endDateProperty: undefined,
  titleProperty: undefined,
  /* Date Range */
  date: undefined,
  focus: "full",
  /* Appearance */
  layout: "vertical",
  colorProperty: undefined,
  iconProperty: undefined,
  /* Properties */
  propertiesLayout: "vertical",
  propertiesShowNames: true,
  ganttTitleSize: 12,
  ganttPropertiesSize: 9,
};

export const LINEAR_CALENDAR_OPTIONS: ViewOption[] = [
  {
    type: "group",
    displayName: t("options.data.title"),
    items: [
      {
        type: "property",
        displayName: t("options.data.startDateProperty.title"),
        key: "startDateProperty",
        default: DEFAULTS.startDateProperty,
      },
      {
        type: "property",
        displayName: t("options.data.endDateProperty.title"),
        key: "endDateProperty",
        default: DEFAULTS.endDateProperty,
      },
      {
        type: "property",
        displayName: t("options.data.titleProperty.title"),
        key: "titleProperty",
        default: DEFAULTS.titleProperty,
      },
    ],
  },
  {
    type: "group",
    displayName: t("options.dateRange.title"),
    items: [
      {
        type: "text",
        displayName: t("options.dateRange.referenceDate.title"),
        key: "date",
        default: DEFAULTS.date,
        placeholder: t("options.dateRange.referenceDate.placeholder"),
      },
      {
        type: "dropdown",
        displayName: t("options.dateRange.focus.title"),
        key: "focus",
        default: DEFAULTS.focus,
        options: {
          full: t("options.dateRange.focus.full"),
          half: t("options.dateRange.focus.half"),
          quarter: t("options.dateRange.focus.quarter"),
        },
      },
    ],
  },
  {
    type: "group",
    displayName: t("options.appearance.title"),
    items: [
      {
        type: "dropdown",
        displayName: t("options.appearance.layout.title"),
        key: "layout",
        default: DEFAULTS.layout,
        options: {
          vertical: t("options.appearance.layout.vertical"),
          horizontal: t("options.appearance.layout.horizontal"),
        },
      },
      {
        type: "property",
        displayName: t("options.appearance.colorProperty.title"),
        key: "colorProperty",
        default: DEFAULTS.colorProperty,
      },
      {
        type: "property",
        displayName: t("options.appearance.iconProperty.title"),
        key: "iconProperty",
        default: DEFAULTS.iconProperty,
      },
      {
        type: "dropdown",
        displayName: t("options.appearance.propertiesLayout.title"),
        key: "propertiesLayout",
        default: DEFAULTS.propertiesLayout,
        options: {
          vertical: t("options.appearance.propertiesLayout.vertical"),
          horizontal: t("options.appearance.propertiesLayout.horizontal"),
        },
      },
      {
        type: "toggle",
        displayName: t("options.appearance.propertiesShowNames.title"),
        key: "propertiesShowNames",
        default: DEFAULTS.propertiesShowNames,
      },
      {
        type: "slider",
        displayName: t("options.appearance.ganttTitleSize.title"),
        key: "ganttTitleSize",
        default: DEFAULTS.ganttTitleSize,
        min: 8,
        max: 24,
        step: 1,
        shouldHide: (config) => config.get("layout") !== "horizontal",
      },
      {
        type: "slider",
        displayName: t("options.appearance.ganttPropertiesSize.title"),
        key: "ganttPropertiesSize",
        default: DEFAULTS.ganttPropertiesSize,
        min: 7,
        max: 20,
        step: 1,
        shouldHide: (config) => config.get("layout") !== "horizontal",
      },
    ],
  },
];
