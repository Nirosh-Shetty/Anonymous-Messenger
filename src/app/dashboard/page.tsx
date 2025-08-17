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
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// const page = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);

//   const { toast } = useToast();
//   const form = useForm<z.infer<typeof acceptingMessagesSchema>>({
//     resolver: zodResolver(acceptingMessagesSchema),
//   });
//   const { register, setValue, watch } = form;
//   const acceptingMessages = watch("acceptingMessages");

//   const fetchAcceptingMessages = useCallback(async () => {
//     setIsSwitchLoading(true);
//     try {
//       const response = await axios.get<apiResponse>("/api/acceptmessage");
//       setValue("acceptingMessages", response.data.isAcceptingMessages ?? false);
//     } catch (error) {
//       const axiosError = error as AxiosError<apiResponse>;
//       toast({
//         title: "unable to fetch the status",
//         description: axiosError.response?.data.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   }, [setValue, toast]);

//   const fetchMessages = useCallback(
//     async (refresh: boolean = false) => {
//       setIsSwitchLoading(false);
//       setIsLoading(true);
//       try {
//         const response = await axios.get("/api/getMessages");
//         console.log("mike check");
//         setMessages(response.data.messages || []);
//         if (refresh) {
//           toast({
//             title: "fetched the message successfully",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//         const axiosError = error as AxiosError<apiResponse>;
//         toast({
//           title: axiosError.response?.data.message,
//         });
//       } finally {
//         setIsLoading(false);
//         setIsSwitchLoading(false);
//       }
//     },
//     [toast, setMessages, setIsLoading]
//   );

//   const handleSwitchState = () => {
//     setIsSwitchLoading(true);
//     try {
//       const response = axios.post<apiResponse>("/api/acceptmessage", {
//         acceptingMessage: !acceptingMessages,
//       });
//       setValue("acceptingMessages", !acceptingMessages);
//     } catch (error) {
//       const axiosError = error as AxiosError<apiResponse>;
//       toast({
//         title: "unable to fetch the status",
//         description: axiosError.response?.data.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   };

//   const deleteMessage = (messageId: String) => {
//     setMessages((prev) => prev.filter((message) => messageId != message._id)); //TODO: checkpoint
//   };

//   const { data: session } = useSession();

//   useEffect(() => {
//     if (session?.user) {
//       fetchAcceptingMessages();
//       fetchMessages();
//     }
//   }, [fetchAcceptingMessages, fetchMessages, toast, setValue, session]);

//   if (!session || !session.user) {
//     return <div>Please Login...</div>;
//   }
//   //TODO: The above maybe a redundant check

//   const { username } = session.user;
//   const baseUrl = `${window.location.protocol}//${window.location.host}`;
//   const profileUrl = `${baseUrl}/u/${username}`;

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl);
//     toast({
//       title: "URL Copied!",
//       description: "Profile URL has been copied to clipboard.",
//     });
//   };

//   return (
//     <div>
//       <h1>Welcome to Dashboard</h1>
//       <div>
//         <h3>Copy Your Unique Link</h3>
//         <div></div>
//         <input type="text" value={profileUrl} disabled={true} />
//         <Button onClick={copyToClipboard}>Copy</Button>
//       </div>
//       <div>
//         <Switch
//           {...register("acceptingMessages")}
//           checked={acceptingMessages}
//           disabled={isSwitchLoading}
//           onCheckedChange={handleSwitchState}
//         ></Switch>
//         <span> Accept Messages: {acceptingMessages ? "On" : "Off"}</span>
//       </div>
//       <Separator />
//       <Button
//         className="mt-4"
//         variant="outline"
//         onClick={(e) => {
//           e.preventDefault();
//           fetchMessages(true);
//         }}
//       >
//         {isLoading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <RefreshCcw className="h-4 w-4" />
//         )}
//       </Button>
//       <div>
//         {messages.length > 0 ? (
//           messages.map((message, index) => (
//             <MessageCard
//               key={index}
//               message={message}
//               onMessageDelete={deleteMessage}
//             />
//           ))
//         ) : (
//           <p>No message to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default page;

//TODO: feature: user can able to reply to messages/questions came from the random, (yet not revealing who sent the message). Also the user can able to block incomming messages from a specific user(user not revield though) , but the sender who got blocked will not that he got blocked.

// 'use client';

// import { MessageCard } from '@/components/MessageCard';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { Switch } from '@/components/ui/switch';
// import { useToast } from '@/components/ui/use-toast';
// import { Message } from '@/model/User';
// import { apiResponse } from '@/types/apiResponse';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios, { AxiosError } from 'axios';
// import { Loader2, RefreshCcw } from 'lucide-react';
// import { User } from 'next-auth';
// import { useSession } from 'next-auth/react';
// import React, { useCallback, useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptingMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<apiResponse>("/api/acceptmessage");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<apiResponse>("/api/getMessages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<apiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

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
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
