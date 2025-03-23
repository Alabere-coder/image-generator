"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ImageGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    } else {
      setProgress(isLoading ? 95 : 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const generateImage = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Input cannot be Empty, Please enter a description for the image",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.url);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate image. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      console.error("Error generating image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100%] w-[80%] max-lg:w-[100%] flex flex-col justify-center items-center gap-8 rounded-2xl">
      <div className="h-5/6 max-sm:h-4/6 w-4/6 max-md:w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="AI generated image"
            width={200}
            height={200}
            className="h-full w-full object rounded-xl"
          />
        ) : (
          <Skeleton className="h-full w-full flex justify-center items-center rounded-xl border-[#] border-2 bg-[#f8f8ff]">
            <p className="text-[#0a2463] font-semibold">
              {isLoading
                ? "Your Image is been Processed"
                : "Describe your Image below"}
            </p>
          </Skeleton>
        )}
      </div>

      {isLoading && (
        <div className="w-4/6 space-y-2">
          <Progress
            value={progress}
            color="blue"
            className="w-full bg-white text-blue-500"
          />
          <p className="text-sm text-gray-500 text-center">
            Generating your image... {progress.toFixed(0)}%
          </p>
        </div>
      )}

      <div className="flex max-sm:flex-col max-sm:gap-4 w-4/6 max-md:w-full gap-2">
        <Input
          placeholder="Enter image description..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 focus:text-neutral-600 text-neutral-500 bg-neutral-100 py-4 border-neutral-200 outline-[#0a2463] focus:border-[#0a2463] "
          disabled={isLoading}
        />
        <Button
          onClick={generateImage}
          disabled={isLoading}
          className="bg-[#0a2463] border-[#0a2463] border-2 hover:bg-slate-700"
        >
          {isLoading ? <AlertCircle /> : "Generate Image"}
        </Button>
      </div>
    </div>
  );
};

export default ImageGenerator;
