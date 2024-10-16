"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import { Mail } from "lucide-react";
function page() {
  // console.log("working bud");
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-8 gap-7 ">
        <section>
          <h1 className="text-5xl font-bold text-center font-sans">
            Dive into the World of Anonymous Messeging
          </h1>
          <p className="text-center pt-3">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-xs max-h-full "
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4 ">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white mt-2">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}

export default page;
