"use client";

import HeaderFooter from "./HeaderFooter";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HeaderFooter>{children}</HeaderFooter>;
}