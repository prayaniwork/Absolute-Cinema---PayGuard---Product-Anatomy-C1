import React from 'react';
import { BUDDY_META, type BuddyName } from './buddyMeta';

/** The sprite is a static file in /public, so it stays out of the JS bundle and is cached by the browser. */
const SPRITE_URL = `${import.meta.env.BASE_URL}mascot-sprite.svg`;

interface BuddyProps {
  name: BuddyName;
  /** Rendered height in px; width follows the drawing's aspect ratio. */
  height?: number;
  /** "light" re-inks the buddy for dark panels. */
  tone?: 'ink' | 'light';
  /** Bounces in once on mount. Disabled for reduced-motion users in CSS. */
  pop?: boolean;
  /** Decorative by default. Pass a label only when the buddy carries meaning. */
  label?: string;
  className?: string;
}

export const Buddy: React.FC<BuddyProps> = ({
  name,
  height = 96,
  tone = 'ink',
  pop = false,
  label,
  className = '',
}) => {
  const meta = BUDDY_META[name];
  const cls = ['buddy', tone === 'light' ? 'buddy-light' : '', pop ? 'buddy-pop' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <svg
      className={cls}
      viewBox={`0 0 ${meta.w} ${meta.h}`}
      style={{ height, width: (height * meta.w) / meta.h }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <use href={`${SPRITE_URL}#mk-${name}`} />
    </svg>
  );
};
