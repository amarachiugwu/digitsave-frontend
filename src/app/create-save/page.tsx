import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { BackArrowIcon } from "@/icon";
import Link from "next/link";
import CreateSaveForm from "@/components/dashboard/CreateSaveForm";

export default function CreateSave() {
  return (
    <main className="text-neutral-2">
      <Header />
      <section className="flex min-h-screen border-t border-tertiary-6">
        <div className="w-1/5">
          <div className="w-1/5 fixed">
            <Sidebar />
          </div>
        </div>

        <div className="w-4/5 flex flex-col">
          <Link href="/save" className="flex gap-2 p-6 pb-2 items-center">
            <BackArrowIcon />
            <p className="text-tertiary-4">Back</p>
          </Link>

          <div className="p-6 pb-0">
            <h1 className="font-bold text-2xl">Savings</h1>
            <p className="text-tertiary-4 font-medium text-xl">
              Let’s see how well you are doing.
            </p>
          </div>

          <section className="w-full m-h-screen w-4/4 px-6 py-10">
            <div className="flex flex-col rounded-md gap-4 w-full border border-tertiary-4">
              <h1 className="font-swiss text-2xl p-6 border-b border-tertiary-4 w-full">
                Create safelock
              </h1>

              <div className="w-3/5 mx-auto py-6">
                <CreateSaveForm />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
