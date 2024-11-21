import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/Components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { usePage } from '@/Providers/PageProvider';
import { useTranslation } from 'react-i18next';

const formSchema = z.object( {
  apikey: z.string().min( 2, {
    message: 'API key must be at least 2 characters.',
  } ),
} );

export function GeneralForm() {
  const { t } = useTranslation();
  const { page } = usePage();

  const form = useForm< z.infer< typeof formSchema > >( {
    resolver: zodResolver( formSchema ),
    defaultValues: {
      apikey: '',
    },
  } );

  function onSubmit( values: z.infer< typeof formSchema > ) {
    page.admin.request( 'POST', values );
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8">
        <FormField
          control={ form.control }
          name="apikey"
          render={ ( { field } ) => (
            <FormItem>
              <FormLabel>{ t( 'API Key' ) }</FormLabel>
              <FormControl>
                <Input type="password" { ...field } />
              </FormControl>
              <FormDescription>{ t( 'This is your API key' ) }</FormDescription>
              <FormMessage />
            </FormItem>
          ) }
        />
        <Button type="submit">{ t( 'Save' ) }</Button>
      </form>
    </Form>
  );
}
