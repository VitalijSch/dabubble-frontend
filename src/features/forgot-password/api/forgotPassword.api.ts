export async function forgotPassword(email: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CREATE_USER}/forgot-password/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email}),
    }
  );
  return await response.json();
}
