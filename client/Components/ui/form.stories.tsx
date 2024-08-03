import { Meta, StoryObj } from '@storybook/react';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  FormField,
} from './form';
import { Input } from './input';
import Textarea from './Textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from './button';

const formSchema = z.object( {
  username: z.string().min( 2 ).max( 50 ),
  email: z.string().email(),
  description: z.string(),
} );

const meta: Meta = {
  title: 'Components/Form',
  component: Form,
};

export default meta;

const Template: StoryObj = {
  render: () => {
    const form = useForm< z.infer< typeof formSchema > >( {
      resolver: zodResolver( formSchema ),
      defaultValues: {
        username: '',
      },
    } );

    function onSubmit( values: z.infer< typeof formSchema > ) {
      alert( JSON.stringify( values, null, 2 ) );
    }

    return (
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit( onSubmit ) }>
          <FormItem>
            <FormField
              control={ form.control }
              name="username"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" { ...field } />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              ) }
            />
          </FormItem>

          <FormItem>
            <FormField
              name="email"
              control={ form.control }
              render={ ( { field } ) => (
                <>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input { ...field } type="email" />
                  </FormControl>
                  <FormDescription>Enter your email address</FormDescription>
                  <FormMessage />
                </>
              ) }
            />
          </FormItem>

          <FormItem>
            <FormField
              control={ form.control }
              name="description"
              render={ ( { field } ) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" { ...field } />
                  </FormControl>
                  <FormDescription>The description of the user.</FormDescription>
                  <FormMessage />
                </FormItem>
              ) }
            />
          </FormItem>

          <FormItem>
            <Button type="submit">Submit</Button>
          </FormItem>
        </form>
      </Form>
    );
  },
};

export const DefaultForm = Template;
