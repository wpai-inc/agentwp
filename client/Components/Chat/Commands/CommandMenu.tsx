import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';

type SlashCommand = {
  command: string;
  info: string;
  action?: () => void;
};

const commands: SlashCommand[] = [
  { command: 'gb', info: 'Edit gutenberg content' },
  { command: 'goto', info: 'Go to a specific page' },
  { command: 'explain', info: 'Explain a specific topic' },
  { command: 'help', info: 'Get help' },
  // TODO: Automatically add all CPT's and taxonomies
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

export default function CommandMenu( {
  children,
  command,
  setMessage,
  focus = false,
}: {
  children: React.ReactNode;
  command: string;
  setMessage: ( message: string ) => void;
  focus: boolean;
} ) {
  const isSelected = commands.find( cmd => cmd.command === command.slice( 1 ).trim() );
  const open = command.startsWith( '/' ) && ! isSelected;
  const filteredCommands = commands.filter( cmd => cmd.command.includes( command.slice( 1 ) ) );

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
        <Command shouldFilter={ false } loop>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              { filteredCommands.map( ( cmd, idx ) => (
                <CommandItem
                  key={ cmd.command }
                  value={ cmd.command }
                  onSelect={ value => {
                    setMessage( '/' + value + ' ' );
                  } }>
                  <div className="flex gap-2">
                    <code className="font-mono font-semibold bg-brand-dark text-white rounded-full px-2 text-sm">
                      { '/' + cmd.command }
                    </code>
                    <span>{ cmd.info }</span>
                  </div>
                </CommandItem>
              ) ) }
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
