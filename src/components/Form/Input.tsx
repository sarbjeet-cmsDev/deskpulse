import { Input as HeroInput } from "@heroui/input";
type InputProps = React.ComponentProps<typeof HeroInput>;

export const Input = ({ children, ...props }: InputProps) => {

  return <HeroInput {...props}>{children}</HeroInput>
  
  
};
