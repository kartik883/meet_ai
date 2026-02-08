"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  MeetingsView,
  MeetingsLoadingState,
  MeetingsErrorState,
} from "./meetings-view";

export const MeetingsClientBoundary = () => {
  return (
    <Suspense fallback={<MeetingsLoadingState />}>
      <ErrorBoundary fallback={<MeetingsErrorState />}>
        <MeetingsView />
      </ErrorBoundary>
    </Suspense>
  );
};
