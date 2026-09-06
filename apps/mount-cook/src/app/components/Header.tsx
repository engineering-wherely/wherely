'use client';

import { Button } from 'np-westland';

export default function Header() {
  return (
    <div className="flex justify-between bg-white p-1">
      <div>Wherely</div>
      <div>
        <Button>Log in</Button>
      </div>
    </div>
  );
}
