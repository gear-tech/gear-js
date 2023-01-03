import { Menu, Transition } from '@headlessui/react';
import { Fragment, useContext, useState } from 'react';
import clsx from 'clsx';
import { Icon } from 'components/ui/icon';
import { TransferAccountPopup } from 'components/popups/transfer-account-popup';
import { ApproveAccountPopup } from 'components/popups/approve-account-popup';
import { LessonsContext } from '../../../app/context';

export const AccountActionsMenu = () => {
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const isApproved = false;
  const { lesson, setTamagotchi } = useContext(LessonsContext);
  const simple = lesson < 3;

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
                  {!simple && (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={clsx(
                              'flex items-center gap-2 w-full px-6 py-2 text-white transition-colors',
                              active && 'text-opacity-70',
                            )}
                            onClick={() => setOpenTransfer(true)}>
                            <Icon name="transfer" className="w-5 h-5" />
                            Transfer
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={clsx(
                              'flex items-center gap-2 w-full px-6 py-2 text-white transition-colors',
                              active && 'text-opacity-70',
                            )}
                            onClick={() => setOpenApprove(true)}>
                            <Icon name="check" className="w-5 h-5" />
                            {!isApproved ? 'Approve' : 'Revoke approval'}
                          </button>
                        )}
                      </Menu.Item>
                    </>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={clsx(
                          'flex items-center gap-2 w-full px-6 py-2 text-white transition-colors',
                          active && 'text-opacity-70',
                        )}
                        onClick={() => setTamagotchi(undefined)}>
                        <Icon name="upload" className="w-5 h-5" />
                        Upload Contract
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      {openTransfer && <TransferAccountPopup close={() => setOpenTransfer(false)} />}
      {openApprove && <ApproveAccountPopup close={() => setOpenApprove(false)} />}
    </div>
  );
};
