"use client";

import React from "react";
import { Button } from "@/components/Form/Button";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import rightarrow from "@/assets/images/rightarrow.png";
import { H5 } from "@/components/Heading/H5";
import { P } from "./ptag";
import { useDispatch } from "react-redux";
import { closeDrawer, openDrawer } from "@/store/slices/drawerSlice";
import { CommonDrawer } from "./common/Drawer/Drawer";
import { EyeIcon } from "./icons";

export default function FullDrawerPage() {
  const dispatch = useDispatch();

  const privacyPolicyData = [
    {
      title:
        "Not everyone knows how to make a Privacy Policy agreement, especially with CCPA or GDPR or CalOPPA or PIPEDA or Australia's Privacy Act provisions. If you are not a lawyer or someone who is familiar with Privacy Policies, you will be clueless. Some people might even take advantage of you because of this. Some people may even extort money from you. These are some examples that we want to stop from happening to you. We will help you protect yourself by generating a Privacy Policy.",
    },
    {
      title:
        "Our Privacy Policy Generator can help you make sure that your business complies with the law. We are here to help you protect your business, yourself and your customers.",
    },
    {
      title:
        "Fill in the blank spaces below and we will create a personalized website Privacy Policy for your business. No account registration required. Simply generate & download a Privacy Policy in seconds!",
    },
    {
      title:
        " If you are not a lawyer or someone who is familiar with Privacy Policies, you will be clueless. Some people might even take advantage of you because of this. Some people may even extort money from you. These are some examples that we want to stop from happening to you. We will help you protect yourself by generating a Privacy Policy.",
    },
    {
      title:
        " Our Privacy Policy Generator can help you make sure that your business complies with the law. We are here to help you protect your business, yourself and your customers.",
    },
  ];
  return (
    <>
      <div className="flex flex-wrap gap-3 w-full mt-6">
        <Button
          onPress={() =>
            dispatch(openDrawer({ size: "full", type: "privacy-policy" }))
          }
          className="min-w-full bg-transparent border-b rounded-none justify-start pb-4 h-auto gap-[20px] pl-0"
        >
          <div className="box-icon w-[36px] h-[36px] bg-[#f6f5f7] rounded-[12px] flex justify-center items-center">
            <EyeIcon />
          </div>
          <span className="text-[#31394f] text-[14px] leading-[16px] font-bold">
            Privacy Policy
          </span>
          <Image
            src={rightarrow}
            alt="right-arrow"
            className="ml-auto w-[20px]"
          />
        </Button>
      </div>

      <CommonDrawer type="privacy-policy" className="leftmenuDrawer">
        <div className="flex justify-center items-center">
          <div className="max-w-6xl min-w-6xl">
            <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
              <div className="w-[2%]">
                <Button
                  className="bg-transparent justify-start p-0 gap-0"
                  onPress={() => dispatch(closeDrawer())}
                >
                  <Image src={leftarrow} alt="Back" width={16} height={16} />
                </Button>
              </div>
              <H5 className="w-[98%] text-center">Privacy Policy</H5>
            </div>
            {privacyPolicyData?.map((item, index) => {
              return (
                <P className="text-start mt-[24px]" key={index}>
                  {item?.title}
                </P>
              );
            })}
          </div>
        </div>
      </CommonDrawer>
    </>
  );
}
