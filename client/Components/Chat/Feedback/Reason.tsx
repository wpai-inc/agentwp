import { useState } from 'react';
import { cn, optimistic } from '@/lib/utils';
import IconClose from '@material-design-icons/svg/outlined/close.svg?react';
import { useFeedback } from '@/Providers/FeedbackProvider';
import { ChatNotice } from '../Notices/ChatNotice';
import { Button } from '@/Components/ui/button';
import { useTranslation } from 'react-i18next';

const reasons = [ "Didn't follow instructions", 'Not relevant', 'Inaccurate response' ];

export default function Reason() {
  const { sendFeedback, setOpened } = useFeedback();
  const [ reason, setReason ] = useState< string >( '' );
  const [ otherReason, setOtherReason ] = useState< boolean >( false );
  const [ successful, setSuccessful ] = useState< boolean >( false );
  const { t } = useTranslation();

  async function handleSendMessage( r: string ) {
    optimistic(
      async () => await sendFeedback( false, r ),
      () => setSuccessful( true ),
      () => setSuccessful( false ),
    );
  }

  function handleSelectOther() {
    setOtherReason( ! otherReason );
    setReason( '' );
  }

  return successful ? (
    <ChatNotice variant="success" dismissable>
      <p>{ t( 'Thank you for your feedback!' ) }</p>
    </ChatNotice>
  ) : (
    <form
      onSubmit={ e => {
        e.preventDefault();
        handleSendMessage( reason );
      } }
      className={ cn( 'w-full rounded-xl border border-brand-gray-25 p-4' ) }>
      <div className="mb-4 flex items-center justify-between">
        <legend>{ t( 'Rating Feedback' ) }</legend>
        <button onClick={ () => setOpened( false ) }>
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        { reasons.map( r => (
          <Button
            key={ r }
            onClick={ () => handleSendMessage( r ) }
            type="button"
            variant="outline">
            { r }
          </Button>
        ) ) }
        <Button
          className={ cn( {
            'bg-brand-gray': otherReason,
            'bg-brand-gray-20': ! otherReason,
          } ) }
          type="button"
          onClick={ handleSelectOther }>
          { t( 'Other...' ) }
        </Button>
      </div>
      { otherReason && (
        <div className="mt-4">
          <textarea
            value={ reason }
            onChange={ e => setReason( e.target.value ) }
            className="w-full rounded-lg bg-brand-gray p-3 ring-brand-primary focus:ring-2"
          />
          <div className="mt-2 text-right">
            <Button variant="brand" type="submit" disabled={ reason.length < 2 }>
              { t( 'Submit' ) }
            </Button>
          </div>
        </div>
      ) }
    </form>
  );
}
