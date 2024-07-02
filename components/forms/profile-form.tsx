"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserProfileSchema } from "@/lib/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { User } from "@prisma/client";

type Props = {
  user: User;
  onUpdate: (data: z.infer<typeof EditUserProfileSchema>) => void;
};

const ProfileForm = ({ user, onUpdate }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof EditUserProfileSchema>>({
    mode: "onChange",
    resolver: zodResolver(EditUserProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const handleSubmit = (data: z.infer<typeof EditUserProfileSchema>) => {
    setIsLoading(true);
    onUpdate(data);
    setIsLoading(false);
  };

  useEffect(() => {
    form.reset({
      name: user.name || "",
      email: user.email || "",
    });
  }, [form, user.email, user.name]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          disabled={isLoading}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Full Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} placeholder="Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading || true}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="self-start hover:bg-[#2F006B] hover:text-white"
          type="submit"
          disabled={!form.formState.dirtyFields.name || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save User Settings"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
