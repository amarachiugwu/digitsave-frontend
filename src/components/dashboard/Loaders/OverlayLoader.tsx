
const OverlayLoader: React.FC = () => {

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="px-8 py-20 rounded-lg w-[400px] max-w-sm text-center">
        <div className="flex justify-center mb-8">
            <div className="relative w-16 h-16 flex justify-center items-center">
              <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-ring"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlayLoader;
