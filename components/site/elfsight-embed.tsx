"use client";

import { ElfsightWidget } from "react-elfsight-widget";

interface ElfsightEmbedProps {
  appId: string;
}

export function ElfsightEmbed({ appId }: ElfsightEmbedProps) {
  return (
    <ElfsightWidget widgetId={appId} lazy="disabled" className="max-w-full" />
  );
}
