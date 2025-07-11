import {Accordion, AccordionItem} from "@heroui/react";
import {P} from "@/components/ptag";
export default function AccordionMenu() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <Accordion>
      <AccordionItem key="1" aria-label="Accordion 1" title="Project">
        {/* <P className="text-start text-black">Project Listing</P> */}
      </AccordionItem>
      <AccordionItem key="2" aria-label="Accordion 2" title="">
        {defaultContent}
      </AccordionItem>
      <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
        {defaultContent}
      </AccordionItem>
    </Accordion>
  );
}