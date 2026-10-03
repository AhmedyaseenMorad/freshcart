import { redirect } from "next/navigation";

export default function AllOrdersPage() {
  redirect("/profile/orders");
}