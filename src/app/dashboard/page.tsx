"use client";
import { useToast } from "@/components/hooks/use-toast";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { acceptingMessagesSchema } from "@/schemas/acceptMessagesSchema";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
// import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof acceptingMessagesSchema>>({
    resolver: zodResolver(acceptingMessagesSchema),
  });
  const { register, setValue, watch } = form;
  const acceptingMessages = watch("acceptingMessages");

  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<apiResponse>("/api/acceptmessage");
      setValue("acceptingMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "unable to fetch the status",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsSwitchLoading(false);
      setIsLoading(true);
      try {
        const response = await axios.get("/api/getMessages");
        console.log("mike check");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "fetched the message successfully",
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: axiosError.response?.data.message,
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [toast, setMessages, setIsLoading]
  );

  const handleSwitchState = () => {
    setIsSwitchLoading(true);
    try {
      const response = axios.post<apiResponse>("/api/acceptmessage", {
        acceptingMessage: !acceptingMessages,
      });
      setValue("acceptingMessages", !acceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "unable to fetch the status",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const deleteMessage = (messageId: String) => {
    setMessages((prev) => prev.filter((message) => messageId != message._id)); //TODO: checkpoint
  };

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      fetchAcceptingMessages();
      fetchMessages();
    }
  }, [fetchAcceptingMessages, fetchMessages, toast, setValue, session]);

  if (!session || !session.user) {
    return <div>Please Login...</div>;
  }
  //TODO: The above maybe a redundant check

  const { username } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <div>
        <h3>Copy Your Unique Link</h3>
        <div></div>
        <input type="text" value={profileUrl} disabled={true} />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
      <div>
        <Switch
          {...register("acceptingMessages")}
          checked={acceptingMessages}
          disabled={isSwitchLoading}
          onCheckedChange={handleSwitchState}
        ></Switch>
        <span> Accept Messages: {acceptingMessages ? "On" : "Off"}</span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={deleteMessage}
            />
          ))
        ) : (
          <p>No message to display</p>
        )}
      </div>
    </div>
  );
};

export default page;

//TODO: feature: user can able to reply to messages/questions came from the random, (yet not revealing who sent the message). Also the user can able to block incomming messages from a specific user(user not revield though) , but the sender who got blocked will not that he got blocked.
