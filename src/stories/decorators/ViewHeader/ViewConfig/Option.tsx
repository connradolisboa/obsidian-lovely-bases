import type { Args } from "@storybook/react-vite";
import type { BasesViewConfig } from "obsidian";

import type { ViewOption } from "@/lib/view-option-types";


import Dropdown from "./Dropdown";
import Group from "./Group";
import Slider from "./Slider";
import Text from "./Text";
import Toggle from "./Toggle";

type Props = {
  args: Args;
  config: BasesViewConfig;
  option: ViewOption;
  updateArgs: (newArgs: Args) => void
}

const Option = ({
  args,
  config,
  option,
  updateArgs
 }: Props) => {
  if (option.shouldHide?.(config)) return null;

  if (option.type === 'group') {
    return (
      <Group group={option}>
        {option.items.map(
          (groupItem, idx) => (
            <Option args={args}
              config={config}
              key={'key' in groupItem ? groupItem.key : idx}
              option={groupItem}
              updateArgs={updateArgs} />
          )
        )}
      </Group>
    )
  }

  if (option.type === 'slider') {
    return (
      <Slider
        key={option.key}
        option={option}
        value={args[option.key]}
        onChange={(val) => updateArgs({ [option.key]: val })}
      />
    );
  }

  if (option.type === 'dropdown') {
    return (
      <Dropdown
        key={option.key}
        option={option}
        value={args[option.key]}
        onChange={(val) => updateArgs({ [option.key]: val })}
      />
    );
  }

  if (option.type === 'toggle') {
    return (
      <Toggle
        key={option.key}
        option={option}
        value={args[option.key]}
        onChange={(val) => updateArgs({ [option.key]: val })}
      />
    );
  }

  if (option.type === 'text' || option.type === 'property') {
    return (
      <Text
        key={option.key}
        option={option}
        value={args[option.key]}
        onChange={(val) => updateArgs({ [option.key]: val })}
      />
    );
  }

  return null;
}

export default Option;
