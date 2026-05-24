"use client";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { IMAGES } from "@/lib/images";
export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Orders</h1>
      <p className="text-gray-500 text-sm mb-6">Restaurant and room service orders</p>
      <div className="card text-center py-16 relative overflow-hidden">
        <Image src={IMAGES.pool} alt="" fill className="object-cover object-center opacity-5 pointer-events-none" sizes="400px" />
        <div className="relative">
          <ShoppingCart className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500">No orders yet.</p>
        </div>
      </div>
    </div>
  );
}
