"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifiedPage() {
  const router = useRouter();
  const [count, setCount] = useState(3); // 3-second countdown

  useEffect(() => {
    // redirect when countdown reaches 0
    if (count === 0) {
      router.push("/"); // your login page
      return;
    }

    const timer = setTimeout(() => setCount(count - 1), 1000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, [count, router]);

  return (
    <div className="text-center mt-5">
      <h2>✅ Account Verified!</h2>
      <p>You can now log in.</p>
      <p>Redirecting to login in {count} {count === 1 ? "second" : "seconds"}...</p>
    </div>
  );
}