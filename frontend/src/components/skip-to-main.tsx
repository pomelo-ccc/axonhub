const SkipToMain = () => {
  return (
    <a
      className={`fixed left-44 z-999 -translate-y-52 rounded-full border border-border/80 bg-background/95 px-4 py-2 text-sm font-medium whitespace-nowrap text-foreground opacity-95 shadow-none transition focus:translate-y-3 focus:transform focus-visible:ring-1 focus-visible:ring-ring`}
      href='#content'
    >
      Skip to Main
    </a>
  );
};

export default SkipToMain;
