import Image from "next/image";
import { WalletAuthButton } from "@/components/wallet-auth/wallet-auth";
import { Footer } from "@/components/footer/footer";

export default function Login() {
  return (
    <main>
      <div className="h-screen container mx-auto py-4 px-3">
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="mb-4">
              <Image src="/meta-mask-logo.svg" width={100} height={100} alt="MetaMask Logo" />
            </div>

            <h2 className="text-center scroll-m-20 mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl select-none">Connect with MetaMask</h2>

            <p className="w-[80%] md:w-1/2 text-center text-muted-foreground">
              To proceed, please connect your wallet using MetaMask. Make sure MetaMask is installed on your browser.
            </p>

            <div className="mt-4">
              <WalletAuthButton />
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </main>
  );
}
