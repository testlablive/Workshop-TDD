import { PlanningCard } from "../../src/components/PlanningCard";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta = {
  title: "components/PlanningCard",
  component: PlanningCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn(), selected: false, value: "1" },
} satisfies Meta<typeof PlanningCard>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {},
};
