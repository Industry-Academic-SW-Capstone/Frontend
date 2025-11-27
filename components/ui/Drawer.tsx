"use client";

import { Drawer as VaulDrawer } from "vaul";
import * as React from "react";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Root>) => (
  <VaulDrawer.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = VaulDrawer.Trigger;

const DrawerPortal = VaulDrawer.Portal;

const DrawerClose = VaulDrawer.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Overlay>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/60 ${className}`}
    {...props}
  />
));
DrawerOverlay.displayName = VaulDrawer.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Content>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <VaulDrawer.Content
      ref={ref}
      className={`fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[90%] flex-col rounded-t-[24px] bg-bg-secondary outline-none ${className}`}
      {...props}
    >
      <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-border-color" />
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </VaulDrawer.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`grid gap-1.5 p-4 text-center sm:text-left ${className}`}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-auto flex flex-col gap-2 p-4 ${className}`} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Title>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Title>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Title
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight text-text-primary ${className}`}
    {...props}
  />
));
DrawerTitle.displayName = VaulDrawer.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Description>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Description>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Description
    ref={ref}
    className={`text-sm text-text-secondary ${className}`}
    {...props}
  />
));
DrawerDescription.displayName = VaulDrawer.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
