import { Button as HeroButton } from "@heroui/button";
type ButtonProps = React.ComponentProps<typeof HeroButton>;

export const Button = ({ children, ...props }: ButtonProps) => {
  return <HeroButton {...props}>{children}</HeroButton>;
};
