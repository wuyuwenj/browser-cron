"use client";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { handleSignOut } from "@/app/actions/auth";

export function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
}
