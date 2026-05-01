import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <UserButton />
    </header>
  );
}
