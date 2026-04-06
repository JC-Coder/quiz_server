function PageContainer({ children, wide = false }) {
  return (
    <main className={`mx-auto w-full px-6 py-12 ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>
      {children}
    </main>
  );
}

export default PageContainer;
