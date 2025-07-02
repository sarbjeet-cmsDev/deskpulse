"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@heroui/react";
import { Input } from "./Form/Input";
  
  export default function AddTask() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
    return (
      <>
        <Button onPress={onOpen} className="mt-2 bg-[#7980ff] text-white">+ Add Project</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add Project</ModalHeader>
                <ModalBody>
                  <form>
                    <div>
                        <label className="mb-2 block">Project Name <span className="text-red-500">*</span></label>
                        <Input value=''
                        placeholder="Enter project name"/>
                    </div>
                  </form>
                </ModalBody>
                <ModalFooter className="justify-start">
                  <Button color="primary" onPress={onClose} className="bg-[#7980ff]">
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  