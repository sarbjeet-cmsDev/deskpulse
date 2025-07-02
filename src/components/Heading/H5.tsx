type H5Props = React.ComponentProps<"h5">;

export const H5 = ({ children, className = "", ...props }: H5Props) => {
  return (
    <h5 className={`text-[#31394f] text-[18px] leading-[28px] font-[700] ${className}`} {...props}>
      {children}
    </h5>
  );
};
