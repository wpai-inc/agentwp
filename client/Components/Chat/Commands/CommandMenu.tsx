import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import SelectCommand from './Popover/SelectCommand';
import PostEdit from './Popover/PostEdit';

export type SlashCommand = {
  command: string;
  info: string;
  action?: () => void;
};

const commands: SlashCommand[] = [
  { command: 'gb', info: 'Edit gutenberg content' },
  { command: 'goto', info: 'Go to a specific page' },
  { command: 'explain', info: 'Explain a specific topic' },
  { command: 'help', info: 'Get help' },
  // @todo: Automatically add all CPT's and taxonomies
  {
    command: 'new post',
    info: 'Create a new post',
    action: () => {
      document.location.href = '/wp-admin/post-new.php';
    },
  },
  { command: 'new conversation', info: 'Create a new conversation' },
  {
    command: 'edit',
    info: 'Edit a specific page',
    action: () => {},
  },
  { command: 'settings', info: 'Open the settings page' },
  { command: 'dashboard', info: 'Go to Dashboard' },
];

const popoverComponent: {
  [ key: string ]: React.ComponentType< CommandPopoverProps >;
} = {
  select: SelectCommand,
  edit: PostEdit,
};

export type CommandPopoverProps = {
  command: SlashCommand | undefined;
  commands: SlashCommand[];
  handleKeyDown: ( e: React.KeyboardEvent< HTMLElement >, menuFocused: boolean ) => void;
  message: string;
  setMessage: ( message: string ) => void;
  focused: boolean;
};

export default function CommandMenu( {
  children,
  command,
  message,
  setMessage,
  handleKeyDown,
  focused = false,
}: {
  children: React.ReactNode;
  command: string;
  handleKeyDown: ( e: React.KeyboardEvent< HTMLElement >, menuFocused: boolean ) => void;
  message: string;
  setMessage: ( message: string ) => void;
  focused: boolean;
} ) {
  const cmd = command.slice( 1 );
  const selectedCommand = commands.find( c => c.command === cmd.trim() );
  const open = command.startsWith( '/' );
  const filteredCommands = commands.filter( c => c.command.includes( cmd ) );
  const component = selectedCommand ? cmd : 'select';
  const PopoverComponent = popoverComponent[ component ];

  return (
    <Popover open={ open }>
      <PopoverTrigger asChild>{ children }</PopoverTrigger>
      <PopoverContent
        className="w-full"
        side="top"
        align="start"
        onOpenAutoFocus={ ( event: any ) => {
          event.preventDefault();
        } }>
        <PopoverComponent
          message={ message }
          command={ selectedCommand }
          commands={ filteredCommands }
          handleKeyDown={ handleKeyDown }
          setMessage={ setMessage }
          focused={ focused }
        />
      </PopoverContent>
    </Popover>
  );
}
