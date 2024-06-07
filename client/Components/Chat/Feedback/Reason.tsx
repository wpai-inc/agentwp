import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import IconCancel from '@material-design-icons/svg/outlined/cancel.svg?react';
import { useFeedback } from '@/Providers/FeedbackProvider';
import { Spinner } from '@/Components/Spinner';

const reasons = [ "Didn't follow instructions", 'Not relevant', 'Inaccurate response' ];

export default function Reason() {
  const { sendFeedback, setOpened } = useFeedback();
  const [ reason, setReason ] = useState< string >( '' );
  const [ otherReason, setOtherReason ] = useState< boolean >( false );
  const [ waiting, setWaiting ] = useState< boolean >( false );
  const [ successful, setSuccessful ] = useState< boolean >( false );
  const [ visible, setVisible ] = useState( false );

  async function handleSendMessage( r: string ) {
    setWaiting( true );
    await sendFeedback( false, r );
    setWaiting( false );
    setSuccessful( true );
  }

  function handleSelectOther() {
    setOtherReason( ! otherReason );
    setReason( '' );
  }

  useEffect( () => {
    if ( successful ) {
      setVisible( true );
      const timer = setTimeout( () => setVisible( false ), 3000 );
      return () => clearTimeout( timer );
    }
  }, [ successful ] );

  return successful ? (
    <div
      className={ cn(
        'bg-green-200 text-green-600 text-center px-4 py-2 rounded-lg transition-opacity duration-200 overflow-hidden',
        { 'opacity-0 h-0': ! visible, 'opacity-100 my-6': visible },
      ) }>
      Thank you for your feedback!
    </div>
  ) : (
    <form
      onSubmit={ e => {
        e.preventDefault();
        handleSendMessage( reason );
      } }
      className={ cn( 'p-4 rounded-xl border border-brand-gray-25 w-full' ) }>
      <div className="flex items-center justify-between mb-4">
        <legend>Rating Feedback</legend>
        <button onClick={ () => setOpened( false ) }>
          <IconCancel className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        { reasons.map( r => (
          <Button
            key={ r }
            onClick={ () => handleSendMessage( r ) }
            active={ reason === r }
            type="button">
            { r }
          </Button>
        ) ) }
        <Button
          className={ otherReason ? 'bg-brand-gray-25' : 'bg-brand-gray-50' }
          type="button"
          onClick={ handleSelectOther }>
          Other...
        </Button>
      </div>
      { otherReason && (
        <div className="mt-4">
          <textarea
            value={ reason }
            onChange={ e => setReason( e.target.value ) }
            className="border border-brand-25 p-3 rounded-lg w-full bg-transparent"
          />
          <div className="text-right">
            <Button className="bg-brand-gray-50" type="submit">
              <Spinner show={ waiting } />
              Submit
            </Button>
          </div>
        </div>
      ) }
    </form>
  );
}

function Button( {
  children,
  className,
  active,
  ...rest
}: React.ButtonHTMLAttributes< HTMLButtonElement > & { active?: boolean } ) {
  const buttonClassName = cn(
    'px-4 py-2 rounded-lg border border-brand-gray-25 hover:bg-brand-gray-50 cursor-pointer peer-checked:bg-brand-gray-50',
    className,
    { 'bg-brand-gray-25': active },
  );
  return (
    <button className={ buttonClassName } { ...rest }>
      { children }
    </button>
  );
}
