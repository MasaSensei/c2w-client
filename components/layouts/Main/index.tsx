const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full flex flex-col bg-neutral-300">{children}</main>
  );
};

export default Main;
