import React, { useState, useEffect, VFC } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Trash2 } from 'react-feather';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { RootState } from 'store/reducers';
import { routes } from 'routes';
import { LogoIcon } from 'assets/Icons';
import { copyToClipboard, isNodeAddressValid } from 'helpers';
import NotificationsIcon from 'assets/images/notifications.svg';
import CodeIllustration from 'assets/images/code.svg';
import close from 'assets/images/close.svg';
import refresh from 'assets/images/refresh2.svg';
import selected from 'assets/images/radio-selected.svg';
import deselected from 'assets/images/radio-deselected.svg';
import copy from 'assets/images/copy.svg';
import { WASM_COMPILER_GET } from 'consts';
import { EventTypes } from 'types/events';
import { Wallet } from '../Wallet';
import { nodeApi } from '../../../api/initApi';
import { setApiReady, resetApiReady, setIsBuildDone, AddAlert } from '../../../store/actions/actions';
import './Header.scss';
import * as init from './init';

export const Header: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const alert = useAlert();

  const isNotifications = location.pathname === routes.notifications;

  const chainName = localStorage.chain ? localStorage.chain : 'Loading ...';

  const { isApiReady } = useSelector((state: RootState) => state.api);
  const { countUnread } = useSelector((state: RootState) => state.notifications);
  let { isBuildDone } = useSelector((state: RootState) => state.compiler);

  if (localStorage.getItem('programCompileId') && !isBuildDone) {
    isBuildDone = true;
  }

  const [nodes, setNodes] = useState(localStorage.nodes ? JSON.parse(localStorage.nodes) : init.nodes);
  const [showNodes, setShowNodes] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string>(nodeApi.address);

  const allNodes = [...nodes[0].nodes, ...nodes[1].nodes];
  const isNodeExist = allNodes.findIndex((node) => node.address === nodeApi.address) > -1;
  const [newNode, setNewNode] = useState(isNodeExist ? '' : nodeApi.address);

  const headerIconsColor = '#fff';

  useEffect(() => {
    if (!isApiReady) {
      setShowNodes(false);
      nodeApi.init().then(() => {
        dispatch(setApiReady());
      });
    }
  }, [dispatch, isApiReady]);

  useEffect(() => {
    let timerId: any;

    if (isBuildDone) {
      const id = localStorage.getItem('programCompileId');

      timerId = setInterval(() => {
        fetch(WASM_COMPILER_GET, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ id }),
        })
          .then((data) => data.json())
          .then((json) => {
            const zip = new JSZip();

            zip.loadAsync(json.file.data).then((data) => {
              data.generateAsync({ type: 'blob' }).then((val) => {
                saveAs(val, `program.zip`);
                dispatch(setIsBuildDone(false));
                localStorage.removeItem('programCompileId');
                clearInterval(timerId);
                dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Program is ready!` }));
              });
            });
          })
          .catch((err) => console.error(err));
      }, 20000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [dispatch, isBuildDone]);

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

  const handleSwitchNode = () => {
    const activeNode = allNodes.filter((elem: any) => elem.isChoose);

    if (activeNode && activeNode.length) {
      // remove node param from url to update it during nodeApi init
      const { search } = location;
      const searchParams = new URLSearchParams(search);
      searchParams.delete('node');
      // push instead of replace to preserve previous node param history
      history.push({ search: searchParams.toString() });

      localStorage.setItem('node_address', activeNode[0].address);
      localStorage.setItem('nodes', JSON.stringify(nodes));
      dispatch(resetApiReady());
      window.location.reload();
    }
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
        <button type="button" onClick={handleShowListOfNodes} className="add_node">
          Change node
        </button>
        <div className="headder__chain-block">
          <p className="headder__chain-text">{!isApiReady ? 'Loading ...' : chainName}</p>
        </div>
      </div>
      <div className="header__right-block">
        <Link to={routes.editor} className="header__right-block_ide">
          IDE
        </Link>
        <div className="header__user-block user-block">
          <Wallet />
        </div>
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
        </div>
      </div>

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
                            <button
                              className="nodes__item-btn"
                              type="button"
                              onClick={() => setSelectedNode(node.address)}
                            >
                              <img
                                className="nodes__item-icon"
                                src={node.address === selectedNode ? selected : deselected}
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
                                <Trash2 color="#ffffff" size="22" strokeWidth="1.5" />
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
              onChange={(event) => setNewNode(event.target.value)}
              className="nodes__add-input"
            />
            <button
              type="button"
              onClick={handleAddNode}
              disabled={!isNodeAddressValid(newNode)}
              className="nodes__add-button"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
