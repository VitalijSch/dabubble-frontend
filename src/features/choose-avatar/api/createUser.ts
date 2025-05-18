import { User } from "@/interfaces/user";


export async function createUser(data: User) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CREATE_USER}/create/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    console.error("API Error:", response.status);
  }
  return response.json();
}
