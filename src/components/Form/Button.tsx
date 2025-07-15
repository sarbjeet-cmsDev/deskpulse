import { Button as HeroButton } from "@heroui/button";
import clsx from "clsx";
type ButtonProps = React.ComponentProps<typeof HeroButton>& {
  className?: string;
};;

export const Button = ({ children,className, ...props }: ButtonProps) => {
  return <HeroButton {...props} className={clsx("!btn-primary", className)}>{children}</HeroButton>;
};
