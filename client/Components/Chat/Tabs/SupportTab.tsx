import { useState } from 'react';
import TabContainer from './TabContainer';
import { Label } from '@/Components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Button } from '@/Components/ui/button';
import UpArrowIcon from '@material-design-icons/svg/outlined/arrow_upward.svg?react';
import { LoaderIcon } from 'lucide-react';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export default function SupportTab() {
  const { page } = usePage();
  const { proxyApiRequest } = useRestRequest();
  const [ submitting, setSubmitting ] = useState< boolean >( false );
  const [ message, setMessage ] = useState< string >( '' );
  const [ success, setSuccess ] = useState< boolean >( false );
  const [ messageType, setMessageType ] = useState( 'idea' );

  async function submit( event: React.FormEvent ) {
    event.preventDefault();
    setSubmitting( true );
    const payload: App.Data.SiteSupportRequestData = {
      message,
      type: messageType,
      email: page.user.user_email,
    };

    await proxyApiRequest( 'siteSupport', payload );
    setSuccess( true );
    setSubmitting( false );
  }

  return (
    <TabContainer>
      <div className="mx-auto flex h-full max-w-lg flex-col justify-between p-4">
        <div className="prose mb-4 text-base">
          <h1 className="text-3xl font-semibold">General Feedback</h1>
          <p>Submit general feedback thoughts, and ideas about AgentWP.</p>
          <p>
            For feedback on specific messages please don’t use this - instead rank the message and
            use the resulting UI for more detailed feedback.
          </p>
          <p>This is not a support channel. For account support, click here.</p>
        </div>

        { ! success ? (
          <form onSubmit={ submit } className="mt-auto">
            <RadioGroup
              value={ messageType }
              className="flex justify-between gap-4"
              onValueChange={ setMessageType }>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="idea" id="idea" />
                <Label htmlFor="option-one">Idea</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="question" id="question" />
                <Label htmlFor="question">Question</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug">Bug</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggestion</Label>
              </div>
            </RadioGroup>
            <div className="mt-4 rounded bg-brand-gray p-4 ring-brand-primary focus-within:ring-2">
              <textarea
                className="mb-4 w-full bg-transparent outline-none focus:ring-0"
                rows={ 5 }
                placeholder="Your feedback..."
                value={ message }
                onChange={ e => setMessage( e.target.value ) }></textarea>
              <div className="text-right">
                <Button
                  type="submit"
                  variant="brand"
                  className="h-10 w-10 rounded bg-brand-primary"
                  disabled={ submitting }>
                  { submitting ? (
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <UpArrowIcon className="h-5 w-5" />
                  ) }
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <p className="rounded-full bg-green-100 px-3 py-1 text-green-900">
            Thank you for your message!
          </p>
        ) }
      </div>
    </TabContainer>
  );
}
