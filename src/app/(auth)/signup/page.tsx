"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { signUpSchema } from "@/schemas/signUpSchema";
import * as z from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const page = () => {
  const [username, setusername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const debouncedUsername = useDebounce(username, 2000);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    console.log(debouncedUsername);
    const checkUsernameUnique = async () => {
      if (debouncedUsername.length > 0) {
        setCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<apiResponse>(
            `/api/checkUsernameUnique?username=${debouncedUsername}`
          );
          // let message = response.data.message;
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosErrorr = error as AxiosError<apiResponse>;
          setUsernameMessage(
            axiosErrorr.response?.data.message ??
              "error in checking username unique or not"
          );
        } finally {
          setCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmitt = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      let errorMessage = "error in signing up. Please try again!!!";
      const axiosErrorr = error as AxiosError<apiResponse>;
      // if (error instanceof AxiosError) {
      //   errorMessage = error.response?.data?.message ?? errorMessage;
      // }
      toast({
        title: "sign-up error",
        description: axiosErrorr.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-7 my-7 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3">
            Join Anonymous Messenger
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitt)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setusername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                  {checkingUsername && <Loader2 className="animate-spin" />}
                  {!isLoading && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage == "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                      {/* TODO Fixit: gets duplicate message when errors like
                      leser than 2 or greter than 20 charectors from both zod
                      and shadcn form */}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you Email" {...field} />
                  </FormControl>
                  <FormDescription>
                    We will send you a verification code
                  </FormDescription>
                  {/* <p className="text-muted text-gray-600 text-sm">
                    We will send you a verification code
                  </p> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter you Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
