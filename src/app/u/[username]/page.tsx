"use client";

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { apiResponse } from "@/types/apiResponse";

const page = () => {
  const params = useParams();
  const { username } = params;

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/sendMessage", {
        username,
        content: data.content,
      });
      toast({
        title: response.data.message,
      });
      setValue("content", "");
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "unable to send Message",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const suggestMessages = () => {};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Public Profile Link</h1>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Message to @{username}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your message"
                    {...field}
                    {...register("content")}
                  />
                </FormControl>
                <FormDescription>Send a message anonymously.</FormDescription>
                <FormMessage>{errors.content?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            Send it !
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default page;

//TODO:check if the username/usr exists before taking it this page. take the params and fetch if user exits(you may need  a new route for this).
