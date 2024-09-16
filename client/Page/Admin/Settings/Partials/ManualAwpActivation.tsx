import { FormEvent, useState } from 'react';
import { Button } from '@/Components/ui/button';
import Textarea from '@/Components/ui/Textarea';
import * as Form from '@radix-ui/react-form';
import { usePage } from '@/Providers/PageProvider';
import { useRestRequest } from '@/Providers/RestRequestProvider';

export function ManualAwpActivation() {
  const { adminRequest, tryRequest } = useRestRequest();
  const { page } = usePage();

  const [ fieldsVisible, setFieldsVisible ] = useState( false );
  const [ apiKey, setApiKey ] = useState( '' );
  const [ saving, setSaving ] = useState( false );
  const [ serverErrors, setServerErrors ] = useState( {
    apiKey: '',
  } );

  function showFields() {
    setFieldsVisible( ! fieldsVisible );
  }

  async function saveManualToken( event: FormEvent< HTMLFormElement > ) {
    event.preventDefault();

    const data = await tryRequest(
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

    if ( ! data.data?.success ) {
      setServerErrors( { ...serverErrors, apiKey: data.data.message } );
      console.error( data.data.message );
    } else {
      document.location.reload();
    }
  }

  return (
    <div className="pt-4">
      If you are on a localhost or behind a basic auth you can{ ' ' }
      <span onClick={ showFields } className="underline cursor-pointer">
        Manually Connect AI services
      </span>
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
                href={`${page.api_host}/manually_connect_site?url=${encodeURIComponent(page.home_url)}`}>
                Get your api key
              </a>
            }></Textarea>
          <Form.Submit asChild>
            <Button className="w-full mt-4" variant="brand" isBusy={ saving }>
              Connect
            </Button>
          </Form.Submit>
        </Form.Root>
      ) }
    </div>
  );
}
