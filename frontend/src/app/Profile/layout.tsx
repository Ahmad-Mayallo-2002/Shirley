import ProfileSidebar from "@/components/ProfileSidebar/ProfileSidebar";
import React from "react";

export default function LayoutProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[200px_1fr] grid-cols-[80px_1fr] border-b-2">
      <ProfileSidebar />
      <div className="my-4 pe-4">{children}</div>
    </div>
  );
}
