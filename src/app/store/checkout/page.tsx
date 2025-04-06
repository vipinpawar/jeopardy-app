"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Item {
  id: string;
  name: string;
  basePrice: number;
  monthlyPrice: number;
  yearlyPrice: number;
  lifetimePrice: number;
  imageUrl: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  membership: "FREE" | "MONTHLY" | "YEARLY" | "LIFETIME";
  addresses?: Address[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  pin: string;
  mobile: string;
  country: string;
}

interface CartItem {
  itemId: string;
  quantity: number;
  name?: string;
  price?: number;
  imageUrl?: string;
}

const CheckoutPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("/api/store/user/profile");
        setUser(profileRes.data.user);

        const cartItemParams = searchParams.getAll("cartItem");
        if (cartItemParams.length > 0) {
          // Handle multiple cart items from "Buy All"
          const itemsPromises = cartItemParams.map(async (param) => {
            const [itemId, quantity] = param.split(":");
            const itemRes = await axios.get(`/api/store/items/getItemById?id=${itemId}`);
            const item = itemRes.data.item;
            return {
              itemId,
              quantity: parseInt(quantity, 10),
              name: item.name,
              price: getPriceForMembership(item),
              imageUrl: item.imageUrl,
            };
          });
          const resolvedItems = await Promise.all(itemsPromises);
          setCartItems(resolvedItems);
        } else {
          // Handle single item from "Buy Now"
          const itemId = searchParams.get("itemId");
          if (!itemId) {
            toast.error("No items selected for checkout.");
            router.push("/store");
            return;
          }
          const itemRes = await axios.get(`/api/store/items/get-item-by-id?id=${itemId}`);
          const item = itemRes.data.item;
          setCartItems([{ itemId, quantity: 1, name: item.name, price: getPriceForMembership(item), imageUrl: item.imageUrl }]);
        }
      } catch (error) {
        toast.error("Error loading checkout data.");
        router.push("/store");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, router]);

  const getPriceForMembership = (item: Item): number => {
    switch (user?.membership) {
      case "MONTHLY":
        return item.monthlyPrice;
      case "YEARLY":
        return item.yearlyPrice;
      case "LIFETIME":
        return item.lifetimePrice;
      default:
        return item.basePrice;
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  const handlePayPalPayment = async (data: any, actions: any) => {
    const total = calculateTotal();
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2),
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      await actions.order.capture();
      await axios.post("/api/store/purchase", {
        cartItems: cartItems.map((item) => ({ itemId: item.itemId, quantity: item.quantity })),
      });
      toast.success("Purchase successful!");
      router.push("/store/profile");
    } catch (error) {
      toast.error("Payment failed.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-indigo-600" />
      </div>
    );
  }

  if (!user || cartItems.length === 0) {
    return <div className="text-center py-12">Error loading checkout data.</div>;
  }

  const shippingAddress = user.addresses?.[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button
        onClick={() => router.push("/store")}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition mb-5"
      >
        Back to Store
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Login Details */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Login Details</h2>
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Mobile:</strong> {shippingAddress?.mobile || "Not provided"}</p>
        </div>

        {/* Shipping Address */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          {shippingAddress ? (
            <>
              <p>{shippingAddress.street}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pin}</p>
              <p>{shippingAddress.country}</p>
              <p>{shippingAddress.mobile}</p>
            </>
          ) : (
            <p className="text-red-500">Please add a shipping address in your profile.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.itemId} className="flex items-center space-x-4 mb-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <p><strong>{item.name}</strong></p>
                <p className="text-green-600 font-semibold">${item.price} x {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right">
            <p><strong>Total:</strong> ${calculateTotal()}</p>
          </div>
        </div>

        {/* Payment Option */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Option</h2>
          {shippingAddress ? (
            <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test" }}>
              <PayPalButtons
                createOrder={handlePayPalPayment}
                onApprove={handlePayPalApprove}
                onError={() => toast.error("Payment error occurred.")}
              />
            </PayPalScriptProvider>
          ) : (
            <p className="text-red-500">Add a shipping address to proceed with payment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;