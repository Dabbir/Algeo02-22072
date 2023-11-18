import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full border-t-4 border-b-4 border-primary h-12 w-12"></div>
      <span className="ml-3 text-primary">Loading...</span>
    </div>
  );
};

export default Loading;
