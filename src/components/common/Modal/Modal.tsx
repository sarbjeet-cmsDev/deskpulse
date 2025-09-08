import { Modal, ModalBody, ModalContent } from "@heroui/react"

export const CommonModal = ({ children, isOpen, onClose, title }: any) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalBody className="p-6">
                    <h2 className="text-lg font-semibold mb-4">{title}</h2>

                    {children}

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}