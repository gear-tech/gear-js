import React, { useState, useEffect, VFC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import clsx from 'clsx';
import { RootState } from 'store/reducers';
import { routes } from 'routes';
import { copyToClipboard } from 'helpers';
import { LogoIcon, LogoutIcon } from 'assets/Icons';
import NotificationsIcon from 'assets/images/notifications.svg';
import CodeIllustration from 'assets/images/code.svg';
import close from 'assets/images/close.svg';
import refresh from 'assets/images/refresh2.svg';
import selected from 'assets/images/radio-selected.svg';
import deselected from 'assets/images/radio-deselected.svg';
import cancel from 'assets/images/remove-query.svg';
import copy from 'assets/images/copy.svg';
import { Modal } from '../Modal';
import { Keyring } from '../Keyring';
import { RestoreJson } from '../RestoreJson';
import { Wallet } from '../Wallet';
import { nodeApi } from '../../../api/initApi';
import { setApiReady, resetApiReady } from '../../../store/actions/actions';
import './Header.scss';
import githubIcon from '../../../assets/images/github_gray.svg';

export const Header: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const alert = useAlert();

  let showUser =
    [routes.main, routes.uploadedPrograms, routes.allPrograms, routes.notifications].indexOf(location.pathname) > -1;
  if (routes.program.split('/')[1] === location.pathname.split('/')[1]) {
    showUser = true;
  }
  const isNotifications = location.pathname === routes.notifications;

  const chainName = localStorage.chain ? localStorage.chain : 'Loading ...';

  let arrayOfNodes = [];

  if (localStorage.nodes) {
    arrayOfNodes = JSON.parse(localStorage.nodes);
  } else {
    arrayOfNodes = [
      {
        id: 1,
        caption: 'test network',
        nodes: [{ id: 1, custom: false, isChoose: false, address: 'wss://rpc-node.gear-tech.io:443' }],
      },
      {
        id: 2,
        caption: 'development',
        nodes: [{ id: 2, custom: false, isChoose: false, address: 'ws://localhost:9944' }],
      },
    ];
  }

  const { user } = useSelector((state: RootState) => state.user);
  const { isApiReady } = useSelector((state: RootState) => state.api);
  const { countUnread } = useSelector((state: RootState) => state.notifications);

  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRestore, setIsRestore] = useState(false);
  const [isKey, setIsKey] = useState(false);

  const [nodes, setNodes] = useState(arrayOfNodes);
  const [showNodes, setShowNodes] = useState(false);
  const [newNode, setNewNode] = useState('');
  const [isAvailableAddNode, setIsAvailableAddNode] = useState(false);

  let userInfo = '';
  const headerIconsColor = isMobileMenuOpened ? '#282828' : '#fff';
  // const headerUnreadNotificationsCount = countUnread && countUnread >= 100 ? '99+' : countUnread;
  if (user) {
    if (user.email) {
      userInfo = user.email;
    } else if (user.username) {
      userInfo = user.username;
    }
  }

  useEffect(() => {
    if (isOpen || isRestore) document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isRestore]);

  useEffect(() => {
    if (localStorage.getItem('gear_mnemonic') && localStorage.getItem('gear_mnemonic') !== 'undefined') {
      setIsKey(true);
    }
  }, [isOpen, isRestore]);

  useEffect(() => {
    if (!isApiReady) {
      setShowNodes(false);
      nodeApi.init().then(() => {
        dispatch(setApiReady());
      });
    }
  }, [dispatch, isApiReady]);

  const handleCheckNode = (id: number) => {
    setNodes((elems: any) =>
      elems.map((elem: any) => {
        const el = elem;
        el.nodes.map((elInner: any) => {
          const elInn = elInner;
          if (elInn.id === id) {
            elInn.isChoose = true;
          } else {
            elInn.isChoose = false;
          }
          return elInn;
        });
        return el;
      })
    );
  };

  const handleAddNode = () => {
    const nodeToAdd = {
      id: nodes[1].nodes.length + 2,
      custom: true,
      isChoose: false,
      address: newNode,
    };

    setNodes((elems: any) =>
      elems.map((elem: any) => {
        const el = elem;
        if (el.caption === 'development') {
          el.nodes.push(nodeToAdd);
          localStorage.setItem('nodes', JSON.stringify(nodes));
        }
        return el;
      })
    );
  };

  const handleRemoveNode = (id: number) => {
    let allDevNodes = [...nodes[1].nodes];

    allDevNodes = allDevNodes.filter((el) => el.id !== id);

    setNodes((elems: any) =>
      elems.map((elem: any) => {
        const el = elem;
        if (el.caption === 'development') {
          el.nodes = allDevNodes;
          localStorage.setItem('nodes', JSON.stringify(nodes));
        }
        return el;
      })
    );
  };

  const handleChangeNodeName = (value: string) => {
    const pattern = /(ws|wss):\/\/[\w-.]+/gm;

    setNewNode(value);

    if (value.match(pattern)) {
      setIsAvailableAddNode(true);
    } else {
      setIsAvailableAddNode(false);
    }
  };

  const handleSwitchNode = () => {
    const allNodes = [...nodes[0].nodes, ...nodes[1].nodes];

    const activeNode = allNodes.filter((elem: any) => elem.isChoose);

    if (activeNode && activeNode.length) {
      localStorage.setItem('node_address', activeNode[0].address);
      localStorage.setItem('nodes', JSON.stringify(nodes));
      dispatch(resetApiReady());
      window.location.reload();
    }
  };

  const handleMenuClick = () => {
    setIsMobileMenuOpened(!isMobileMenuOpened);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const toggleRestoreModal = () => {
    setIsRestore(!isRestore);
  };

  const handleShowListOfNodes = () => {
    setShowNodes(true);
  };

  const handleCloseListOfNodes = () => {
    setShowNodes(false);
  };

  return (
    <header className="header">
      <div className="header__logo-and-button">
        <Link to={routes.main} className="header__logo">
          <LogoIcon color={headerIconsColor} />
        </Link>
        {showUser && (
          <>
            <button type="button" onClick={handleShowListOfNodes} className="add_node">
              Change node
            </button>
            <div className="headder__chain-block">
              <p className="headder__chain-text">{!isApiReady ? 'Loading ...' : chainName}</p>
            </div>
          </>
        )}
      </div>
      {(showUser && (
        <div className={clsx('header__user-block user-block', isMobileMenuOpened && 'show')}>
          {/* <Link to={routes.notifications} className={clsx('user-block__notifications', isNotifications && 'selected')}>
            <NotificationIcon color={isNotifications ? '#ffffff' : '#858585'} />
            <span>Notifications</span>
            {(headerUnreadNotificationsCount && headerUnreadNotificationsCount > 0 && (
              <div className="notifications-count">{headerUnreadNotificationsCount}</div>
            )) ||
              null}
          </Link> */}
          {(isKey && <Wallet />) || (
            <>
              <Link to={routes.main} className="user-block__restore" onClick={toggleRestoreModal}>
                <span>Restore JSON</span>
              </Link>
              <Link to={routes.main} className="user-block__account" onClick={toggleModal}>
                <span>Add account</span>
              </Link>
            </>
          )}
          <div className="user-block--wrapper">
            <img src={user?.photoUrl ?? githubIcon} alt="avatar" />
            <span className="user-block__name">{userInfo}</span>
          </div>
          <Link to={routes.logout} className="user-block__logout" aria-label="menuLink" onClick={handleMenuClick}>
            <LogoutIcon color={headerIconsColor} />
            <span>Sign out</span>
          </Link>
        </div>
      )) || (
        <nav className={clsx('header__nav', isMobileMenuOpened && 'show')}>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            What is GEAR?
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            How it works
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Use cases
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Competitive analyze
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Team
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Tokenomics
          </button>
          <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
            Timeline
          </button>
          <Link to={routes.main}>
            <button className="header__nav-button" type="button" aria-label="menuLink" onClick={handleMenuClick}>
              Upload
            </button>
          </Link>
        </nav>
      )}
      <div className="header--actions-wrapper">
        <Link to={isNotifications ? routes.main : routes.notifications} className="header__notifications">
          <img src={isNotifications ? CodeIllustration : NotificationsIcon} alt="notifications" />
          {(countUnread && !isNotifications && (
            <div className="indicator">
              <div className="notifications-count mobile" />
            </div>
          )) ||
            null}
        </Link>
        <button
          className={clsx('header__burger', isMobileMenuOpened && 'active')}
          type="button"
          aria-label="burger"
          onClick={handleMenuClick}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {isOpen && <Modal content={<Keyring handleClose={toggleModal} />} handleClose={toggleModal} />}
      {isRestore && (
        <Modal
          title="Restore from JSON"
          content={<RestoreJson handleClose={toggleRestoreModal} />}
          handleClose={toggleRestoreModal}
        />
      )}
      {showNodes && (
        <div className="nodes">
          <div className="nodes__header">
            <button
              type="button"
              aria-label="arrowBack"
              onClick={() => handleSwitchNode()}
              className="nodes__switch-button"
            >
              <img src={refresh} className="nodes__switch-icon" alt="switch node" />
              <span className="nodes-hide-text">Switch</span>
            </button>
            <button
              type="button"
              aria-label="arrowBack"
              onClick={() => handleCloseListOfNodes()}
              className="nodes__hide-button"
            >
              <img src={close} alt="back" />
            </button>
          </div>

          <ul className="nodes__wrap">
            {nodes &&
              nodes.length &&
              nodes.map((nodeItem: any) => (
                <li key={nodeItem.id} className="nodes__item">
                  <p className="nodes__item-caption">{nodeItem.caption}</p>
                  <ul className="nodes__item-list">
                    {nodeItem.nodes &&
                      nodeItem.nodes.length &&
                      nodeItem.nodes.map((node: any) => (
                        <li key={node.id} className="nodes__item-elem">
                          <div className="nodes__item-choose">
                            <button className="nodes__item-btn" type="button" onClick={() => handleCheckNode(node.id)}>
                              <img
                                className="nodes__item-icon"
                                src={node.isChoose ? selected : deselected}
                                alt="radio"
                              />
                              <span className="nodes__item-text">{node.address}</span>
                            </button>
                          </div>
                          <div className="nodes__item-btns">
                            <button
                              className="nodes__item-btn"
                              type="button"
                              onClick={() => copyToClipboard(node.address, alert, 'Node address copied')}
                            >
                              <img className="nodes__item-icon" src={copy} alt="copy node address" />
                            </button>
                            {node.custom && (
                              <button
                                className="nodes__item-btn"
                                type="button"
                                onClick={() => handleRemoveNode(node.id)}
                              >
                                <img className="nodes__item-icon" alt="cancel" src={cancel} />
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>

          <div className="nodes__add">
            <input
              id="addNode"
              type="text"
              value={newNode}
              onChange={(event) => handleChangeNodeName(event.target.value)}
              className="nodes__add-input"
            />
            <button type="button" onClick={handleAddNode} disabled={!isAvailableAddNode} className="nodes__add-button">
              Add
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
