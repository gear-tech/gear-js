import { useContext } from 'react';

import { BlocksContext } from 'app/providers/blocks';
import { ChainContext } from 'app/providers/chain';
import { EventsContext } from 'app/providers/events';
import { ModalContext } from 'app/providers/modal';
import { OnboardingContext } from 'app/providers/onboarding';

const useBlocks = () => useContext(BlocksContext);
const useEvents = () => useContext(EventsContext);
const useModal = () => useContext(ModalContext);
const useChain = () => useContext(ChainContext);
const useOnboarding = () => useContext(OnboardingContext);

export { useBlocks, useEvents, useModal, useChain, useOnboarding };
