import { PlanningCard } from "../../src/components/PlanningCard";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";

let selected = false;
const meta = {
  title: "components/PlanningCard",
  component: PlanningCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn(), selected: selected, value: "1" },
} satisfies Meta<typeof PlanningCard>;

export default meta;

type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    onClick: fn(() => {
      selected = true;
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId("planning-card");
    await userEvent.click(card);
    expect(selected).toBe(true);
  },
};
