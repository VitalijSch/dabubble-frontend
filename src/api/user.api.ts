import { User } from "@/interfaces/user.interface";

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

export async function getUsers(): Promise<User[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CREATE_USER}/get-users/`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) {
    console.error("API Error:", response.status);
  }
  return response.json();
}
