import { ReactComponent as EventPlaceholderSVG } from 'shared/assets/images/placeholders/eventPlaceholder.svg';
import { Placeholder } from 'entities/placeholder';

type Props = {
  isEmpty: boolean;
};

const EventsPlaceholder = ({ isEmpty }: Props) => (
  <Placeholder
    block={<EventPlaceholderSVG />}
    title="There is no events yet"
    description="The list is empty while there are no events"
    isEmpty={isEmpty}
    blocksCount={5}
  />
);

export { EventsPlaceholder };
