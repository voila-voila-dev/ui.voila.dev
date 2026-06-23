import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextBolderIcon } from "@voila/ui/icons";
import { Toggle } from "@voila/ui/toggle";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <TextBolderIcon />
    </Toggle>
  ),
};

export const Outline: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold" variant="outline">
      <TextBolderIcon /> Bold
    </Toggle>
  ),
};
