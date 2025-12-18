import { GalleryVerticalEnd } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "../utils/axios.ts";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigator = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data: user } = await api.post("/api/login", { email, password });

      if (user) {
        const { data: loginResponse } = await api.post(
          "/api/create-token",
          user
        );

        if (loginResponse.isValid) {
          navigator("/home");
        }

        console.log(loginResponse);
      }
    } catch (error: unknown) {
      let errorMessage =
        "Oops! We couldn't log you in. Please check your email and password.";

      if (error instanceof AxiosError) {
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
      }

      alert(errorMessage);
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <form onSubmit={handleOnSubmit}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <h1 className="text-xl font-bold">Welcome to Hernani Inc.</h1>
            </div>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <Field>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
