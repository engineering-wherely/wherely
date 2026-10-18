import linkedInLogo from '@/features/forms/personal-details/assets/linkedin.png';
import type { PersonalDetails } from '@/features/forms/personal-details/types';
import { cn } from '@/shadcn-ui/lib/utils';
import { BriefcaseBusiness, Download, Mail, MapPin, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden='true'
      className={cn(className, 'inline-flex size-4 items-center justify-center bg-white')}
    >
      <img
        src={linkedInLogo}
        alt=''
        className='h-auto w-full'
      />
    </span>
  );
}

export type PersonalDetailsCardProps = {
  details: PersonalDetails;
  className?: string;
  /** Content displayed beside the name, such as popup actions. */
  headerActions?: ReactNode;
};

/** A compact, public-facing professional profile and contact card. */
export function PersonalDetailsCard({
  details,
  className,
  headerActions,
}: PersonalDetailsCardProps) {
  const firstName = details.firstName.trim();
  const lastName = details.lastName.trim();
  const name = [firstName, lastName].filter(Boolean).join(' ');
  const initials = `${Array.from(firstName)[0] ?? ''}${Array.from(lastName)[0] ?? ''}`;
  const email = details.emailAddress.trim();
  const links = [
    {
      label: firstName ? `Email ${firstName}` : 'Email',
      href: email ? `mailto:${email}` : '',
      icon: Mail,
    },
    { label: 'LinkedIn', href: details.linkedInUrl?.trim(), icon: LinkedInLogo },
    { label: 'Download CV', href: details.cvUrl?.trim(), icon: Download },
  ].filter(({ href }) => href);
  const rows = [
    { label: 'Location', value: details.location.trim(), icon: MapPin },
    { label: 'Work eligibility', value: details.rightToWork.trim(), icon: BriefcaseBusiness },
  ].filter(({ value }) => value);

  return (
    <section
      aria-label='Personal details'
      className={cn(
        '@container w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
    >
      <div className='relative p-5 before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-r-full before:bg-primary/40'>
        <header className='flex items-start gap-3'>
          <div
            aria-hidden='true'
            className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold uppercase text-primary'
          >
            {initials || <UserRound className='size-5' />}
          </div>
          <div className='min-w-0 flex-1'>
            <h2 className='text-lg font-semibold leading-snug tracking-tight [overflow-wrap:anywhere]'>
              {name || 'Name not provided'}
            </h2>
            {details.professionalTitle.trim() && (
              <p className='mt-1 text-sm font-medium leading-relaxed text-muted-foreground [overflow-wrap:anywhere]'>
                {details.professionalTitle.trim()}
              </p>
            )}
          </div>
          {headerActions != null && (
            <div className='flex shrink-0 items-center'>{headerActions}</div>
          )}
        </header>
        {rows.length > 0 && (
          <dl className='mt-4 space-y-2.5'>
            {rows.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className='flex items-start gap-2.5'
              >
                <dt className='shrink-0 text-muted-foreground'>
                  <Icon
                    aria-hidden='true'
                    className='mt-0.5 size-4'
                    strokeWidth={1.75}
                  />
                  <span className='sr-only'>{label}</span>
                </dt>
                <dd className='min-w-0 text-sm leading-relaxed [overflow-wrap:anywhere]'>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {links.length > 0 && (
          <nav
            aria-label='Contact and CV'
            className='mt-4 flex flex-col items-start gap-0 border-t border-border pt-3 @min-[28rem]:flex-row @min-[28rem]:flex-wrap @min-[28rem]:gap-x-4 @min-[28rem]:gap-y-2'
          >
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={label === 'LinkedIn' ? '_blank' : undefined}
                rel={label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                className='inline-flex min-h-9 items-start gap-2.5 rounded-md py-1.5 text-sm font-semibold leading-relaxed text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
              >
                <Icon
                  aria-hidden='true'
                  className='mt-0.5 size-4 shrink-0'
                  strokeWidth={1.75}
                />
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
