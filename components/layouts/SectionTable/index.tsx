const SectionTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex-1 p-4">
      <div className="bg-white rounded-lg border border-gray-200">
        {children}
      </div>
    </section>
  );
};

export default SectionTable;
