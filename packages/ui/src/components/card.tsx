import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#lib/cn";

function Root({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className) },
      props,
    ),
    render,
    state: { slot: "card" },
  });
}

function Header({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ className: cn("flex flex-col space-y-1.5 p-6", className) }, props),
    render,
    state: { slot: "card-header" },
  });
}

function HeaderTitle({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cn("font-semibold leading-none tracking-tight", className) },
      props,
    ),
    render,
    state: { slot: "card-title" },
  });
}

function HeaderDescription({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ className: cn("text-sm text-muted-foreground", className) }, props),
    render,
    state: { slot: "card-description" },
  });
}

function Content({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ className: cn("p-6 pt-0", className) }, props),
    render,
    state: { slot: "card-content" },
  });
}

function Footer({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ className: cn("flex items-center p-6 pt-0", className) }, props),
    render,
    state: { slot: "card-footer" },
  });
}

export const Card = {
  Root,
  Header: {
    Root: Header,
    Title: HeaderTitle,
    Description: HeaderDescription,
  },
  Content,
  Footer,
};
