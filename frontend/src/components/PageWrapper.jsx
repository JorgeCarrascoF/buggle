const PageWrapper = ({ title, headerRight, children, className }) => {
  return (
    <div className={`${className} h-full mt-0`}>
      <div className="flex h-12 mb-2 items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {headerRight && <div className="flex">{headerRight}</div>}
      </div>

      <div className="flex flex-col flex-1 w-full h-[calc(100vh-6rem)] rounded-2xl border border-gray-200 bg-white p-5">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
