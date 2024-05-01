import React from 'react';
import { determineComponentToRender } from '@/lib/utils';

export type ActionType = 'navigateAction' | 'runAction' | 'codeAction' | 'messageAction';

interface RichMessageProps {
  action: ActionType;
  definition: object;
}

const RichMessage = ({
  action,
  definition
}: RichMessageProps) => {
  const component = determineComponentToRender(action, definition);
  return (
    <div>
      <component />
    </div>
  );
};

export default RichMessage;
