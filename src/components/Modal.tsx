import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
  } from "@heroui/react";
  import { Button } from "./Form/Button";
  import Image from 'next/image';
  import rightarrow from "@/assets/images/rightarrow.png";
  import logout from "@/assets/images/logout.png";
  import { H5 } from "./Heading/H5";

  interface ModalDivProps {
  onLogout: () => void;
}

  export default function ModalDiv({ onLogout }: ModalDivProps) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
    return (
      <>
        <Button onPress={onOpen} className="min-w-full bg-transparent border-b rounded-none justify-start pb-4 h-auto gap-[20px] pl-0">
            <div className="box-icon w-[36px] h-[36px] bg-[#f6f5f7] rounded-[12px] flex justify-center items-center">

            <Image src={logout} alt="log-out" className="ml-0 w-[16px]" />
            </div>
            <span className="text-[#f05a5a] text-[14px] leading-[16px] font-bold">
                Log out
            </span>
            <Image src={rightarrow} alt="right-arrow" className="ml-auto w-[20px]" />
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                
                <ModalBody className="p-0">
                  <H5 className="text-center p-4 border-b border-[#31394f1a]">Are you sure, you want to log out?</H5>
                  <Button color="danger" onPress={() => {onLogout(); onClose()}} className="p-4 border-b border-[#31394f1a] bg-transparent text-[#f05a5a] font-bold">
                    Log Out
                  </Button>
                  <Button color="danger" variant="light" onPress={onClose} className="p-4 bg-transparent text-[#31394f99] font-bold data-[hover=true]:bg-transparent">
                    Cancel
                  </Button>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }


  