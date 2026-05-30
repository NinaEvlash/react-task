import SpinnerIcon from '../../assets/spinner.svg?react';

export default function Spinner() {
  return (
    <div
      data-testid="spinner"
      role="status"
      className="flex justify-center items-center min-h-[200px]"
    >
      <SpinnerIcon
        className="w-12 h-12 text-gray-200 animate-spin fill-blue-500"
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
