import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer/footer";
import { ArrowRight } from "lucide-react";
import GitHubIcon from "@mui/icons-material/GitHub";

// SEO config
export const metadata: Metadata = {
  title: "ThinkInk | Home",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta exercitationem ex totam tempore ipsam hic aliquam ab obcaecati deserunt doloremque voluptatibus odio consectetur ullam consequuntur nesciunt, eaque, dolores deleniti accusamus."
};

export default function Home() {
  return (
    <main>
      <div className="h-screen container mx-auto py-4 px-3">
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-left md:text-center scroll-m-20 mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl select-none">
              ThinkInk.
            </h2>

            <p className="w-[80%] md:w-1/2 text-justify md:text-center text-muted-foreground">
              AI-powered CLI tool for practicing professional writing, critical thinking, and behavioral responses. Get instant writing challenges, AI feedback, and PDF reports—all within your terminal. 🚀✍️
            </p>

            <div className="mt-4 flex flex-col md:flex-row justify-evenly items-center select-none">
              <div className="w-[170px] text-center">
                <Link href="https://github.com/digvijay-tech/ThinkInk" target="_blank">
                  <Button variant="secondary" className="cursor-pointer w-full">
                    <GitHubIcon className="h-2 w-2" /> View on GitHub
                  </Button>
                </Link>
              </div>

              <span className="w-[0] h-[10px] md:w-[10px]"></span>

              <div className="w-[170px] text-center">
                <Link href="/login">
                  <Button className="cursor-pointer w-full">
                    Continue Online <ArrowRight />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </main>
  );
}
