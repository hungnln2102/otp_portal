import React from "react";

interface FestivalStageProps {
  title: string;
  subtitle: string;
}

export const FestivalStage: React.FC<FestivalStageProps> = ({ title, subtitle }) => {
  return (
    <div className="festival-title-stage" aria-labelledby="festival-title">
      <div className="festival-title-stage__inner">
        <h1 id="festival-title" className="festival-title-stage__title">
          {title}
        </h1>
        <p className="festival-title-stage__subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

