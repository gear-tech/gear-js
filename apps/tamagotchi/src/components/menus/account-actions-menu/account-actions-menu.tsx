import { Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { TmgContext } from 'app/context';
import { Icon } from 'components/ui/icon';
import { TransferAccountPopup } from 'components/popups/transfer-account-popup';
import { ApproveAccountPopup } from 'components/popups/approve-account-popup';
import { RevokeApprovalPopup } from 'components/popups/revoke-approval-popup';
import { useAccount } from '@gear-js/react-hooks';
import { decodeAddress } from '@gear-js/api';

export const AccountActionsMenu = () => {
  const { account } = useAccount();
  const { state, setState } = useContext(TmgContext);
  const initialOptions = [
    {
      id: 4,
      label: 'Upload Contract',
      action: () => setState(undefined),
      icon: 'upload',
    },
  ];
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openRevoke, setOpenRevoke] = useState(false);
  const [options, setOptions] = useState([...initialOptions]);

  const getUserActions = () => {
    const isOwner = decodeAddress(account?.address as string) === state?.tamagotchi?.owner;
    const isApproved = Boolean(state?.tamagotchi?.allowedAccount);
    const isCurrentAccountApproved = isApproved
      ? decodeAddress(String(account?.address)) === state?.tamagotchi?.allowedAccount
      : false;
    const result = [];

    if (isOwner || isCurrentAccountApproved) {
      result.unshift({
        id: 1,
        label: 'Transfer',
        action: () => setOpenTransfer(true),
        icon: 'transfer',
      });
    }
    if (isOwner) {
      isApproved
        ? result.push({
            id: 2,
            label: 'Revoke approval',
            action: () => setOpenRevoke(true),
            icon: 'check',
          })
        : result.push({
            id: 3,
            label: 'Approve',
            action: () => setOpenApprove(true),
            icon: 'check',
          });
    }
    return [...result, ...initialOptions];
  };

  useEffect(() => {
    Number(state?.lesson) > 2 ? setOptions(getUserActions()) : setOptions(initialOptions);
  }, [state]);

  return (
    <div className="">
      <Menu as="div" className="relative inline-block">
        {({ open }) => (
          <>
            <Menu.Button
              className={clsx(
                'inline-flex w-full justify-center rounded-full bg-white px-4 py-1.5 text-sm font-semibold font-kanit text-white transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
                open ? 'bg-opacity-30' : 'bg-opacity-10 hover:bg-opacity-30',
              )}>
              Options
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-[#353535] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-2 font-kanit font-semibold text-sm whitespace-nowrap">
                  {options.map((item) => (
                    <Menu.Item key={item.id}>
                      {({ active }) => (
                        <button
                          className={clsx(
                            'flex items-center gap-2 w-full px-6 py-2 text-white transition-colors',
                            active && 'text-opacity-70',
                          )}
                          onClick={item.action}>
                          <Icon name={item.icon} className="w-5 h-5" />
                          {item.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      {openTransfer && <TransferAccountPopup close={() => setOpenTransfer(false)} />}
      {openApprove && <ApproveAccountPopup close={() => setOpenApprove(false)} />}
      {openRevoke && <RevokeApprovalPopup close={() => setOpenRevoke(false)} />}
    </div>
  );
};
