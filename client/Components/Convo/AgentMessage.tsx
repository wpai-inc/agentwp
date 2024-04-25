// import Ajv from 'ajv';
// import { actionSchema } from '@wpai/schemas';
import type { MessageAction } from '@wpai/schemas';
import MD from '@/Components/MD';

// const ajv = new Ajv();
// const validate = ajv.compile(actionSchema);

export default function AgentMessage({ action }: { action: MessageAction }) {
  // let parsedAction;
  // try {
  //   parsedAction = JSON.parse(action) as MessageAction;
  // } catch (e) {
  //   return (
  //     <div className="bg-blue-500 text-white w-2/3 ml-auto">
  //       Error parsing action JSON.
  //     </div>
  //   );
  // }

  // const valid = validate(parsedAction);
  // if (!valid) {
  //   return (
  //     <div className="bg-red-500 text-white">
  //       Error: Action data is invalid.
  //     </div>
  //   );
  // }
  return <MD>{action?.text ?? 'something went wrong'}</MD>;
}
