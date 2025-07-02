type H6Props = React.ComponentProps<"h6">;

export const H6 = ({ children, className = "", ...props }: H6Props) => {
  return (
    <h6 className={`text-[#31394f] text-[14px] leading-[20px] font-[700] ${className}`} {...props}>
      {children}
    </h6>
  );
};
