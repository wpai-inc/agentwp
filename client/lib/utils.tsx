import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ActionType } from '@/Components/RichMessage/RichMessage';
import Bar from '@/Components/Charts/Bar';
import Line from '@/Components/Charts/Line';
import Pie from '@/Components/Charts/Pie';
import NavigatableButton from '@/Components/Button';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  }
};

export const getStorage = (key: string, defaultValue?: any) => {
  if (typeof window !== 'undefined') {
    const value = window.localStorage.getItem(key);
    return !!value ? value : defaultValue;
  }
};

export const removeStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
};

export const determineComponentToRender = (action: ActionType, definition: any): any => {
  let result: any = {};
  if (action === 'messageAction') {
    const text = definition.text;
    const isGrpah = !!definition.graph;
    const areButtons = !!definition.buttons;

    if (isGrpah) {
      const graphType = definition.graph.graphType;
      const data = definition.graph.data;
      if (graphType === 'bar') {
        result.component = (
          <>
            <p>{text}</p>
            <Bar data={data} valueDataKey="value" xDataKey="label" />
          </>
        );
      } else if (graphType === 'line') {
        result.component = (
          <>
            <p>{text}</p>
            <Line data={data} valueDataKey="value" xDataKey="label" />
          </>
        )
      } else if (graphType === 'pie') {
        result.component = (
          <>
            <p>{text}</p>
            <Pie data={data} valueDataKey="value" dataKey="label" />
          </>
        );
      }
    } else if (areButtons) {
      const buttons = definition.buttons;
      result.component = (
        <>
          {buttons.map(b => (
            <NavigatableButton text={b.label} link={b.url} className={""} />
          ))}
        </>
      );
    }
  } else if (action === 'navigateAction') {

  } else if (action === 'codeAction') {

  } else if (action === 'runAction') {

  }

  return result.component;
}
