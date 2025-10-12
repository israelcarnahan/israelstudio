"use client";

import NextLink, { LinkProps } from "next/link";
import { MouseEvent } from "react";
import { triggerPageSplashFromEvent } from "./PageSplashTransition";

type Props = React.PropsWithChildren<
  LinkProps & React.HTMLAttributes<HTMLAnchorElement>
>;

export default function SplashLink({ onClick, ...props }: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Only internal left-clicks without modifier keys
    if (
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      typeof props.href === "string" &&
      props.href.startsWith("/")
    ) {
      triggerPageSplashFromEvent(e);
    }
    onClick?.(e);
  };

  return <NextLink {...props} onClick={handleClick} />;
}
