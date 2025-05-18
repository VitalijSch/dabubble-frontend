export async function getUsers() {
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
