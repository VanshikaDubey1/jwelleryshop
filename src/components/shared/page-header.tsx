type PageHeaderProps = {
  title: string;
  subtitle: string;
  description: string;
};

export function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <div className="text-center">
      <h2 className="text-base font-semibold text-primary tracking-wider uppercase font-headline">
        {subtitle}
      </h2>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
        {title}
      </p>
      <p className="mt-5 max-w-prose mx-auto text-xl text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
