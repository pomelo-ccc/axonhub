import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { fonts } from '@/config/fonts';
import { cn } from '@/lib/utils';
import { showSubmittedData } from '@/utils/show-submitted-data';
import { useFont } from '@/context/font-context';
import { COLOR_SCHEMES, useTheme } from '@/context/theme-context';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const colorSchemes = COLOR_SCHEMES;

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark'], {
    required_error: 'Please select a theme.',
  }),
  colorScheme: z.enum(colorSchemes, {
    required_error: 'Please select a color scheme.',
  }),
  font: z.enum(fonts, {
    invalid_type_error: 'Select a font',
    required_error: 'Please select a font.',
  }),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

export function AppearanceForm() {
  const { font, setFont } = useFont();
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();

  // This can come from your database or API.
  const defaultValues: Partial<AppearanceFormValues> = {
    theme: theme as 'light' | 'dark',
    colorScheme,
    font,
  };

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  function onSubmit(data: AppearanceFormValues) {
    if (data.font != font) setFont(data.font);
    if (data.theme != theme) setTheme(data.theme);
    if (data.colorScheme != colorScheme) setColorScheme(data.colorScheme);

    showSubmittedData(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='font'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <div className='relative w-max'>
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-[200px] appearance-none font-normal capitalize',
                      'dark:bg-background dark:hover:bg-background'
                    )}
                    {...field}
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDownIcon className='absolute top-2.5 right-3 h-4 w-4 opacity-50' />
              </div>
              <FormDescription className='font-manrope'>Set the font you want to use in the dashboard.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='colorScheme'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Scheme</FormLabel>
              <div className='relative w-max'>
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-[200px] appearance-none font-normal capitalize',
                      'dark:bg-background dark:hover:bg-background'
                    )}
                    {...field}
                  >
                    {colorSchemes.map((scheme) => (
                      <option key={scheme} value={scheme}>
                        {scheme}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDownIcon className='absolute top-2.5 right-3 h-4 w-4 opacity-50' />
              </div>
              <FormDescription className='font-manrope'>Choose your preferred color scheme for the interface.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Theme</FormLabel>
              <FormDescription>Select the theme for the dashboard.</FormDescription>
              <FormMessage />
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='grid max-w-md grid-cols-2 gap-8 pt-2'>
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='light' className='sr-only' />
                    </FormControl>
                    <div className='border-muted hover:border-accent items-center rounded-md border-2 p-1 transition-colors'>
                      <div className='space-y-2 rounded-sm bg-[#f4f2ec] p-2'>
                        <div className='space-y-2 rounded-md border border-stone-200 bg-[#fbfaf7] p-2'>
                          <div className='h-2 w-[80px] rounded-lg bg-stone-200' />
                          <div className='h-2 w-[100px] rounded-lg bg-stone-200' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md border border-stone-200 bg-[#fbfaf7] p-2'>
                          <div className='h-4 w-4 rounded-full bg-stone-400' />
                          <div className='h-2 w-[100px] rounded-lg bg-stone-200' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md border border-stone-200 bg-[#fbfaf7] p-2'>
                          <div className='h-4 w-4 rounded-full bg-stone-200' />
                          <div className='h-2 w-[100px] rounded-lg bg-stone-200' />
                        </div>
                      </div>
                    </div>
                    <span className='block w-full p-2 text-center font-normal'>Light</span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='dark' className='sr-only' />
                    </FormControl>
                    <div className='border-muted hover:border-accent items-center rounded-md border-2 p-1 transition-colors'>
                      <div className='space-y-2 rounded-sm bg-[#171614] p-2'>
                        <div className='space-y-2 rounded-md border border-slate-700 bg-slate-900 p-2'>
                          <div className='h-2 w-[80px] rounded-lg bg-slate-600' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-600' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md border border-slate-700 bg-slate-900 p-2'>
                          <div className='h-4 w-4 rounded-full bg-slate-500' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-600' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md border border-slate-700 bg-slate-900 p-2'>
                          <div className='h-4 w-4 rounded-full bg-slate-600' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-600' />
                        </div>
                      </div>
                    </div>
                    <span className='block w-full p-2 text-center font-normal'>Dark</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type='submit'>Update preferences</Button>
      </form>
    </Form>
  );
}
