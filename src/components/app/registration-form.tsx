
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const trendingTopics = [
  'Technology',
  'Health & Wellness',
  'Business & Finance',
  'Lifestyle & Fashion',
  'Entertainment',
  'Sports',
  'Science',
  'Food & Cooking',
  'Travel',
  'Education',
  'Environment',
  'Art & Creativity'
];

const registrationSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  brandInfo: z.string().min(10, { message: 'Brand info must be at least 10 characters.' }),
  selectedTopics: z.array(z.string()).min(1, { message: 'Please select at least one interest.' }),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
    onRegisterSuccess: () => void;
}

export default function RegistrationForm({ onRegisterSuccess }: RegistrationFormProps) {
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      brandInfo: '',
      selectedTopics: [],
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setLoading(true);
    
    initiateEmailSignUp(auth, data.email, data.password,
      (user) => { // onSuccess callback
        if (!firestore) {
          toast({
            variant: 'destructive',
            title: 'Registration Error',
            description: 'Database service is not available. Please try again later.',
          });
          setLoading(false);
          return;
        }

        const userDocRef = doc(firestore, 'users', user.uid);
        const { password, ...userData } = data; // Don't store password in Firestore
        
        // This is a non-blocking write. We don't wait for it to complete.
        setDocumentNonBlocking(userDocRef, {
            ...userData,
            id: user.uid,
            // Initialize empty preferences, can be updated in a profile page later
            writingStyleIds: [],
            preferenceIds: data.selectedTopics
        }, { merge: true });
        
        toast({
          title: 'Registration Successful!',
          description: "Please log in to continue.",
        });
        
        onRegisterSuccess(); // Switch to the login tab
        setLoading(false);
      },
      (error) => { // onError callback
        let description = 'An unexpected error occurred.';
        if (error.code === 'auth/email-already-in-use') {
          description = 'This email is already registered. Please log in or use a different email.';
        } else {
          description = error.message;
        }

        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description,
        });
        setLoading(false);
      }
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Info</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your brand or what you're working on." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Topics Selection */}
            <div className="space-y-4">
              <div>
                <FormLabel>Select Your Interests (choose at least one)</FormLabel>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose topics that interest you to personalize your experience
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {trendingTopics.map((topic) => (
                  <FormField
                    key={topic}
                    control={form.control}
                    name="selectedTopics"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={topic}
                          checked={field.value?.includes(topic)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, topic])
                              : field.onChange(field.value?.filter((value) => value !== topic))
                          }}
                        />
                        <label
                          htmlFor={topic}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {topic}
                        </label>
                      </div>
                    )}
                  />
                ))}
              </div>
              <FormMessage className="text-sm">
                {form.formState.errors.selectedTopics?.message}
              </FormMessage>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
