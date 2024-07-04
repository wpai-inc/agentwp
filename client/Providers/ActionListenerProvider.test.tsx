// ActionListenerProvider.test.tsx
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionListenerProvider from './ActionListenerProvider';
import { useStream } from '@/Providers/StreamProvider';
import { useUserRequests } from '@/Providers/UserRequestsProvider';
import { useClient } from '@/Providers/ClientProvider';
import { useAdminRoute } from './AdminRouteProvider';
import { expect, jest, describe, beforeEach, it } from '@jest/globals';

// Mock the custom hooks
jest.mock( '@/Providers/StreamProvider' );
jest.mock( '@/Providers/UserRequestsProvider' );
jest.mock( '@/Providers/ClientProvider' );
jest.mock( './AdminRouteProvider' );

describe( 'ActionListenerProvider', () => {
  beforeEach( () => {
    jest.clearAllMocks();
  } );

  it( 'executes and continues action when currentAction is present and stream is closed', async () => {
    // Mock the useStream hook
    ( useStream as jest.Mock ).mockReturnValue( {
      streamClosed: true,
      startStreamFromRequest: jest.fn(),
    } );

    // Mock the useUserRequests hook
    ( useUserRequests as jest.Mock ).mockReturnValue( {
      currentAction: {
        action: { ability: 'query', sql: 'SELECT *', args: [] },
        hasExecuted: false,
      },
      currentUserRequestId: 'requestId1',
    } );

    // Mock the useClient hook
    ( useClient as jest.Mock ).mockReturnValue( {
      client: {
        storeAgentResult: jest.fn(),
      },
    } );

    // Mock the useAdminRoute hook
    const mockGet = jest.fn().mockResolvedValue( {
      status: 'success',
      data: {
        results: [],
      },
    } as never );

    ( useAdminRoute as jest.Mock ).mockReturnValue( {
      get: mockGet,
    } );

    render(
      <ActionListenerProvider>
        <div>Child Component</div>
      </ActionListenerProvider>,
    );

    // Verify that the effect is triggered and the action is executed
    await waitFor( () => {
      expect( mockGet ).toHaveBeenCalledWith( 'run_action_query', {
        params: {
          sql: 'SELECT *',
          args: [],
        },
      } );
      expect( useClient().client.storeAgentResult ).toHaveBeenCalledWith( 'requestId1', {
        status: 'success',
        data: {
          results: [],
        },
      } );
    } );
  } );

  it( 'starts a new stream from request when currentAction is final and not executed', () => {
    // Mock the useStream hook
    ( useStream as jest.Mock ).mockReturnValue( {
      streamClosed: true,
      startStreamFromRequest: jest.fn(),
    } );

    // Mock the useUserRequests hook
    ( useUserRequests as jest.Mock ).mockReturnValue( {
      currentAction: { final: true, hasExecuted: false },
      currentUserRequestId: 'requestId1',
    } );

    render(
      <ActionListenerProvider>
        <div>Child Component</div>
      </ActionListenerProvider>,
    );

    // Verify that the startStreamFromRequest function is called
    expect( useStream().startStreamFromRequest ).toHaveBeenCalledWith( 'requestId1' );
  } );

  // Add more tests for other actions and edge cases
} );
