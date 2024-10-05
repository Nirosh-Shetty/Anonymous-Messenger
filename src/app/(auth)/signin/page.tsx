"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmitt = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(response);
    if (response?.error) {
      toast({
        title: "failed to sigin in",
        description: response.error,
        variant: "destructive",
      });
    } else if (response?.url) {
      toast({
        title: "sigined in successully",
        description: "done",
      });
      router.replace("/dashboard");
    }
    setIsLoading(false);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-7 my-7 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-3">
            Welcome back
          </h1>
          <p className="mb-4">Sign in to continue your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitt)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Username/Email" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
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
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            New to here?
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
