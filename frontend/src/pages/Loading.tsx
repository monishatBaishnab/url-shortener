import { Spinner } from '@/components/ui/spinner';

const Loading = () => {
  return (
    <div className="relative">
      <div className="fixed left-0 right-0 top-0 bottom-0 bg-white z-50 w-ful h-full flex items-center justify-center flex-col gap-2">
        <Spinner className="size-8" />
        <span className="text-display-body font-medium text-sm ml-2">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
