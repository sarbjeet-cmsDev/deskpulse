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

export default function FullDrawerPage() {
  const dispatch = useDispatch();
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="none"
              focusable="false"
              width="20"
              height="20"
              viewBox="0 0 12 12"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1.21 6.3566C1.14197 6.24875 1.10792 6.19487 1.08886 6.11169C1.07454 6.04923 1.07454 5.95077 1.08886 5.88831C1.10792 5.80513 1.14197 5.75125 1.21 5.6434C1.77277 4.75242 3.4477 2.5 6.0002 2.5C8.5527 2.5 10.2276 4.75242 10.7904 5.6434C10.8584 5.75125 10.8925 5.80513 10.9115 5.88831C10.9259 5.95077 10.9259 6.04923 10.9115 6.11169C10.8925 6.19487 10.8584 6.24875 10.7904 6.3566C10.2276 7.24758 8.5527 9.5 6.0002 9.5C3.4477 9.5 1.77277 7.24758 1.21 6.3566Z" />
              <path d="M6.0002 7.5C6.82867 7.5 7.5002 6.82843 7.5002 6C7.5002 5.17157 6.82867 4.5 6.0002 4.5C5.17173 4.5 4.5002 5.17157 4.5002 6C4.5002 6.82843 5.17173 7.5 6.0002 7.5Z" />
            </svg>
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

      <CommonDrawer type="privacy-policy">
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

            <P className="text-start mt-[24px]">
              Not everyone knows how to make a Privacy Policy agreement,
              especially with CCPA or GDPR or CalOPPA or PIPEDA or Australia's
              Privacy Act provisions. If you are not a lawyer or someone who is
              familiar with Privacy Policies, you will be clueless. Some people
              might even take advantage of you because of this. Some people may
              even extort money from you. These are some examples that we want
              to stop from happening to you. We will help you protect yourself
              by generating a Privacy Policy.
            </P>

            <P className="text-start mt-[24px]">
              Our Privacy Policy Generator can help you make sure that your
              business complies with the law. We are here to help you protect
              your business, yourself and your customers.
            </P>

            <P className="text-start mt-[24px]">
              Fill in the blank spaces below and we will create a personalized
              website Privacy Policy for your business. No account registration
              required. Simply generate & download a Privacy Policy in seconds!
            </P>

            <P className="text-start mt-[24px]">
              If you are not a lawyer or someone who is familiar with Privacy
              Policies, you will be clueless. Some people might even take
              advantage of you because of this. Some people may even extort
              money from you. These are some examples that we want to stop from
              happening to you. We will help you protect yourself by generating
              a Privacy Policy.
            </P>

            <P className="text-start mt-[24px]">
              Our Privacy Policy Generator can help you make sure that your
              business complies with the law. We are here to help you protect
              your business, yourself and your customers.
            </P>
          </div>
        </div>
      </CommonDrawer>
    </>
  );
}
