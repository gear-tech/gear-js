const getPosition = (anchor: HTMLElement, position: string) => {
  const rect = anchor.getBoundingClientRect();
  const GAP = 8;
  let top = 0;
  let left = 0;
  let transform = '';

  switch (position) {
    case 'top-start': {
      top = rect.top + window.scrollY - GAP;
      left = rect.left + window.scrollX;
      transform = 'translate(0, -100%)';

      break;
    }

    case 'top': {
      top = rect.top + window.scrollY - GAP;
      left = rect.left + window.scrollX + rect.width / 2;
      transform = 'translate(-50%, -100%)';

      break;
    }

    case 'top-end': {
      top = rect.top + window.scrollY - GAP;
      left = rect.right + window.scrollX;
      transform = 'translate(-100%, -100%)';

      break;
    }
    case 'right-start': {
      top = rect.top + window.scrollY;
      left = rect.right + window.scrollX + GAP;
      transform = 'translate(0, 0)';

      break;
    }

    case 'right': {
      top = rect.top + window.scrollY + rect.height / 2;
      left = rect.right + window.scrollX + GAP;
      transform = 'translate(0, -50%)';

      break;
    }

    case 'right-end': {
      top = rect.bottom + window.scrollY;
      left = rect.right + window.scrollX + GAP;
      transform = 'translate(0, -100%)';

      break;
    }

    case 'bottom-start': {
      top = rect.bottom + window.scrollY + GAP;
      left = rect.left + window.scrollX;
      transform = 'translate(0, 0)';

      break;
    }

    case 'bottom': {
      top = rect.bottom + window.scrollY + GAP;
      left = rect.left + window.scrollX + rect.width / 2;
      transform = 'translate(-50%, 0)';

      break;
    }

    case 'bottom-end': {
      top = rect.bottom + window.scrollY + GAP;
      left = rect.right - window.scrollX;
      transform = 'translate(-100%, 0)';

      break;
    }

    case 'left-start': {
      top = rect.top + window.scrollY;
      left = rect.left + window.screenX - GAP;
      transform = 'translate(-100%, 0)';

      break;
    }

    case 'left': {
      top = rect.top + window.scrollY + rect.height / 2;
      left = rect.left + window.screenX - GAP;
      transform = 'translate(-100%, -50%)';

      break;
    }

    case 'left-end': {
      top = rect.bottom + window.scrollY;
      left = rect.left + window.screenX - GAP;
      transform = 'translate(-100%, -100%)';

      break;
    }

    default:
      break;
  }

  return { top, left, transform };
};

export { getPosition };
