import { cn } from '@/lib/utils.js';

export function Spinner( { show = true }: { show?: boolean } ) {
  return (
    <svg
      className={ cn( 'animate-spin -ml-1 mr-3 h-6 w-6 hidden', {
        'inline-block': show,
      } ) }
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
        stroke="#EBEBEB"
        fill="transparent"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.25 1C8.25 0.585786 8.58579 0.25 9 0.25C13.8325 0.25 17.75 4.16751 17.75 9C17.75 9.41421 17.4142 9.75 17 9.75C16.5858 9.75 16.25 9.41421 16.25 9C16.25 4.99594 13.0041 1.75 9 1.75C8.58579 1.75 8.25 1.41421 8.25 1Z"
        className="fill-brand-primary"
      />
    </svg>
  );
}
