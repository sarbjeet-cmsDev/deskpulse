import { closeDrawer } from "@/store/slices/drawerSlice";
import { RootState } from "@/store/store";
import { Drawer, DrawerBody, DrawerContent } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

type CommonDrawerProps = {
  type: string;
  children: React.ReactNode;
};

export const CommonDrawer = ({ type, children }: CommonDrawerProps) => {
  const dispatch = useDispatch();
  const {
    isOpen,
    size,
    type: openType,
  } = useSelector((state: RootState) => state.drawer);

  if (!isOpen || openType !== type) return null;

  return (
    <Drawer isOpen={isOpen} size={size} onClose={() => dispatch(closeDrawer())}>
      <DrawerContent>
        {(onClose) => <DrawerBody>{children}</DrawerBody>}
      </DrawerContent>
    </Drawer>
  );
};
