import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@voila/ui/button";
import { Tooltip } from "@voila/ui/tooltip";

const meta: Meta = {
  title: "Primitives/Tooltip",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button variant="outline">Hover me</Button>} />
        <Tooltip.Content>Add to library</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};
