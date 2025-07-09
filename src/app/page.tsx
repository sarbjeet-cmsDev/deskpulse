// import { Link } from "@heroui/link";
// import { Snippet } from "@heroui/snippet";
// import { Code } from "@heroui/code";
// import { button as buttonStyles } from "@heroui/theme";

// import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";

// export default function Home() {
//   return (
//     <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//       <div className="inline-block max-w-xl text-center justify-center">
//         <span className={title()}>Make&nbsp;</span>
//         <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
//         <br />
//         <span className={title()}>
//           websites regardless of your design experience.
//         </span>
//         <div className={subtitle({ class: "mt-4" })}>
//           Beautiful, fast and modern React UI library.
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <Link
//           isExternal
//           className={buttonStyles({
//             color: "primary",
//             radius: "full",
//             variant: "shadow",
//           })}
//           href={siteConfig.links.docs}
//         >
//           Documentation
//         </Link>
//         <Link
//           isExternal
//           className={buttonStyles({ variant: "bordered", radius: "full" })}
//           href={siteConfig.links.github}
//         >
//           <GithubIcon size={20} />
//           GitHub
//         </Link>
//       </div>

//       <div className="mt-8">
//         <Snippet hideCopyButton hideSymbol variant="bordered">
//           <span>
//             Get started by editing <Code color="primary">app/page.tsx</Code>
//           </span>
//         </Snippet>
//       </div>
//     </section>
//   );
// }


import TopHeader from "@/components/IndexPage/TopHeader";
import { H3 } from "@/components/Heading/H3";
import ProjectCard from "@/components/IndexPage/ProjectCard";
import TodayTaskCard from "@/components/IndexPage/TodayTask";
import AddTask from "@/components/addtask";
import { InputSearch } from "@/components/search";

export default function MainPage(){
    return(
        <div>
            {/* <TopHeader/> */}
            <div className="main-content">
                <div className="bg-[#7980ff] ">
                    {/* <div className="pt-[35px] pb-[44px] mt-[-20px]"> */}
                        {/* <InputSearch/> */}
                    {/* </div> */}
                    <div className="rounded-tl-[24px] rounded-tr-[24px] bg-white">
                        <div className="max-w-6xl mx-auto">
                            <div>
                              <AddTask/>  
                            </div>
                            <div className="pt-4 flex justify-between items-center">
                                <H3>Recent Projects</H3>
                                <a href="#" className="font-bold text-[#31394f99]">View All</a>
                            </div>
                            <div className="pt-4 flex justify-center items-center gap-4 flex-wrap flex-row">
                            <a href="#" className="max-w-[calc(50%-1em)]">
                                {/* <ProjectCard/> */}
                            </a>
                                <a href="#" className="max-w-[calc(50%-1em)]">
                                {/* <ProjectCard/> */}
                                </a>
                            </div>
                            <div>
                                <div className="pt-8 flex justify-between items-center">
                                    <H3>Today Tasks</H3>
                                    <a href="#" className="font-bold text-[#31394f99]">View All</a>
                                </div>
                                <div className="mt-[14px]">
                                    <TodayTaskCard/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    );
}