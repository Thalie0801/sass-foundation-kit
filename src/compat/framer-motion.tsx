/* eslint-disable react-refresh/only-export-components */
import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from "react";

type MotionProps = {
  animate?: unknown;
  initial?: unknown;
  exit?: unknown;
  variants?: unknown;
  transition?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
  custom?: unknown;
  style?: ComponentPropsWithoutRef<"div">["style"];
};

type MotionComponent<T extends ElementType> = ForwardRefExoticComponent<
  PropsWithoutRef<ComponentPropsWithoutRef<T> & MotionProps> & RefAttributes<unknown>
>;

const cache = new Map<string, MotionComponent<ElementType>>();

function createMotion<T extends ElementType>(type: T): MotionComponent<T> {
  return forwardRef<unknown, ComponentPropsWithoutRef<T> & MotionProps>(({ children, ...rest }, ref) =>
    createElement(type, { ref, ...rest }, children),
  );
}

export const motion = new Proxy({} as Record<string, MotionComponent<ElementType>>, {
  get(target, key: string) {
    if (!cache.has(key)) {
      const component = createMotion(key as ElementType);
      cache.set(key, component);
      target[key] = component;
    }
    return cache.get(key) as MotionComponent<ElementType>;
  },
});

export type MotionValue<T> = T;
export const AnimatePresence = ({ children }: { children: ReactNode }) => <>{children}</>;

export default { motion, AnimatePresence };
