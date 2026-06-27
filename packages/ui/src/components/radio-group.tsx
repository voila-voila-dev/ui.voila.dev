import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { CircleIcon } from "@phosphor-icons/react";
import { cn } from "#lib/cn";

function Root({ className, ...props }: BaseRadioGroup.Props) {
  return (
    <BaseRadioGroup data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />
  );
}

function Item({ className, ...props }: Radio.Root.Props) {
  return (
    <Radio.Root
      data-slot="radio-group-item"
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Radio.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <CircleIcon className="h-3.5 w-3.5" weight="fill" />
      </Radio.Indicator>
    </Radio.Root>
  );
}

export const RadioGroup = { Root, Item };
