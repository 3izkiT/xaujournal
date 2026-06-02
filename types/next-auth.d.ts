import "next-auth";
import { UserPlan } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      plan: UserPlan;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    plan: UserPlan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    plan?: UserPlan;
  }
}
