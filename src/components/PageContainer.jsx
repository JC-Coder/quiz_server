function PageContainer({ children, wide = false }) {
  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <main className={`mx-auto w-full px-5 py-8 sm:px-6 sm:py-10 ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>
        {children}
      </main>
    </div>
  );
}

export default PageContainer;
