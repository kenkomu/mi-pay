import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={{
        $id: "",
        email: "",
        userId: "",
        dwollaCustomerUrl: "",
        dwollaCustomerId: "",
        firstName: "",
        lastName: "",
        address1: "",
        city: "",
        state: "",
        postalCode: "",
        dateOfBirth: "",
        ssn: ""
      }}/>

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.png" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={{
              $id: "",
              email: "",
              userId: "",
              dwollaCustomerUrl: "",
              dwollaCustomerId: "",
              firstName: "",
              lastName: "",
              address1: "",
              city: "",
              state: "",
              postalCode: "",
              dateOfBirth: "",
              ssn: ""
            }}/>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}