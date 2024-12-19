import ProductDetails from "@/components/ProductDetails/ProductDetails";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <>
      <ProductDetails id={id} />
    </>
  );
}
