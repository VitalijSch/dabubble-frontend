
import { getUsers } from "@/api/user.api";
import { User } from "@/interfaces/user.interface";

export async function checkIfUserExists(
  key: "username" | "email",
  value: string
): Promise<boolean> {
  const users = await getUsers();
  return users.some(
    (user: User) => user[key].toLowerCase() === value.toLowerCase()
  );
}
