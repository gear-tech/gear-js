import { Hex } from '@gear-js/api';
import { FunctionComponent, SVGProps } from 'react';

type StageType = 'preparation' | 'progress' | 'reveal';

type SVGType = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;

type StateConfigType = {
    Config: {
        betSize: string | undefined;
        entryTimeoutMs: string | undefined;
        moveTimeoutMs: string | undefined;
        playersCountLimit: string | undefined;
        revealTimeoutMs: string | undefined;
    }
}

type StateTimeStampType = {
    CurrentStageTimestamp?: string,
}
type StateTimeLeftType = {
    Deadline?: string,
}

type StateGameStageType = {
    GameStage?: StageType | undefined | {}
}
type StateLobbyType = {
    LobbyList?: Hex[] | string[] | []
}

type TimeType = { hours: string, minutes: string, seconds: string }

type UserMoveType = {name?:string, id?:string, SVG?:React.FunctionComponent<React.SVGProps<SVGSVGElement>>}



export type {
    StageType,
    SVGType,
    StateConfigType,
    StateTimeStampType,
    StateGameStageType,
    StateLobbyType,
    StateTimeLeftType,
    TimeType,
    UserMoveType
};
