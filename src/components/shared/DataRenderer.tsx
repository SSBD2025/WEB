import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";

interface Props<T> {
  status: "loading" | "success" | "error" | "pending";
  error?: {
    title: string;
    details: string;
  };
  data: T | T[] | null | undefined;
  empty?: {
    title: string;
    message: string;
  };
  render: (data: T extends unknown[] ? T : T[]) => React.ReactNode;
  className?: string;
}

interface StateSkeletonProps {
  title: string;
  message: string;
}

const StateSkeleton = ({ title, message }: StateSkeletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center">
    <h2 className="text-2xl font-bold leading-8">{title}</h2>
    <p className="max-w-md text-center text-sm font-normal leading-5">
      {message}
    </p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="mt-16 flex w-full justify-center">
    <span className="loading loading-spinner loading-lg" />
  </div>
);

const DataRenderer = <T,>({
                            status,
                            error,
                            data,
                            empty = DEFAULT_EMPTY,
                            render,
                            className = "",
                          }: Props<T>) => {
  if (status === "loading") return <LoadingSkeleton />;
  if (status === "error")
    return (
        <StateSkeleton
            title={error?.title || DEFAULT_ERROR.title}
            message={error?.details || DEFAULT_ERROR.message}
        />
    );
  if (Array.isArray(data) && data.length === 0)
    return <StateSkeleton title={empty.title} message={empty.message} />;
  if (!data)
    return <StateSkeleton title={empty.title} message={empty.message} />;
  return <div className={`h-full ${className}`}>{render(data as T extends unknown[] ? T : T[])}</div>;
};

export default DataRenderer;
