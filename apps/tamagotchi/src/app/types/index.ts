import { FunctionComponent, SVGProps } from 'react';
import { StoreNFTItemDescription } from './tamagotchi-state';

type StageType = 'preparation' | 'progress' | 'reveal';

type SVGType = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;

type StateConfigType =
  | {
      Config: {
        betSize: string;
        entryTimeoutMs: string;
        moveTimeoutMs: string;
        playersCountLimit: string;
        revealTimeoutMs: string;
      };
    }
  | undefined;

type StateTimeStampType = {
  CurrentStageTimestamp?: string;
};

type StateGameStageType = {
  GameStage?: StageType | undefined;
};

type TimeType = { hours: string; minutes: string; seconds: string };

export type { StageType, SVGType, StateConfigType, StateTimeStampType, StateGameStageType, TimeType };
