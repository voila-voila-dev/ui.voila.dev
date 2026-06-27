import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "#lib/cn";

export function Slider({ className, ...props }: BaseSlider.Root.Props) {
  return (
    <BaseSlider.Root
      data-slot="slider"
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <BaseSlider.Control
        data-slot="slider-control"
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
      >
        <BaseSlider.Track data-slot="slider-track" className="absolute inset-0">
          <BaseSlider.Indicator data-slot="slider-range" className="absolute h-full bg-primary" />
        </BaseSlider.Track>
      </BaseSlider.Control>
      <BaseSlider.Thumb
        data-slot="slider-thumb"
        className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      />
    </BaseSlider.Root>
  );
}
