import { Input as HeroInput } from "@heroui/input";
type InputProps = React.ComponentProps<typeof HeroInput>;

// export const Input = ({ children, ...props }: InputProps) => {
export const Input = ({ children,classNames, ...props }: InputProps) => {
  return (
     <HeroInput
      {...props}
      classNames={{
        inputWrapper: "p-7 bg-[#f8fafc] data-[hover=true]:bg-[#f8fafc] text-gray-800",
        ...classNames,
      }}
    >
      {children}
    </HeroInput>
  )
  
  // <HeroInput {...props}>{children}</HeroInput>;
};
