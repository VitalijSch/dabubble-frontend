import { LoginSchema, LoginUser } from "../interfaces/login.interface";

export async function loginUser(data: LoginSchema): Promise<LoginUser> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CREATE_USER}/login/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return await response.json();
}
