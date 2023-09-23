import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col">
      <UserButton afterSignOutUrl="/" />
      <p className="text-3xl text-slate-500 font-bold">
        This is protected route
      </p>
    </div>
  );
}
