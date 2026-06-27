import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "@voila/ui/label";
import { Switch } from "@voila/ui/switch";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
