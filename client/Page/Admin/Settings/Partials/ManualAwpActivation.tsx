import { FormEvent, useState } from 'react';
import { Button } from '@/Components/ui/button';
import Textarea from '@/Components/ui/Textarea';
import * as Form from '@radix-ui/react-form';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';
import { AgentTooltip } from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ManualAwpActivation( {
  accepted,
  onToggleManual,
}: {
  accepted: boolean;
  onToggleManual: ( isManual: boolean ) => void;
} ) {
  const { tryRequest } = useRestRequest();
  const { page, getApiUrl } = usePage();

  const [ fieldsVisible, setFieldsVisible ] = useState( false );
  const [ apiKey, setApiKey ] = useState( '' );
  const [ saving, setSaving ] = useState( false );
  const [ serverErrors, setServerErrors ] = useState( {
    apiKey: '',
  } );

  function showFields() {
    setFieldsVisible( ! fieldsVisible );
    onToggleManual( ! fieldsVisible );
  }

  async function saveManualToken( event: FormEvent< HTMLFormElement > ) {
    event.preventDefault();

    const res = await tryRequest< { settings: any[] } >(
      'post',
      'manual_activation',
      { apiKey },
      () => setSaving( true ),
      ( msg: string ) => {
        setSaving( false );
        setServerErrors( {
          ...serverErrors,
          apiKey: msg || 'Error',
        } );
      },
    );

    if ( ! res.success ) {
      setServerErrors( { ...serverErrors, apiKey: '' } );
      console.error( res.message );
    } else {
      document.location.reload();
    }
  }

  return (
    <div className="flex flex-col">
      { fieldsVisible && (
        <Form.Root
          onSubmit={ event => saveManualToken( event ) }
          onClearServerErrors={ () => setServerErrors( { ...serverErrors, apiKey: '' } ) }>
          <Textarea
            name="apiKey"
            value={ apiKey }
            placeholder={ 'Enter your API key' }
            label={ 'API key' }
            required={ true }
            onChange={ value => setApiKey( value ) }
            validateMessage={ {
              missing: 'Please enter your API key',
              custom: serverErrors.apiKey,
            } }
            labelInstructions={
              <a
                target="_blank"
                className="underline"
                // prettier-ignore
                href={`${getApiUrl('oauthManuallyConnectSite')}?url=${encodeURIComponent(page.home_url)}`}>
                Click here to get your API key
              </a>
            }></Textarea>
          { accepted ? (
            <Form.Submit asChild>
              <Button className="w-full mt-2" variant="brand" size="lg" isBusy={ saving }>
                Connect
              </Button>
            </Form.Submit>
          ) : (
            <AgentTooltip content="Please accept the terms and conditions">
              <div>
                <Button
                  disabled={ true }
                  className={ cn( 'w-full mt-2', 'cursor-not-allowed' ) }
                  variant="brand"
                  size="lg">
                  Connect
                </Button>
              </div>
            </AgentTooltip>
          ) }
        </Form.Root>
      ) }
      <span
        onClick={ showFields }
        className="underline cursor-pointer w-full text-center mt-4 opacity-50">
        { fieldsVisible ? 'Use auto connection (default)' : 'Or, Manually Connect AI services' }
      </span>
    </div>
  );
}
