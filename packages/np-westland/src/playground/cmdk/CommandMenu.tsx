import { Command } from 'cmdk';
import { Search } from 'lucide-react';

import './CommandMenu.scss';

const CommandMenu = () => {
  return (
    <Command
      label='Command Menu'
      className='command-menu'
    >
      <div className='command-menu__search'>
        <Search className='command-menu__search-icon' />
        <Command.Input
          placeholder='Search commands...'
          className='command-menu__input'
        />
      </div>

      <Command.List className='command-menu__list'>
        <Command.Empty className='command-menu__empty'>
          No results found.
        </Command.Empty>

        <Command.Group
          heading='Letters'
          className='command-menu__group'
        >
          <Command.Item className='command-menu__item'>a</Command.Item>
          <Command.Item className='command-menu__item'>b</Command.Item>
          <Command.Separator className='command-menu__separator' />
          <Command.Item className='command-menu__item'>c</Command.Item>
        </Command.Group>

        <Command.Item className='command-menu__item'>Apple</Command.Item>
      </Command.List>
    </Command>
  );
};

export default CommandMenu;
